const express = require('express');
const Alert = require('../models/Alert');
const { simulateTriangulation } = require('../utils/triangulation');
const { getAlertStats } = require('../utils/statsCalculator');
const Ranger = require('../models/Ranger');
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

    //GET .api/alerts/stats - For heatmaps and analytics
    router.get('/alerts/stats', async (req, res) => {
        try {
            const stats = await getAlertStats(req.query);
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET /api/alerts/:id - Get detailed information for a single alert
    router.get('/alerts/:id', async (req, res) => {
        try {
            const alert = await Alert.findById(req.params.id)
                .populate('assignedRanger') // Get ranger details
                // .populate('relatedAlerts'); // Get related alert details
            
            if (!alert) {
                return res.status(404).json({ error: 'Alert not found' });
            }
            
            res.json(alert);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET /api/rangers - Get all rangers for assignment dropdown
    router.get('/rangers', async (req, res) => {
        try {
            const rangers = await Ranger.find({ isActive: true })
                .select('name badgeNumber team phoneNumber currentLocation');
            res.json(rangers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


    //PAtCH /api/alerts/:id - For rangers to confirm an alert
    router.patch('/alerts/:id', async (req, res) => {
        try {
            const { confirmed } = req.body;
            const updatedAlert = await Alert.findByIdAndUpdate(
                req.params.id,
                { confirmed },
                { new: true }
            );
            if (!updatedAlert) {
                return res.status(404).json({ error: 'Alert not found' });
            }
            res.json(updatedAlert);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // PATCH /api.alerts/:id/assign - assign a ranger to an alert 
    router.patch('/alerts/:id/assign', async (req, res) => {
        try {
            const { rangerId, notes } = req.body;

            const updatedAlert = await Alert.findByIdAndUpdate(
                req.params.id,
                {
                    assignedRanger: rangerId,
                    status: 'assigned',
                    notes: notes || '',
                    updatedAt: new Date()
                },
                { new: true }
            ).populate('assignedRanger', 'name badgeNumber team'); //Get ranger details

            if (!updatedAlert) {
                return res.status(404).json({ error: 'Alert not found' });
            }

            res.json(updatedAlert);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // PATCH /api/alerts/:id/notes - Update alert notes
    router.patch('/alerts/:id/notes', async (req, res) => {
        try {
            const { notes } = req.body;

            const updatedAlert = await Alert.findByIdAndUpdate(
                req.params.id,
                {
                    notes: notes,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!updatedAlert) {
                return res.status(404).json({ error: 'Alert not found' });
            }

            res.json(updatedAlert);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // PATCH .api/alerts/:id/status - Update alert status
    router.patch('/alerts/:id/status', async (req, res) => {
        try {
            const { status, resolutionNotes } = req.body;
            const validStatuses = ['new', 'assigned', 'investigating', 'resolved', 'false_positive'];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const updatedAlert = await Alert.findByIdAndUpdate(
                req.params.id,
                {
                    status,
                    resolutionNotes: resolutionNotes || '',
                    resolvedAt: status === 'resolved' || status === 'false_positive' ? new Date() : null
                },
                { new: true }
            );

            if (!updatedAlert) {
                return res.status(404).json({ error: 'Alert not found '});
            }

            res.json(updatedAlert);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    //Utility function to find related alerts 
    async function findRelatedAlerts(alertId, distanceMeters = 2000, timeWindowMinutes = 30) {
        const mainAlert = await Alert.findById(alertId);
        if (!mainAlert) return [];

        const timeWindow = new Date(mainAlert.timestamp.getTime() - timeWindowMinutes * 60 * 1000);

        const relatedAlerts = await Alert.find({
            _id: { $ne: alertId }, //Exclude the current alert
            timestamp: { $gte: timeWindow },
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: mainAlert.location.coordinates
                    },
                    $maxDistance: distanceMeters
                }
            }
        }).limit(5).sort({ timestamp: -1 }); //Get 5 most recent related alerts

        return relatedAlerts;
    }

    return router;
}