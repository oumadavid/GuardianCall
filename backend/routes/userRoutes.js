const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET /api/users/profile - Get current user's profile
router.get('/users/profile', async (req, res) => {
    try {
        // For now, we'll get the first user. Later, add authentication.
        const user = await User.findOne().sort({ createdAt: 1 });
        
        if (!user) {
            // Create a demo user if none exists
            const demoUser = await User.create({
                name: 'Ranger James Kariuki',
                email: 'james.kariuki@guardiancall.org',
                phone: '+254 712 345 678',
                role: 'ranger',
                team: 'Team Alpha',
                badgeNumber: 'RNG-0452',
                station: 'Masai Mara Central Station',
                joinDate: new Date('2022-03-15'),
                status: 'active',
                bio: 'Dedicated wildlife protection specialist with 8 years of experience in anti-poaching operations.',
                stats: {
                    alertsResponded: 147,
                    successfulInterventions: 89,
                    averageResponseTime: '4.2 min',
                    coverageArea: '250 km²'
                },
                certifications: [
                    'Wildlife Protection Advanced',
                    'Emergency First Response',
                    'Advanced Tracking',
                    'Drone Operation'
                ]
            });
            return res.json(demoUser);
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/users/profile - Update user profile
router.patch('/users/profile', async (req, res) => {
    try {
        const updates = req.body;
        
        // For now, update the first user. Later, use authenticated user ID.
        const user = await User.findOneAndUpdate(
            {}, 
            updates, 
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/users/activity - Get user's recent activity
router.get('/users/activity', async (req, res) => {
    try {
        // Mock activity data - in real app, this would come from an Activity model
        const activities = [
            { action: 'Responded to alert', location: 'Sector 12', time: '2 hours ago' },
            { action: 'Completed patrol', location: 'Northern Route', time: '5 hours ago' },
            { action: 'Submitted report', location: 'Incident #045', time: '1 day ago' },
            { action: 'Assigned to alert', location: 'River Crossing', time: '1 day ago' }
        ];
        
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;