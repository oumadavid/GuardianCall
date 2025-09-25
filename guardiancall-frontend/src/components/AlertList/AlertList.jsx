import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { formatRelativeTime, getSeverity, formatCoordinates, getLocationName } from '../../utils/alertUtils';
import './AlertList.css';

function AlertList() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent alerts from backend
  useEffect(() => {
    fetchRecentAlerts();
    
    // Set up auto-refresh every 30 seconds for live updates
    const interval = setInterval(fetchRecentAlerts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRecentAlerts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch only recent alerts (last 10, sorted by newest first)
      const alertsData = await apiService.getAlerts(10);
      
      // Transform backend data to frontend format
      const transformedAlerts = alertsData.map(alert => ({
        id: alert._id,
        type: 'Gunshot',
        location: getLocationName(alert.location?.coordinates),
        timestamp: formatRelativeTime(alert.timestamp),
        severity: getSeverity(alert.source, alert.confidence),
        coordinates: formatCoordinates(alert.location?.coordinates),
        status: alert.status,
        rawData: alert // Keep original data for reference
      }));
      
      setAlerts(transformedAlerts);
      
    } catch (err) {
      setError('Failed to load alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissAlert = async (alertId) => {
    try {
      // Update alert status to dismissed/false_positive
      await apiService.updateAlertStatus(alertId, 'false_positive', 'Dismissed from dashboard');
      
      // Remove the dismissed alert from the local state
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
      
    } catch (err) {
      console.error('Error dismissing alert:', err);
      // You could show a toast notification here
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#e53e3e';
      case 'medium': return '#ed8936';
      case 'low': return '#38a169';
      default: return '#a0aec0';
    }
  };

  if (isLoading) {
    return (
      <div className="alert-list">
        <div className="alert-list-header">
          <h2 className="alert-list-title">Live Alerts</h2>
          <div className="alert-count loading">
            <span className="count-number">...</span>
            <span className="count-label">Loading</span>
          </div>
        </div>
        <div className="loading-alerts">Loading recent alerts...</div>
      </div>
    );
  }

  return (
    <div className="alert-list">
      <div className="alert-list-header">
        <h2 className="alert-list-title">Live Alerts</h2>
        <div className="alert-count">
          <span className="count-number">{alerts.length}</span>
          <span className="count-label">Active</span>
        </div>
        <button 
          className="refresh-button"
          onClick={fetchRecentAlerts}
          title="Refresh alerts"
        >
          ↻
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="alert-error">
          {error}
          <button onClick={fetchRecentAlerts}>Retry</button>
        </div>
      )}
      
      <div className="alert-list-content">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <div className="no-alerts-icon">🎯</div>
            <div className="no-alerts-text">No active alerts</div>
            <div className="no-alerts-subtext">All clear at the moment</div>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.severity}`}>
              <div className="alert-header">
                <div className="alert-type">
                  <span 
                    className="alert-icon"
                    style={{ color: getSeverityColor(alert.severity) }}
                  >
                    ⚠️
                  </span>
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
                {alert.status && (
                  <div className="alert-status">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: alert.status === 'new' ? '#e53e3e' : 
                                       alert.status === 'investigating' ? '#3182ce' : 
                                       alert.status === 'resolved' ? '#38a169' : '#718096'
                      }}
                    >
                      {alert.status}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="alert-actions">
                <button 
                  className="action-button primary" 
                  onClick={() => navigate(`/alerts/${alert.id}`)}
                >
                  View Details
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => handleDismissAlert(alert.id)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="alert-list-footer">
        <button className="view-all-button" onClick={() => navigate('/alerts')}>
          View All Alerts ({alerts.length})
        </button>
      </div>
    </div>
  );
}

export default AlertList;