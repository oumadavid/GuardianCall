const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        cordinates: { type: [Number], required: true }
    },
    confirmed: { type: Boolean, default: false },
    source: { type: String, enum: ['single-sensor', 'triangulated'], required: true },
    sensorReadings: [{
        sensorId: String,
        timestamp: Date
    }]
}, { timestamps: true });

alertSchema.index({ location: '2dsphere' });
alertSchema.index({ timestamp: -1 });
module.exports = mongoose.model('Alert', alertSchema);