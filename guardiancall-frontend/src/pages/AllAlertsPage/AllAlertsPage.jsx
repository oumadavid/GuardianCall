import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './AllAlertsPage.css';

function AllAlertsPage() {
  const navigate = useNavigate(); // Initialize navigation

  // Sample data - in a real app, this would come from an API or context
  const allAlerts = [
    {
      id: 1,
      type: 'Gunshot',
      location: 'Sector 12',
      timestamp: '5 sec ago',
      severity: 'high',
      coordinates: '12.3456, 45.6789',
      status: 'new'
    },
    {
      id: 2,
      type: 'Gunshot',
      location: 'Near River',
      timestamp: '2 min ago',
      severity: 'high',
      coordinates: '12.3421, 45.6823',
      status: 'new'
    },
    {
      id: 3,
      type: 'Gunshot',
      location: 'North Boundary',
      timestamp: '7 min ago',
      severity: 'medium',
      coordinates: '12.3398, 45.6756',
      status: 'investigating'
    },
    {
      id: 4,
      type: 'Gunshot',
      location: 'South Plains',
      timestamp: '15 min ago',
      severity: 'high',
      coordinates: '12.3123, 45.6654',
      status: 'resolved'
    },
    {
      id: 5,
      type: 'Gunshot',
      location: 'East Ridge',
      timestamp: '25 min ago',
      severity: 'medium',
      coordinates: '12.3555, 45.6999',
      status: 'dismissed'
    },
    {
      id: 6,
      type: 'Gunshot',
      location: 'West Valley',
      timestamp: '45 min ago',
      severity: 'low',
      coordinates: '12.3222, 45.6333',
      status: 'resolved'
    },
    {
      id: 7,
      type: 'Gunshot',
      location: 'Central Zone',
      timestamp: '1 hour ago',
      severity: 'high',
      coordinates: '12.3444, 45.6777',
      status: 'investigating'
    },
    {
      id: 8,
      type: 'Gunshot',
      location: 'Northern Outpost',
      timestamp: '2 hours ago',
      severity: 'medium',
      coordinates: '12.3666, 45.7111',
      status: 'resolved'
    }
  ];

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#e53e3e'; // Red
      case 'investigating': return '#3182CE'; // Blue
      case 'resolved': return '#38A169'; // Green
      case 'dismissed': return '#718096'; // Gray
      default: return '#A0AEC0';
    }
  };

  return (
    <div className="all-alerts-page">
      {/* Header with back button and title */}
      <div className="all-alerts-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)} // Go back to previous page
        >
          ← Back
        </button>
        <h1 className="all-alerts-title">All Alerts</h1>
        <div className="alert-stats">
          <span className="total-alerts">{allAlerts.length} Total Alerts</span>
        </div>
      </div>

      {/* Alert list content - reusing the same styles from AlertList.css */}
      <div className="alert-list-content all-alerts-content">
        {allAlerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.severity}`}>
            <div className="alert-header">
              <div className="alert-type">
                <span className="alert-icon">⚠️</span>
                <span className="alert-type-text">{alert.type} Detected</span>
              </div>
              <div className="alert-meta">
                <span 
                  className="alert-status"
                  style={{ backgroundColor: getStatusColor(alert.status) }}
                >
                  {alert.status}
                </span>
                <span className="alert-timestamp">{alert.timestamp}</span>
              </div>
            </div>
            
            <div className="alert-details">
              <div className="alert-location">
                <span className="location-icon">📍</span>
                <span className="location-text">{alert.location}</span>
              </div>
              <div className="alert-coordinates">
                {alert.coordinates}
              </div>
            </div>
            
            <div className="alert-actions">
              <button className="action-button primary" onClick={() => navigate(`/alerts/${alert.id}`)}>View Details</button>
              <button className="action-button secondary">
                {alert.status === 'resolved' ? 'Reopen' : 'Update Status'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllAlertsPage;