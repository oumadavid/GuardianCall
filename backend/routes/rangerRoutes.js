const express = require('express');
const Ranger = require('../models/Ranger');
const router = express.Router();

//GET /api/rangers
router.get('/rangers', async (req, res) => {
    try {
        const rangers = await Ranger.find({ isActive: true});
        res.json(rangers);
    } catch (error) {
        res.status(500).json({ error: error.messge });
    }
});

// GET /api/rangers - Get all rangers
router.get('/rangers', async (req, res) => {
    try {
        const rangers = await Ranger.find({ isActive: true })
            .select('name badgeNumber team currentLocation');
        res.json(rangers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//POST /api/rangers - Create a new ranger 
router.post('/rangers', async (req, res) => {
    try {
        const newRanger = await Ranger(req.body);
        await newRanger.json();
        res.status(201).json(newRanger);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/rangers/:id/location - update ranger's curret location
router.patch('/rangers/:id/location', async (req, res) => {
    try {
        const { coordinates } = req.body;
        const updatedRanger = await Ranger.findByIdAndUpdate(
            req.params.id,
            {
                currentLocation: {
                    type: 'Point',
                    coordinates: coordinates
                }
            },
            { new: true}
        );
        res.json(updatedRanger);
    } catch (error){
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
