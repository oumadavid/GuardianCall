// Format timestamp to relative time (e.g., "5 min ago")
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    
    return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
};

// Map backend status to frontend status
export const mapStatus = (backendStatus) => {
    const statusMap = {
        'new': 'new',
        'assigned': 'investigating', 
        'investigating': 'investigating',
        'resolved': 'resolved',
        'false_positive': 'dismissed'
    };
    return statusMap[backendStatus] || 'new';
};

// Map backend source to severity
export const mapSeverity = (source, confidence = 0) => {
    if (source === 'triangulated') return 'high';
    if (confidence > 80) return 'high';
    if (confidence > 60) return 'medium';
    return 'low';
};

// Format coordinates for display
export const formatCoordinates = (coords) => {
    if (!coords || !Array.isArray(coords) || coords.length < 2) return 'Unknown location';
    return `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`; // lat, lng
};