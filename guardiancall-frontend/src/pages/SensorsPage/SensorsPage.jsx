import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../../components/MapComponent/MapComponent';
import './SensorsPage.css';

function SensorsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isAddingSensor, setIsAddingSensor] = useState(false);

  // Mock sensor data
  const [sensors, setSensors] = useState([
    {
      id: 1,
      name: 'Sensor Alpha-01',
      type: 'acoustic',
      status: 'online',
      battery: 85,
      lastActive: '2 minutes ago',
      location: { lat: -1.234567, lng: 36.789012 },
      coordinates: '-1.234567, 36.789012',
      installationDate: '2023-06-15',
      signalStrength: 'excellent',
      alertsDetected: 47,
      temperature: 28,
      firmware: 'v2.1.4'
    },
    {
      id: 2,
      name: 'Sensor Beta-12',
      type: 'acoustic',
      status: 'online',
      battery: 42,
      lastActive: '5 minutes ago',
      location: { lat: -1.238765, lng: 36.792345 },
      coordinates: '-1.238765, 36.792345',
      installationDate: '2023-07-20',
      signalStrength: 'good',
      alertsDetected: 23,
      temperature: 26,
      firmware: 'v2.1.3'
    },
    {
      id: 3,
      name: 'Sensor Gamma-07',
      type: 'acoustic',
      status: 'offline',
      battery: 0,
      lastActive: '3 hours ago',
      location: { lat: -1.242345, lng: 36.795678 },
      coordinates: '-1.242345, 36.795678',
      installationDate: '2023-05-10',
      signalStrength: 'poor',
      alertsDetected: 89,
      temperature: null,
      firmware: 'v2.0.9'
    },
    {
      id: 4,
      name: 'Sensor Delta-23',
      type: 'seismic',
      status: 'maintenance',
      battery: 95,
      lastActive: '1 hour ago',
      location: { lat: -1.229876, lng: 36.781234 },
      coordinates: '-1.229876, 36.781234',
      installationDate: '2023-08-01',
      signalStrength: 'excellent',
      alertsDetected: 12,
      temperature: 29,
      firmware: 'v2.2.0'
    },
    {
      id: 5,
      name: 'Sensor Epsilon-45',
      type: 'acoustic',
      status: 'online',
      battery: 78,
      lastActive: '30 seconds ago',
      location: { lat: -1.232345, lng: 36.785678 },
      coordinates: '-1.232345, 36.785678',
      installationDate: '2023-07-05',
      signalStrength: 'good',
      alertsDetected: 34,
      temperature: 27,
      firmware: 'v2.1.4'
    }
  ]);

  const [newSensor, setNewSensor] = useState({
    name: '',
    type: 'acoustic',
    coordinates: ''
  });

  const filteredSensors = sensors.filter(sensor => {
    if (activeTab === 'all') return true;
    if (activeTab === 'online') return sensor.status === 'online';
    if (activeTab === 'offline') return sensor.status === 'offline';
    if (activeTab === 'maintenance') return sensor.status === 'maintenance';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#48BB78';
      case 'offline': return '#E53E3E';
      case 'maintenance': return '#ED8936';
      default: return '#A0AEC0';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'maintenance': return '🟡';
      default: return '⚪';
    }
  };

  const getBatteryColor = (battery) => {
    if (battery >= 70) return '#48BB78';
    if (battery >= 30) return '#ED8936';
    return '#E53E3E';
  };

  const getBatteryIcon = (battery) => {
    if (battery >= 70) return '🔋';
    if (battery >= 30) return '🪫';
    return '💀';
  };

  const handleAddSensor = () => {
    if (newSensor.name && newSensor.coordinates) {
      const [lat, lng] = newSensor.coordinates.split(',').map(coord => parseFloat(coord.trim()));
      
      const sensor = {
        id: Date.now(),
        ...newSensor,
        status: 'online',
        battery: 100,
        lastActive: 'Just now',
        location: { lat, lng },
        installationDate: new Date().toISOString().split('T')[0],
        signalStrength: 'excellent',
        alertsDetected: 0,
        temperature: 25,
        firmware: 'v2.2.1'
      };
      
      setSensors(prev => [sensor, ...prev]);
      setNewSensor({ name: '', type: 'acoustic', coordinates: '' });
      setIsAddingSensor(false);
    }
  };

  const handleSensorAction = (sensorId, action) => {
    setSensors(prev => prev.map(sensor => {
      if (sensor.id === sensorId) {
        switch (action) {
          case 'restart':
            return { ...sensor, status: 'online', lastActive: 'Just now' };
          case 'maintenance':
            return { ...sensor, status: 'maintenance' };
          case 'remove':
            return sensor;
          default:
            return sensor;
        }
      }
      return sensor;
    }));

    if (action === 'remove') {
      setSensors(prev => prev.filter(sensor => sensor.id !== sensorId));
    }
  };

  return (
    <div className="sensors-page">
      {/* Header */}
      <div className="sensors-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="sensors-title">Sensors Management</h1>
        <button 
          className="add-sensor-button"
          onClick={() => setIsAddingSensor(true)}
        >
          + Add Sensor
        </button>
      </div>

      <div className="sensors-content">
        {/* Sensors Sidebar */}
        <div className="sensors-sidebar">
          {/* Stats Overview */}
          <div className="sensors-stats">
            <div className="stat-card">
              <span className="stat-number">{sensors.length}</span>
              <span className="stat-label">Total Sensors</span>
            </div>
            <div className="stat-card">
              <span className="stat-number online">{sensors.filter(s => s.status === 'online').length}</span>
              <span className="stat-label">Online</span>
            </div>
            <div className="stat-card">
              <span className="stat-number offline">{sensors.filter(s => s.status === 'offline').length}</span>
              <span className="stat-label">Offline</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="sensors-tabs">
            <button 
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Sensors
            </button>
            <button 
              className={`tab-button ${activeTab === 'online' ? 'active' : ''}`}
              onClick={() => setActiveTab('online')}
            >
              Online
            </button>
            <button 
              className={`tab-button ${activeTab === 'offline' ? 'active' : ''}`}
              onClick={() => setActiveTab('offline')}
            >
              Offline
            </button>
            <button 
              className={`tab-button ${activeTab === 'maintenance' ? 'active' : ''}`}
              onClick={() => setActiveTab('maintenance')}
            >
              Maintenance
            </button>
          </div>

          {/* Sensors List */}
          <div className="sensors-list">
            {filteredSensors.map(sensor => (
              <div 
                key={sensor.id}
                className={`sensor-card ${selectedSensor?.id === sensor.id ? 'selected' : ''}`}
                onClick={() => setSelectedSensor(sensor)}
              >
                <div className="sensor-header">
                  <div className="sensor-info">
                    <div className="sensor-status">
                      <span className="status-icon">{getStatusIcon(sensor.status)}</span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(sensor.status) }}
                      >
                        {sensor.status}
                      </span>
                    </div>
                    <h3 className="sensor-name">{sensor.name}</h3>
                  </div>
                  <div className="sensor-battery">
                    <span className="battery-icon">{getBatteryIcon(sensor.battery)}</span>
                    <span 
                      className="battery-level"
                      style={{ color: getBatteryColor(sensor.battery) }}
                    >
                      {sensor.battery}%
                    </span>
                  </div>
                </div>
                
                <div className="sensor-details">
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{sensor.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Active:</span>
                    <span className="detail-value">{sensor.lastActive}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Alerts:</span>
                    <span className="detail-value alerts-count">{sensor.alertsDetected}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Signal:</span>
                    <span className={`detail-value signal-${sensor.signalStrength}`}>
                      {sensor.signalStrength}
                    </span>
                  </div>
                </div>

                <div className="sensor-actions">
                  <button 
                    className="action-button view"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSensor(sensor);
                    }}
                  >
                    View
                  </button>
                  {sensor.status === 'offline' && (
                    <button 
                      className="action-button restart"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSensorAction(sensor.id, 'restart');
                      }}
                    >
                      Restart
                    </button>
                  )}
                  <button 
                    className="action-button more"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⋮
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="sensors-map-container">
          <MapComponent 
            mode="sensors"
            selectedSensor={selectedSensor}
            sensors={filteredSensors}
            isAddingSensor={isAddingSensor}
          />
        </div>
      </div>

      {/* Add Sensor Modal */}
      {isAddingSensor && (
        <div className="modal-overlay">
          <div className="add-sensor-modal">
            <div className="modal-header">
              <h2>Add New Sensor</h2>
              <button 
                className="close-button"
                onClick={() => setIsAddingSensor(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Sensor Name</label>
                <input
                  type="text"
                  value={newSensor.name}
                  onChange={(e) => setNewSensor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sensor Alpha-01"
                />
              </div>
              
              <div className="form-group">
                <label>Sensor Type</label>
                <select
                  value={newSensor.type}
                  onChange={(e) => setNewSensor(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="acoustic">Acoustic Gunshot Detection</option>
                  <option value="seismic">Seismic Sensor</option>
                  <option value="thermal">Thermal Imaging</option>
                  <option value="camera">Camera Trap</option>
                </select>
              </div>

              <div className="form-group">
                <label>Coordinates (Lat, Lng)</label>
                <input
                  type="text"
                  value={newSensor.coordinates}
                  onChange={(e) => setNewSensor(prev => ({ ...prev, coordinates: e.target.value }))}
                  placeholder="e.g., -1.234567, 36.789012"
                />
                <small>Enter coordinates separated by comma</small>
              </div>

              <div className="installation-info">
                <h4>Installation Details</h4>
                <p>New sensors will be set to online status with 100% battery. 
                Position will be verified during installation.</p>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setIsAddingSensor(false)}
              >
                Cancel
              </button>
              <button 
                className="add-button"
                onClick={handleAddSensor}
                disabled={!newSensor.name || !newSensor.coordinates}
              >
                Add Sensor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sensor Details Panel */}
      {selectedSensor && (
        <div className="sensor-details-panel">
          <div className="panel-header">
            <h3>Sensor Details</h3>
            <button 
              className="close-panel-button"
              onClick={() => setSelectedSensor(null)}
            >
              ×
            </button>
          </div>
          
          <div className="panel-content">
            <div className="detail-section">
              <h4>Basic Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Name</label>
                  <span>{selectedSensor.name}</span>
                </div>
                <div className="detail-item">
                  <label>Type</label>
                  <span>{selectedSensor.type}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className={`status ${selectedSensor.status}`}>{selectedSensor.status}</span>
                </div>
                <div className="detail-item">
                  <label>Firmware</label>
                  <span>{selectedSensor.firmware}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Performance Metrics</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Battery Level</label>
                  <div className="battery-display">
                    <div 
                      className="battery-fill"
                      style={{ width: `${selectedSensor.battery}%` }}
                    ></div>
                    <span>{selectedSensor.battery}%</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Alerts Detected</label>
                  <span className="alerts-count">{selectedSensor.alertsDetected}</span>
                </div>
                <div className="detail-item">
                  <label>Signal Strength</label>
                  <span className={`signal ${selectedSensor.signalStrength}`}>
                    {selectedSensor.signalStrength}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Temperature</label>
                  <span>{selectedSensor.temperature ? `${selectedSensor.temperature}°C` : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Location Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Coordinates</label>
                  <span className="coordinates">{selectedSensor.coordinates}</span>
                </div>
                <div className="detail-item">
                  <label>Installation Date</label>
                  <span>{selectedSensor.installationDate}</span>
                </div>
                <div className="detail-item">
                  <label>Last Active</label>
                  <span>{selectedSensor.lastActive}</span>
                </div>
              </div>
            </div>

            <div className="panel-actions">
              <button className="action-button primary">Update Firmware</button>
              <button className="action-button secondary">Run Diagnostics</button>
              <button className="action-button warning">Put in Maintenance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SensorsPage;