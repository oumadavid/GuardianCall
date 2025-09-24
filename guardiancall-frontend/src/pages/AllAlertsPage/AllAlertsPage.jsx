import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { formatRelativeTime, mapStatus, mapSeverity, formatCoordinates } from '../../utils/alertUtils';
import './AllAlertsPage.css';

function AllAlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'investigating', 'resolved'

  // Fetch alerts from backend
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      console.log('🔄 Fetching alerts from backend...');
      setIsLoading(true);
      setError(null);
      
      const alertsData = await apiService.getAlerts(100);
      console.log('📡 Alerts received from backend:', alertsData);
      
      // Transform backend data to frontend format
      const transformedAlerts = alertsData.map(alert => ({
        id: alert._id,
        type: 'Gunshot',
        location: getLocationName(alert.location.coordinates),
        timestamp: formatRelativeTime(alert.timestamp),
        rawTimestamp: alert.timestamp,
        severity: mapSeverity(alert.source, alert.confidence),
        coordinates: formatCoordinates(alert.location.coordinates),
        rawCoordinates: alert.location.coordinates,
        status: mapStatus(alert.status),
        backendData: alert
      }));
      
      console.log('✨ Transformed alerts:', transformedAlerts);
      setAlerts(transformedAlerts);
      
    } catch (err) {
      console.error('❌ Error fetching alerts:', err);
      setError('Failed to load alerts: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate location names from coordinates
  const getLocationName = (coordinates) => {
    // In a real app, you might reverse geocode or use predefined sectors
    // For now, we'll use a simple mapping based on coordinate ranges
    const [lng, lat] = coordinates;
    
    // Simple sector mapping based on coordinate ranges
    if (lat > -1.29 && lat < -1.28) return 'Central Zone';
    if (lat > -1.30) return 'North Boundary';
    if (lat < -1.31) return 'South Plains';
    if (lng > 36.83) return 'East Ridge';
    if (lng < 36.80) return 'West Valley';
    if (Math.abs(lat - (-1.292)) < 0.002) return 'Sector 12';
    
    return 'Unknown Sector';
  };

  // Filter alerts based on status
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

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

  // Handle status update
  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      // Map frontend status back to backend status
      const statusMap = {
        'new': 'new',
        'investigating': 'investigating',
        'resolved': 'resolved',
        'dismissed': 'false_positive'
      };
      
      await apiService.updateAlertStatus(alertId, statusMap[newStatus]);
      
      // Refresh the alerts list
      fetchAlerts();
      
    } catch (err) {
      setError('Failed to update alert status: ' + err.message);
      console.error('Error updating status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="all-alerts-page">
        <div className="loading">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="all-alerts-page">
      {/* Header with back button and title */}
      <div className="all-alerts-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="all-alerts-title">All Alerts</h1>
        <div className="alert-stats">
          <span className="total-alerts">
            {filteredAlerts.length} of {alerts.length} Alerts
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="alert-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({alerts.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
          onClick={() => setFilter('new')}
        >
          New ({alerts.filter(a => a.status === 'new').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'investigating' ? 'active' : ''}`}
          onClick={() => setFilter('investigating')}
        >
          Investigating ({alerts.filter(a => a.status === 'investigating').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
          onClick={() => setFilter('resolved')}
        >
          Resolved ({alerts.filter(a => a.status === 'resolved').length})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
          <button onClick={fetchAlerts} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Alert list content */}
      <div className="alert-list-content all-alerts-content">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            {filter === 'all' ? 'No alerts found' : `No ${filter} alerts`}
          </div>
        ) : (
          filteredAlerts.map((alert) => (
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
                <button 
                  className="action-button primary" 
                  onClick={() => navigate(`/alerts/${alert.id}`)}
                >
                  View Details
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => {
                    if (alert.status === 'resolved') {
                      handleUpdateStatus(alert.id, 'investigating');
                    } else {
                      // For demo, cycle through statuses
                      const nextStatus = alert.status === 'new' ? 'investigating' : 
                                       alert.status === 'investigating' ? 'resolved' : 'new';
                      handleUpdateStatus(alert.id, nextStatus);
                    }
                  }}
                >
                  {alert.status === 'resolved' ? 'Reopen' : 'Update Status'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="refresh-section">
        <button onClick={fetchAlerts} className="refresh-btn">
          ↻ Refresh Alerts
        </button>
      </div>
    </div>
  );
}

export default AllAlertsPage;