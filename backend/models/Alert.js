const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    confirmed: { type: Boolean, default: false },
    source: { type: String, enum: ['single-sensor', 'triangulated'], required: true },
    sensorReadings: [{
        sensorId: String,
        timestamp: Date,
        confidence: { type: Number, min: 0, max: 100 }
    }],

    status: {
        type: String,
        enum: ['new', 'assigned', 'investigating', 'resolved', 'false_positive'],
        default: 'new'
    },
    assignedRanger: { type: mongoose.Schema.Types.ObjectId, ref: 'Ranger' },
    confidence: { type: Number, min: 0, max: 100, default: 0 },
    audioEvidence: {
        filename: String,
        url: String,
        duration: Number
    },
    notes: String,
    resolutionNotes: String,
    resolvedAt: Date,
    relatedAt: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }]
}, { timestamps: true });

alertSchema.index({ location: '2dsphere' });
alertSchema.index({ timestamp: -1 });
module.exports = mongoose.model('Alert', alertSchema);