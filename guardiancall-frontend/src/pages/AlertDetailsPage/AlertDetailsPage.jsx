import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AlertDetailsPage.css';

function AlertDetailsPage() {
  const { id } = useParams(); // Get the alert ID from the URL
  const navigate = useNavigate();

  // Mock data - in a real app, you would fetch this based on the ID
  const alertDetails = {
    id: 1,
    type: 'Gunshot',
    location: 'Sector 12',
    timestamp: '2023-08-15T14:32:45Z',
    relativeTime: '5 minutes ago',
    severity: 'high',
    coordinates: { lat: -1.234567, lng: 36.789012 },
    status: 'new',
    confidence: 92,
    sensorId: 'SNR-045',
    audioSample: 'gunshot_045_20230815_143245.wav',
    rangerAssigned: 'Not assigned',
    notes: 'Multiple shots detected in rapid succession. Possible poaching activity.',
    relatedAlerts: [2, 3]
  };

  // Mock related alerts data
  const relatedAlerts = [
    {
      id: 2,
      type: 'Gunshot',
      location: 'Near River',
      timestamp: '2 min ago',
      severity: 'high'
    },
    {
      id: 3,
      type: 'Gunshot',
      location: 'North Boundary',
      timestamp: '7 min ago',
      severity: 'medium'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#e53e3e';
      case 'medium': return '#ed8936';
      case 'low': return '#38a169';
      default: return '#a0aec0';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#e53e3e';
      case 'investigating': return '#3182ce';
      case 'resolved': return '#38a169';
      case 'dismissed': return '#718096';
      default: return '#a0aec0';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="alert-details-page">
      {/* Header */}
      <div className="details-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Alerts
        </button>
        <h1 className="details-title">Alert Details</h1>
        <div className="header-actions">
          <button className="action-button secondary">Print Report</button>
          <button className="action-button primary">Assign Ranger</button>
        </div>
      </div>

      <div className="details-content">
        {/* Main Alert Information */}
        <div className="details-card main-info">
          <div className="card-header">
            <h2>Incident Overview</h2>
            <div className="alert-badges">
              <span 
                className="severity-badge"
                style={{ backgroundColor: getSeverityColor(alertDetails.severity) }}
              >
                {alertDetails.severity.toUpperCase()}
              </span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(alertDetails.status) }}
              >
                {alertDetails.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Alert Type</label>
              <span className="info-value">{alertDetails.type}</span>
            </div>
            <div className="info-item">
              <label>Location</label>
              <span className="info-value">{alertDetails.location}</span>
            </div>
            <div className="info-item">
              <label>Coordinates</label>
              <span className="info-value coordinates">
                {alertDetails.coordinates.lat}, {alertDetails.coordinates.lng}
              </span>
            </div>
            <div className="info-item">
              <label>Timestamp</label>
              <span className="info-value">{formatDate(alertDetails.timestamp)}</span>
            </div>
            <div className="info-item">
              <label>Detection Confidence</label>
              <span className="info-value confidence">{alertDetails.confidence}%</span>
            </div>
            <div className="info-item">
              <label>Sensor ID</label>
              <span className="info-value sensor-id">{alertDetails.sensorId}</span>
            </div>
          </div>
        </div>

        {/* Audio Evidence */}
        <div className="details-card">
          <div className="card-header">
            <h2>Audio Evidence</h2>
          </div>
          <div className="audio-player">
            <div className="audio-info">
              <span className="audio-filename">{alertDetails.audioSample}</span>
              <span className="audio-duration">00:45</span>
            </div>
            <div className="audio-controls">
              <button className="audio-button play">▶ Play</button>
              <button className="audio-button download">↓ Download</button>
              <button className="audio-button analyze">🔍 Analyze</button>
            </div>
            <div className="audio-waveform">
              {/* Waveform visualization would go here */}
              <div className="waveform-placeholder">
                Audio waveform visualization
              </div>
            </div>
          </div>
        </div>

        {/* Ranger Assignment & Notes */}
        <div className="details-row">
          <div className="details-card">
            <div className="card-header">
              <h2>Ranger Assignment</h2>
            </div>
            <div className="assignment-info">
              <span className="ranger-status">{alertDetails.rangerAssigned}</span>
              <select className="ranger-select">
                <option value="">Select Ranger...</option>
                <option value="ranger-1">Ranger James (Team Alpha)</option>
                <option value="ranger-2">Ranger Sarah (Team Bravo)</option>
                <option value="ranger-3">Ranger Mike (Team Charlie)</option>
              </select>
              <button className="assign-button">Assign</button>
            </div>
          </div>

          <div className="details-card">
            <div className="card-header">
              <h2>Notes & Observations</h2>
            </div>
            <div className="notes-content">
              <p>{alertDetails.notes}</p>
              <textarea 
                className="notes-input"
                placeholder="Add additional notes or observations..."
                rows="4"
              />
              <button className="save-notes-button">Save Notes</button>
            </div>
          </div>
        </div>

        {/* Related Alerts */}
        {relatedAlerts.length > 0 && (
          <div className="details-card">
            <div className="card-header">
              <h2>Related Alerts</h2>
              <span className="related-count">{relatedAlerts.length} related incidents</span>
            </div>
            <div className="related-alerts">
              {relatedAlerts.map(alert => (
                <div key={alert.id} className="related-alert-item">
                  <div className="related-alert-info">
                    <span className="related-type">{alert.type}</span>
                    <span className="related-location">{alert.location}</span>
                    <span className="related-time">{alert.timestamp}</span>
                  </div>
                  <button 
                    className="view-related-button"
                    onClick={() => navigate(`/alerts/${alert.id}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons-row">
          <button className="action-button large secondary">Mark as False Positive</button>
          <button className="action-button large">Escalate to Authorities</button>
          <button className="action-button large primary">Resolve Incident</button>
        </div>
      </div>
    </div>
  );
}

export default AlertDetailsPage;