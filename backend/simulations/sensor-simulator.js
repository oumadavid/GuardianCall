const API_BASE = 'http://localhost:3000/api';

const simulatedEvent = {
    sensorId: 'sensor_alpha_01',
    timestamp: new Date().toISOString(),
    location: {
        type: 'Point',
        coordinates: [36.8219, + (Math.random() - 0.5) * 0.01, -1.2921 + (Math.random() - 0.5) * 0.01]
    }
};

async function simulateShot() {
    try {
        const response = await fetch(`${API_BASE}/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(simulatedEvent)
        });
        const data = await response.json();
        console.log('Simulation successful:', data);
    } catch (error) {
        console.log('Simulation failed:', error);
    }
}

//run the simulation
simulateShot();