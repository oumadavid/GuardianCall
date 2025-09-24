import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import apiService from '../../services/api';
import './MapComponent.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const alertIcon = createCustomIcon('#e53e3e', '⚠️');
const sensorIcon = createCustomIcon('#38a169', '📡');
const rangerIcon = createCustomIcon('#3182ce', '👮');

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

function MapComponent({ mode = 'default' }) {
  const [mapMode, setMapMode] = useState(mode);
  const [alerts, setAlerts] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [rangers, setRangers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([-1.2921, 36.8219]);
  const [mapZoom, setMapZoom] = useState(10);
  const [error, setError] = useState(null);

  const LOCATIONIQ_API_KEY = 'pk.fb375a8bf03f57b2752d0a28f40335f9';

  useEffect(() => {
    fetchMapData();
    const interval = setInterval(fetchMapData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMapData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch alerts (this endpoint should exist)
      const alertsData = await apiService.getAlerts(50);
      const mappedAlerts = alertsData.map(alert => ({
        id: alert._id,
        position: [alert.location.coordinates[1], alert.location.coordinates[0]],
        type: 'gunshot',
        timestamp: new Date(alert.timestamp),
        confidence: alert.confidence || 0,
        status: alert.status,
        source: alert.source,
      }));
      setAlerts(mappedAlerts);

      // Fetch sensors with fallback
      const sensorsData = await apiService.getSensors();
      const mappedSensors = sensorsData.map(sensor => ({
        id: sensor._id || sensor.id,
        position: sensor.location ? [sensor.location.coordinates[1], sensor.location.coordinates[0]] : [ -1.290, 36.820],
        name: sensor.sensorId || sensor.name || 'Sensor',
        status: sensor.isActive ? 'online' : 'offline',
        battery: sensor.battery || 85,
        lastPing: sensor.lastPing || new Date(),
      }));
      setSensors(mappedSensors);

      // Fetch rangers with fallback
      const rangersData = await apiService.getRangers();
      const mappedRangers = rangersData.map(ranger => ({
        id: ranger._id || ranger.id,
        position: ranger.currentLocation ? 
          [ranger.currentLocation.coordinates[1], ranger.currentLocation.coordinates[0]] : 
          [-1.285, 36.815],
        name: ranger.name || 'Ranger Team',
        team: ranger.team || 'Unknown',
        status: 'active',
      }));
      setRangers(mappedRangers);

    } catch (error) {
      console.error('Error fetching map data:', error);
      setError('Failed to load map data. Some features may not be available.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerClick = (item) => {
    setMapCenter(item.position);
    setMapZoom(14);
  };

  const getMapInfoContent = () => {
    const activeAlerts = alerts.filter(a => a.status === 'new' || a.status === 'assigned').length;

    switch (mapMode) {
      case 'routes':
        return (
          <div className="routes-info">
            <div className="coverage-item">
              <span className="coverage-label">Active Patrols</span>
              <span className="coverage-value">{rangers.length}</span>
            </div>
          </div>
        );
      
      case 'sensors':
        return (
          <div className="sensors-coverage-info">
            <div className="coverage-item">
              <span className="coverage-label">Sensors</span>
              <span className="coverage-value">{sensors.length}</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="coverage-status">
            <div className="coverage-item">
              <span className="coverage-label">Active Alerts</span>
              <span className="coverage-value">{activeAlerts}</span>
            </div>
            <div className="coverage-item">
              <span className="coverage-label">Rangers</span>
              <span className="coverage-value">{rangers.length}</span>
            </div>
          </div>
        );
    }
  };

  if (!LOCATIONIQ_API_KEY) {
    return (
      <div className="map-component error">
        <div className="error-message">
          <h3>LocationIQ API Key Missing</h3>
          <p>Please add your LocationIQ API key to the .env file</p>
          <code>REACT_APP_LOCATIONIQ_API_KEY=your_api_key_here</code>
        </div>
      </div>
    );
  }

  return (
    <div className="map-component">
      <div className="map-overlay">
        <div className="map-controls">
          <button onClick={() => setMapMode('default')} className={mapMode === 'default' ? 'active' : ''}>
            <span>🎯 Live</span>
          </button>
          <button onClick={() => setMapMode('sensors')} className={mapMode === 'sensors' ? 'active' : ''}>
            <span>📡 Sensors</span>
          </button>
          <button onClick={fetchMapData} title="Refresh">
            <span>↻ Refresh</span>
          </button>
        </div>
        
        <div className="map-info">
          {getMapInfoContent()}
          {isLoading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}
        </div>
      </div>

      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
        <MapController center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          url={`https://{s}-tiles.locationiq.com/v3/streets/raster/{z}/{x}/{y}.png?key=${LOCATIONIQ_API_KEY}`}
          attribution='&copy; LocationIQ'
          subdomains='abc'
        />

        {/* Alerts */}
        {mapMode === 'default' && alerts.map(alert => (
          <Marker key={alert.id} position={alert.position} icon={alertIcon}
            eventHandlers={{ click: () => handleMarkerClick(alert, 'alert') }}>
            <Popup>
              <div>
                <h4>🚨 Gunshot Alert</h4>
                <p>Confidence: {alert.confidence}%</p>
                <p>Status: {alert.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Sensors */}
        {mapMode === 'sensors' && sensors.map(sensor => (
          <Marker key={sensor.id} position={sensor.position} icon={sensorIcon}
            eventHandlers={{ click: () => handleMarkerClick(sensor, 'sensor') }}>
            <Popup>
              <div>
                <h4>📡 {sensor.name}</h4>
                <p>Status: {sensor.status}</p>
                <p>Battery: {sensor.battery}%</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rangers */}
        {rangers.map(ranger => (
          <Marker key={ranger.id} position={ranger.position} icon={rangerIcon}
            eventHandlers={{ click: () => handleMarkerClick(ranger, 'ranger') }}>
            <Popup>
              <div>
                <h4>👮 {ranger.name}</h4>
                <p>Team: {ranger.team}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;