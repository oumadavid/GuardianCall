async function simulateTriangulation(currentEvent) {
    // Simulate a 30% chance of "triangulation" for demo effect
    if (Math.random() > 0.7) {
        const offset = 0.0005; // Approx ~50m
        return [
            currentEvent.location.coordinates[0] + (Math.random()) * offset,
            currentEvent.location.coordinates[1] + (Math.random()) * offset
        ];
    }
    return null;
}
module.exports = { simulateTriangulation };