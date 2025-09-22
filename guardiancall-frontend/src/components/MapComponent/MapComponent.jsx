import React from 'react';
import './MapComponent.css';

function MapComponent() {
  return (
    <div className="map-component">
      <div className="map-overlay">
        <div className="map-controls">
          <button className="map-control-button active">
            <span className="control-icon">🎯</span>
            <span className="control-label">Live View</span>
          </button>
          <button className="map-control-button">
            <span className="control-icon">🗂️</span>
            <span className="control-label">Layers</span>
          </button>
          <button className="map-control-button">
            <span className="control-icon">📊</span>
            <span className="control-label">Analytics</span>
          </button>
        </div>
        
        <div className="map-info">
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
        </div>
      </div>
      
      <div className="map-placeholder">
        <div className="map-placeholder-content">
          <div className="map-placeholder-icon">🗺️</div>
          <h3 className="map-placeholder-title">Mapbox Map Will Go Here</h3>
          <p className="map-placeholder-description">
            Real-time gunshot detection overlay with ranger positions and patrol routes
          </p>
          <div className="map-placeholder-features">
            <div className="feature-item">📍 Alert Locations</div>
            <div className="feature-item">👮 Ranger Positions</div>
            <div className="feature-item">🛣️ Patrol Routes</div>
            <div className="feature-item">📡 Sensor Network</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;