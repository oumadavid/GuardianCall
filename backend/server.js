
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const alertRoutes = require('./routes/alertRoutes');
const rangerRoutes = require('./routes/rangerRoutes');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config');
const africastalking_api = require('africastalking');

require('dotenv').config();

// Initialize Africa's Talking
const africastalking = africastalking_api({
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Debug env check
console.log("Africa's Talking ENV:", {
    username: process.env.AFRICASTALKING_USERNAME,
    apiKeyLoaded: !!process.env.AFRICASTALKING_API_KEY
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Africa's Talking SMS Endpoint
app.post('/api/send-sms', async (req, res) => {
    const { phoneNumber, message, alertDetails } = req.body;
    
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    // Kenyan number validation: +254 followed by 9 digits
    const phoneRegex = /^\+254\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ 
            message: 'Invalid phone number format. Use Kenyan format: +254712345678' 
        });
    }

    try {
        const result = await africastalking.SMS.send({
            to: phoneNumber,
            message
        });

        console.log('SMS sent successfully:', result);

        io.emit('sms_sent', {
            phoneNumber,
            message,
            alertDetails,
            timestamp: new Date().toISOString(),
            result
        });

        res.status(200).json({
            status: "success",
            data: {
                result,
                message: "SMS sent successfully"
            }
        });

    } catch (error) {
        console.error("Africa's Talking Error:", error);

        io.emit('sms_error', {
            phoneNumber,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        res.status(500).json({ 
            message: 'An error occurred while sending SMS',
            error: error.message 
        });
    }
});

// Bulk SMS endpoint
app.post('/api/send-bulk-sms', async (req, res) => {
    const { phoneNumbers, message, alertDetails } = req.body;
    
    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
        return res.status(400).json({ message: 'Phone numbers array is required' });
    }

    const phoneRegex = /^\+254\d{9}$/;
    const invalidNumbers = phoneNumbers.filter(num => !phoneRegex.test(num));
    
    if (invalidNumbers.length > 0) {
        return res.status(400).json({ 
            message: 'Invalid phone number format(s). Use Kenyan format: +254712345678',
            invalidNumbers
        });
    }

    try {
        const result = await africastalking.SMS.send({
            to: phoneNumbers,
            message
        });

        console.log('Bulk SMS sent successfully:', result);

        io.emit('bulk_sms_sent', {
            phoneNumbers,
            message,
            alertDetails,
            timestamp: new Date().toISOString(),
            result
        });

        res.status(200).json({
            status: "success",
            data: {
                result,
                message: `SMS sent to ${phoneNumbers.length} recipients successfully`
            }
        });

    } catch (error) {
        console.error("Africa's Talking Bulk SMS Error:", error);

        io.emit('bulk_sms_error', {
            phoneNumbers,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        res.status(500).json({ 
            message: 'An error occurred while sending bulk SMS',
            error: error.message 
        });
    }
});

// API Routes
app.use('/api', alertRoutes(io));
app.use('/api', rangerRoutes);

// Database connection
mongoose.connect(config.mongodbUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Export io for use in other modules
app.set('io', io);

// Start the server
server.listen(config.port, () => {
    console.log(`Guardiancall backend listening on port: ${config.port}`);
    console.log(`Africa's Talking SMS service is ready`);
});

module.exports = app;
