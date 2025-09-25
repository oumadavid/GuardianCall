const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    role: { type: String, enum: ['ranger', 'admin', 'supervisor'], default: 'ranger' },
    team: String,
    badgeNumber: { type: String, unique: true },
    station: String,
    joinDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    avatar: String,
    bio: String,
    stats: {
        alertsResponded: { type: Number, default: 0 },
        successfulInterventions: { type: Number, default: 0 },
        averageResponseTime: String,
        coverageArea: String
    },
    certifications: [String],
    preferences: {
        pushNotifications: { type: Boolean, default: true },
        emailAlerts: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);