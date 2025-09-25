const express = require('express');
const Sensor = require('../models/Sensor');
const router = express.Router();

// GET /api/sensors - Get all sensors
router.get('/sensors', async (req, res) => {
    try {
        const sensors = await Sensor.find();
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;