const mongoose = require('mongoose');

const rangerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    badgeNumber: { type: String, unique: true },
    phoneNumber: String,
    email: String,
    isActive: { type: Boolean, default: true },
    currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point'},
        coordinates: { type: [Number], default: [0, 0] }
    },
    assignedAlerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }]
}, { timestamps: true });

rangerSchema.index({ currentLocation: '2dsphere' });
module.exports = mongoose.model('Ranger', rangerSchema);