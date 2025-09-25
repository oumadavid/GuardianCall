import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { 
    formatCoordinates, 
    getLocationName, 
    formatDisplayDate, 
    formatRelativeTime,
    getSeverity,
    getSeverityColor,
    getStatusColor 
} from '../../utils/alertDetailsUtils';
import './AlertDetailsPage.css';
import SMSModal from '../../components/SmsModal/SmsModal';

function AlertDetailsPage() {
  const [showSMSModal, setShowSMSModal] = useState(false);
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [alertDetails, setAlertDetails] = useState(null);
  const [rangers, setRangers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRanger, setSelectedRanger] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch alert details and related data
  useEffect(() => {
    if (id) {
      fetchAlertData();
    }
  }, [id]);

  const fetchAlertData = async () => {
    try {
      setIsLoading(true);
      setError(null)

      //Fetch Alert details
      const alertData = await apiService.getAlertById(id);
      setAlertDetails(alertData);
      setNewNotes(alertData.notes || '');

      //fetch available rangers
      const rangersData = await apiService.getRangers();
      setRangers(rangersData);

    } catch (err) {
      setError('Failed to load alert details: ' + err.message);
      console.error('Error fetching alert data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRanger = async () => {
    if (!selectedRanger) return;
    
    try {
      setIsSaving(true);
      const updatedAlert = await apiService.assignRangerToAlert(id, selectedRanger, newNotes);
      setAlertDetails(updatedAlert);
      setSelectedRanger('');
      // Show success message or update UI
    } catch (err) {
      setError('Failed to assign ranger: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  ];

  // Mock rangers data to pass to the modal
  const rangersData = [
    { id: 1, name: 'James Kariuki', phone: '+254702683413', team: 'Alpha' },
    { id: 2, name: 'Sarah Mwende', phone: '+254723456789', team: 'Bravo' },
    { id: 3, name: 'Mike Otieno', phone: '+254734567890', team: 'Charlie' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#e53e3e';
      case 'medium': return '#ed8936';
      case 'low': return '#38a169';
      default: return '#a0aec0';
=======
  };

  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      const updatedAlert = await apiService.updateAlertNotes(id, newNotes);
      setAlertDetails(updatedAlert);
      // Show success message
    } catch (err) {
      setError('Failed to save notes: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsSaving(true);
      const resolutionNotes = newStatus === 'false_positive' ? 'Marked as false positive' : '';
      const updatedAlert = await apiService.updateAlertStatus(id, newStatus, resolutionNotes);
      setAlertDetails(updatedAlert);
      // Show success message
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="alert-details-page">
        <div className="loading">Loading alert details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-details-page">
        <div className="error-message">
          {error}
          <button onClick={() => navigate(-1)}>Back to Alerts</button>
          <button onClick={fetchAlertData}>Retry</button>
        </div>
      </div>
    );
  }

  if (!alertDetails) {
    return (
      <div className="alert-details-page">
        <div className="error-message">
          Alert not found
          <button onClick={() => navigate(-1)}>Back to Alerts</button>
        </div>
      </div>
    );
  }

  // Transform backend data to frontend format
  const transformedAlert = {
    id: alertDetails._id,
    type: 'Gunshot',
    location: getLocationName(alertDetails.location?.coordinates),
    timestamp: alertDetails.timestamp,
    relativeTime: formatRelativeTime(alertDetails.timestamp),
    severity: getSeverity(alertDetails.source, alertDetails.confidence),
    coordinates: alertDetails.location?.coordinates ? {
      lat: alertDetails.location.coordinates[1],
      lng: alertDetails.location.coordinates[0]
    } : { lat: 0, lng: 0 },
    status: alertDetails.status,
    confidence: alertDetails.confidence || 0,
    sensorId: alertDetails.sensorReadings?.[0]?.sensorId || 'Unknown',
    audioSample: `gunshot_${alertDetails._id}.wav`, // Simulated filename
    rangerAssigned: alertDetails.assignedRanger ? 
      `${alertDetails.assignedRanger.name} (${alertDetails.assignedRanger.team})` : 
      'Not assigned',
    notes: alertDetails.notes || 'No notes available.',
    assignedRangerId: alertDetails.assignedRanger?._id
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

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="details-content">
        {/* Main Alert Information */}
        <div className="details-card main-info">
          <div className="card-header">
            <h2>Incident Overview</h2>
            <div className="alert-badges">
              <span 
                className="severity-badge"
                style={{ backgroundColor: getSeverityColor(transformedAlert.severity) }}
              >
                {transformedAlert.severity.toUpperCase()}
              </span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(transformedAlert.status) }}
              >
                {transformedAlert.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Alert Type</label>
              <span className="info-value">{transformedAlert.type}</span>
            </div>
            <div className="info-item">
              <label>Location</label>
              <span className="info-value">{transformedAlert.location}</span>
            </div>
            <div className="info-item">
              <label>Coordinates</label>
              <span className="info-value coordinates">
                {formatCoordinates(alertDetails.location?.coordinates)}
              </span>
            </div>
            <div className="info-item">
              <label>Timestamp</label>
              <span className="info-value">{formatDisplayDate(transformedAlert.timestamp)}</span>
            </div>
            <div className="info-item">
              <label>Detection Confidence</label>
              <span className="info-value confidence">{transformedAlert.confidence}%</span>
            </div>
            <div className="info-item">
              <label>Sensor ID</label>
              <span className="info-value sensor-id">{transformedAlert.sensorId}</span>
            </div>
            <div className="info-item">
              <label>Detection Source</label>
              <span className="info-value">{alertDetails.source || 'single-sensor'}</span>
            </div>
            <div className="info-item">
              <label>Alert ID</label>
              <span className="info-value alert-id">{transformedAlert.id}</span>
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
              <span className="audio-filename">{transformedAlert.audioSample}</span>
              <span className="audio-duration">00:45</span>
            </div>
            <div className="audio-controls">
              <button className="audio-button play">▶ Play</button>
              <button className="audio-button download">↓ Download</button>
              <button className="audio-button analyze">🔍 Analyze</button>
            </div>
            <div className="audio-waveform">
              <div className="waveform-placeholder">
                Audio waveform visualization would appear here
                <br />
                <small>Confidence: {transformedAlert.confidence}%</small>
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
              <span className="ranger-status">{transformedAlert.rangerAssigned}</span>
              <select 
                className="ranger-select"
                value={selectedRanger}
                onChange={(e) => setSelectedRanger(e.target.value)}
                disabled={isSaving}
              >
                <option value="">Select Ranger...</option>
                {rangers.map(ranger => (
                  <option key={ranger._id} value={ranger._id}>
                    {ranger.name} ({ranger.team}) - {ranger.badgeNumber}
                  </option>
                ))}
              </select>
              <button 
                className="assign-button"
                onClick={handleAssignRanger}
                disabled={!selectedRanger || isSaving}
              >
                {isSaving ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>

          <div className="details-card">
            <div className="card-header">
              <h2>Notes & Observations</h2>
            </div>
            <div className="notes-content">
              <p>{transformedAlert.notes}</p>
              <textarea 
                className="notes-input"
                placeholder="Add additional notes or observations..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows="4"
                disabled={isSaving}
              />
              <button 
                className="save-notes-button"
                onClick={handleSaveNotes}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons-row">
          <button className="action-button large secondary">Mark as False Positive</button>
          <button 
            className="action-button large"
            onClick={() => setShowSMSModal(true)}
            >
          📱 Send SMS Alert
          </button>
          <button className="action-button large primary">Resolve Incident</button>
          <button 
            className="action-button large secondary"
            onClick={() => handleStatusUpdate('false_positive')}
            disabled={isSaving}
          >
            Mark as False Positive
          </button>
          <button className="action-button large">
            Escalate to Authorities
          </button>
          <button 
            className="action-button large primary"
            onClick={() => handleStatusUpdate('resolved')}
            disabled={isSaving}
          >
            Resolve Incident
          </button>

        </div>
      </div>

      {/* SMS Modal - ADD THIS RIGHT HERE */}
      {showSMSModal && (
        <SMSModal 
          alert={alertDetails}
          isOpen={showSMSModal}
          onClose={() => setShowSMSModal(false)}
          rangers={rangersData} // Passing the mock rangers data
        />
      )}
    </div>
  );
}

export default AlertDetailsPage;