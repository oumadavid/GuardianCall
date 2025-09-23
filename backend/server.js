const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const alertRoutes = require('./routes/alertRoutes');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// API Routes (Pass the io instance to the routes)
app.use('/api', alertRoutes(io));

//Database connection
mongoose.connect(config.mongodbUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDb connection error:', err));


//Socket.io connection
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('disconnected', () => {
        console.log('Client disconnected:', socket.id);
    });
});

//Export io for use in other modules
app.set('io', io);
    //start the server
server.listen(config.port, () => {
    console.log(`Guardiancall backend listening on port: ${config.port}`);
});

module.exports = app;