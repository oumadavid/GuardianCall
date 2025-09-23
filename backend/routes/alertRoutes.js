const express = require('express');
const Alert = require('../models/Alert');
const { simulateTriangulation } = require('../utils/triangulation');
const router = express.Router();

module.exports = (io) => {
    //POST /api/event - Receive gunshot event from sensor
    router.post('/event', async (req, res) => {
        try {
            const { sensorId, timestamp, location } = req.body;
            if (!sensorId || !location?.coordinates) {
                return res.status(400).json({ error: 'Invalid sensor data: sensorId and location.coordinates are required' });
            }

            // Create new alert
            const newAlert = new Alert({
                location: { type: 'Point', coordinates: location.coordinates },
                source: 'single-sensor',
                sensorReadings: [{ sensorId, timestamp: new Date(timestamp) || Date.now() }]
            });

            // Simulate Triangulation
            const triPoints = await simulateTriangulation({ location });
            if (triPoints) {
                newAlert.location.coordinates = triPoints;
                newAlert.source = 'triangulated';
            }

            // save to Database
            const savedAlert = await newAlert.save();

            // Emit real-time event to all connected clients
            io.emit('new-alert', savedAlert);

            //Respond to sensor
            res.status(201).json({ message: 'Event processed successfully', alert: savedAlert });
        } catch (error) {
            console.error('Error processing event:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    //GET /api/alerts - Fetch historical alerts
    router.get('/alerts', async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const alerts = await Alert.find().sort({ timestamp: -1 }).limit(limit);
            res.json(alerts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}