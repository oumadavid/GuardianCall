// simulations/sensor-simulator.js - Enhanced version

const API_BASE = 'http://localhost:3000/api';

const simulatedEvent = {
    sensorId: 'sensor_alpha_01',
    timestamp: new Date().toISOString(),
    location: {
        type: 'Point',
        coordinates: [36.8219 + (Math.random() - 0.5) * 0.01, -1.2921 + (Math.random() - 0.5) * 0.01]
    }
};

async function simulateShot() {
    try {
        console.log('Sending simulated gunshot event...');
        console.log('Event data:', JSON.stringify(simulatedEvent, null, 2));
        
        const response = await fetch(`${API_BASE}/event`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'User-Agent': 'SensorSimulator/1.0'
            },
            body: JSON.stringify(simulatedEvent)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${data.error}`);
        }
        
        console.log('✅ Simulation successful! Alert created with ID:', data.alert?._id);
        
    } catch (error) {
        console.error('❌ Simulation failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run the simulation
simulateShot();