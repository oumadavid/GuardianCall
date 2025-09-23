import React from 'react';
import './AlertList.css';
import { useNavigate } from 'react-router-dom';

function AlertList() {
  const alerts = [
    {
      id: 1,
      type: 'Gunshot',
      location: 'Sector 12',
      timestamp: '5 sec ago',
      severity: 'high',
      coordinates: '12.3456, 45.6789'
    },
    {
      id: 2,
      type: 'Gunshot',
      location: 'Near River',
      timestamp: '2 min ago',
      severity: 'high',
      coordinates: '12.3421, 45.6823'
    },
    {
      id: 3,
      type: 'Gunshot',
      location: 'North Boundary',
      timestamp: '7 min ago',
      severity: 'medium',
      coordinates: '12.3398, 45.6756'
    }
  ];

  return (
    <div className="alert-list">
      <div className="alert-list-header">
        <h2 className="alert-list-title">Live Alerts</h2>
        <div className="alert-count">
          <span className="count-number">{alerts.length}</span>
          <span className="count-label">Active</span>
        </div>
      </div>
      
      <div className="alert-list-content">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.severity}`}>
            <div className="alert-header">
              <div className="alert-type">
                <span className="alert-icon">⚠️</span>
                <span className="alert-type-text">{alert.type} Detected</span>
              </div>
              <span className="alert-timestamp">{alert.timestamp}</span>
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
              <button className="action-button primary">Investigate</button>
              <button className="action-button secondary">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="alert-list-footer">
        <button className="view-all-button" onClick={() => navigate('/alerts')}>
          View All Alerts
        </button>
      </div>
    </div>
  );
}

export default AlertList;