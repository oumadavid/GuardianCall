const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    sensorId: { type:String, required: true, unique: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    isActive: { type: Boolean, default: true },
    lastPing: { type: Date, default: Date.now }
}, { timestamps: true });

sensorSchema.index({ location: '2dsphere'});
module.exports = mongoose.model('Sensor', sensorSchema);