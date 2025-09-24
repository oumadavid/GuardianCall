import React, { useState, useEffect } from 'react';
import './MapComponent.css';

function MapComponent({ 
  mode = 'default', 
  selectedRoute, 
  routes, 
  isCreatingRoute, 
  newRouteWaypoints,
  selectedSensor,
  sensors,
  isAddingSensor
}) {
  const [mapMode, setMapMode] = useState(mode);

  useEffect(() => {
    setMapMode(mode);
  }, [mode]);

  // This would be replaced with actual Mapbox integration
  const renderRouteOnMap = () => {
    if (mapMode === 'routes' && selectedRoute) {
      return (
        <div className="route-map-overlay">
          <div className="route-highlight">
            <h4>Active Route: {selectedRoute.name}</h4>
            <div className="route-stats">
              <span>Distance: {selectedRoute.distance}</span>
              <span>Progress: {selectedRoute.progress}%</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (mapMode === 'routes' && isCreatingRoute) {
      return (
        <div className="creation-mode-overlay">
          <div className="creation-instructions">
            <h4>Creating New Route</h4>
            <p>Click on the map to add waypoints</p>
            <div className="waypoints-preview">
              {newRouteWaypoints.length} points added
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Sensors mode rendering
  const renderSensorsOnMap = () => {
    if (mapMode === 'sensors' && sensors) {
      const onlineSensors = sensors.filter(s => s.status === 'online');
      const offlineSensors = sensors.filter(s => s.status === 'offline');
      
      return (
        <div className="sensors-map-overlay">
          <div className="sensors-info">
            <h4>Sensor Network Overview</h4>
            <div className="sensors-stats-overview">
              <div className="sensor-stat">
                <span className="stat-value">{onlineSensors.length}</span>
                <span className="stat-label online">Online</span>
              </div>
              <div className="sensor-stat">
                <span className="stat-value">{offlineSensors.length}</span>
                <span className="stat-label offline">Offline</span>
              </div>
              <div className="sensor-stat">
                <span className="stat-value">{sensors.length}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </div>
          
          {selectedSensor && (
            <div className="selected-sensor-info">
              <div className="sensor-header">
                <h5>{selectedSensor.name}</h5>
                <span className={`sensor-status ${selectedSensor.status}`}>
                  {selectedSensor.status}
                </span>
              </div>
              <div className="sensor-details">
                <div className="sensor-detail">
                  <span className="label">Battery:</span>
                  <span className={`value battery-${selectedSensor.battery >= 50 ? 'high' : selectedSensor.battery >= 20 ? 'medium' : 'low'}`}>
                    {selectedSensor.battery}%
                  </span>
                </div>
                <div className="sensor-detail">
                  <span className="label">Type:</span>
                  <span className="value">{selectedSensor.type}</span>
                </div>
                <div className="sensor-detail">
                  <span className="label">Alerts:</span>
                  <span className="value alerts">{selectedSensor.alertsDetected}</span>
                </div>
              </div>
            </div>
          )}

          {isAddingSensor && (
            <div className="add-sensor-mode-overlay">
              <div className="add-sensor-instructions">
                <h4>Add New Sensor</h4>
                <p>Click on the map to place the sensor</p>
                <div className="sensor-type-preview">
                  <span className="sensor-type-indicator">📍 Acoustic Sensor</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getMapInfoContent = () => {
    switch (mapMode) {
      case 'routes':
        return (
          <div className="routes-info">
            <div className="coverage-item">
              <span className="coverage-label">Active Patrols</span>
              <span className="coverage-value">{routes?.filter(r => r.status === 'in-progress').length || 0}</span>
            </div>
            <div className="coverage-item">
              <span className="coverage-label">Total Distance</span>
              <span className="coverage-value">
                {routes?.reduce((total, route) => {
                  const dist = parseFloat(route.distance) || 0;
                  return total + dist;
                }, 0).toFixed(1)} km
              </span>
            </div>
          </div>
        );
      
      case 'sensors':
        const onlineSensors = sensors?.filter(s => s.status === 'online').length || 0;
        const totalSensors = sensors?.length || 0;
        return (
          <div className="sensors-coverage-info">
            <div className="coverage-item">
              <span className="coverage-label">Online Sensors</span>
              <span className="coverage-value online">{onlineSensors}</span>
            </div>
            <div className="coverage-item">
              <span className="coverage-label">Coverage Efficiency</span>
              <span className="coverage-value">
                {totalSensors > 0 ? Math.round((onlineSensors / totalSensors) * 100) : 0}%
              </span>
            </div>
            <div className="coverage-item">
              <span className="coverage-label">Network Health</span>
              <span className={`coverage-value ${
                onlineSensors / totalSensors > 0.8 ? 'excellent' :
                onlineSensors / totalSensors > 0.6 ? 'good' : 'poor'
              }`}>
                {onlineSensors / totalSensors > 0.8 ? 'Excellent' :
                 onlineSensors / totalSensors > 0.6 ? 'Good' : 'Needs Attention'}
              </span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="coverage-status">
            <div className="coverage-item">
              <span className="coverage-label">Coverage Area</span>
              <span className="coverage-value">2,847 km²</span>
            </div>
            <div className="coverage-item">
              <span className="coverage-label">Active Sensors</span>
              <span className="coverage-value">127</span>
            </div>
            <div className="coverage-item">
              <span className="coverage-label">Response Time</span>
              <span className="coverage-value">3.2 min</span>
            </div>
          </div>
        );
    }
  };

  const getPlaceholderContent = () => {
    const baseContent = {
      icon: '🗺️',
      title: 'Mapbox Map Will Go Here',
      description: 'Real-time gunshot detection overlay with ranger positions and patrol routes',
      features: [
        '📍 Alert Locations',
        '👮 Ranger Positions',
        '🛣️ Patrol Routes',
        '📡 Sensor Network'
      ]
    };

    const modeConfigs = {
      routes: {
        icon: '🛣️',
        title: 'Routes Management View',
        description: 'Interactive patrol routes visualization with real-time ranger tracking',
        features: [
          '📍 Patrol Routes',
          '👮 Ranger Tracking',
          '📏 Distance Metrics',
          '⏱️ Live Progress'
        ]
      },
      sensors: {
        icon: '📡',
        title: 'Sensor Network View',
        description: 'Real-time sensor monitoring with status indicators and coverage analysis',
        features: [
          '📡 Sensor Locations',
          '🔋 Battery Status',
          '📶 Signal Strength',
          '⚠️ Alert History'
        ]
      }
    };

    const config = modeConfigs[mapMode] || baseContent;

    return (
      <div className="map-placeholder-content">
        <div className="map-placeholder-icon">{config.icon}</div>
        <h3 className="map-placeholder-title">{config.title}</h3>
        <p className="map-placeholder-description">{config.description}</p>
        <div className="map-placeholder-features">
          {config.features.map((feature, index) => (
            <div key={index} className="feature-item">{feature}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="map-component">
      <div className="map-overlay">
        <div className="map-controls">
          <button className={`map-control-button ${mapMode === 'default' ? 'active' : ''}`}>
            <span className="control-icon">🎯</span>
            <span className="control-label">Live View</span>
          </button>
          <button className={`map-control-button ${mapMode === 'routes' ? 'active' : ''}`}>
            <span className="control-icon">🛣️</span>
            <span className="control-label">Routes</span>
          </button>
          <button className={`map-control-button ${mapMode === 'sensors' ? 'active' : ''}`}>
            <span className="control-icon">📡</span>
            <span className="control-label">Sensors</span>
          </button>
          <button className="map-control-button">
            <span className="control-icon">📊</span>
            <span className="control-label">Analytics</span>
          </button>
        </div>
        
        <div className="map-info">
          {getMapInfoContent()}
        </div>
      </div>
      
      {renderRouteOnMap()}
      {renderSensorsOnMap()}
      
      <div className="map-placeholder">
        {getPlaceholderContent()}
      </div>
    </div>
  );
}

export default MapComponent;