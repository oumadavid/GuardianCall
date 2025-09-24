// Format coordinates for display 
export const formatCoordinates = (coords) => {
    if (!coords || !Array.isArray(coords) || coords.length < 2) return 'Unknown location';
    return `${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`;
};

//Generate Location name from coordinates 
export const getLocationName = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates)) return "Unknown location";

    const [lng, lat] = coordinates;

    // Simple sector mapping based on coordinate range near Nairobi
    if(lat > -1.29 && lat < -1.28) return 'Central Zone';
    if(lat > -1.28) return 'North Boundary';
    if(lat < -1.30) return 'South Plains';
    if(lng > 36.83) return 'East Ridge';
    if(lng < 36.80) return 'West Valley';
    if(Math.abs(lat - (-1.292)) < 0.002) return 'Sector 12';
    

    return 'Remote Area';
};

//Format Date for display
export const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    return new Date(dateString).toLocaleString();
};

//Format relative time
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';

    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if(diffInSeconds < 60) return 'Just now';
    if(diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if(diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;

    return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
};

// GET SEVERITY FUNCTION
export const getSeverity = (source, confidence = 0) => {
    if (source === 'triangulated') return 'high';
    if (confidence > 80) return 'high';
    if (confidence > 60) return 'medium';
    return 'low';
};

// Get severity color
export const getSeverityColor = (severity) => {
    switch (severity) {
        case 'high': return '#e53e3e';
        case 'medium': return '#ed8936';
        case 'low': return '#38a169';
        default: return '#a0aec0';
    }
};

//Get status color
export const getStatusColor = (status) => {
    switch (status) {
        case 'new': return '#e53e3e';
        case 'assigned': return '#3182ce';
        case 'investigating': return '#3182ce';
        case 'resolved': return '#38a169';
        case 'false_positive': return '#718096';
        default: return '#a0aec0';
    }
};