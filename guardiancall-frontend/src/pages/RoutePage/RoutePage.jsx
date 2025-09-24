import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../../components/MapComponent/MapComponent';
import './RoutePage.css';

function RoutesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);

  // Mock data for routes
  const [routes, setRoutes] = useState({
    active: [
      {
        id: 1,
        name: 'Northern Patrol',
        ranger: 'James Kariuki',
        status: 'in-progress',
        progress: 65,
        distance: '15.2 km',
        duration: '3h 45m',
        waypoints: 12,
        startTime: '06:00',
        estimatedEnd: '09:45',
        coordinates: [
          { lat: -1.234, lng: 36.789 },
          { lat: -1.238, lng: 36.795 },
          { lat: -1.242, lng: 36.802 }
        ]
      },
      {
        id: 2,
        name: 'River Monitoring',
        ranger: 'Sarah Mwende',
        status: 'in-progress',
        progress: 30,
        distance: '8.7 km',
        duration: '2h 15m',
        waypoints: 8,
        startTime: '07:30',
        estimatedEnd: '09:45',
        coordinates: [
          { lat: -1.228, lng: 36.781 },
          { lat: -1.225, lng: 36.788 }
        ]
      }
    ],
    scheduled: [
      {
        id: 3,
        name: 'Eastern Boundary',
        ranger: 'Mike Otieno',
        status: 'scheduled',
        distance: '22.1 km',
        duration: '5h 30m',
        waypoints: 18,
        startTime: '14:00',
        scheduledDate: '2023-08-20'
      }
    ],
    completed: [
      {
        id: 4,
        name: 'Western Sector',
        ranger: 'Anna Wambui',
        status: 'completed',
        distance: '12.5 km',
        duration: '3h 15m',
        waypoints: 10,
        completedAt: '2023-08-18 11:30',
        alertsFound: 2
      }
    ]
  });

  const [newRoute, setNewRoute] = useState({
    name: '',
    ranger: '',
    waypoints: []
  });

  const handleCreateRoute = () => {
    if (newRoute.name && newRoute.ranger) {
      const route = {
        id: Date.now(),
        ...newRoute,
        status: 'scheduled',
        distance: '0 km',
        duration: '0h 0m',
        waypoints: newRoute.waypoints.length,
        startTime: '08:00'
      };
      
      setRoutes(prev => ({
        ...prev,
        scheduled: [...prev.scheduled, route]
      }));
      
      setNewRoute({ name: '', ranger: '', waypoints: [] });
      setIsCreatingRoute(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return '#4299E1';
      case 'scheduled': return '#ED8936';
      case 'completed': return '#48BB78';
      default: return '#A0AEC0';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress': return '🟢';
      case 'scheduled': return '🟡';
      case 'completed': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className="routes-page">
      {/* Header */}
      <div className="routes-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="routes-title">Patrol Routes Management</h1>
        <button 
          className="create-route-button"
          onClick={() => setIsCreatingRoute(true)}
        >
          + Create New Route
        </button>
      </div>

      <div className="routes-content">
        {/* Routes Sidebar */}
        <div className="routes-sidebar">
          {/* Tabs */}
          <div className="routes-tabs">
            <button 
              className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Routes ({routes.active.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveTab('scheduled')}
            >
              Scheduled ({routes.scheduled.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({routes.completed.length})
            </button>
          </div>

          {/* Routes List */}
          <div className="routes-list">
            {routes[activeTab].map(route => (
              <div 
                key={route.id}
                className={`route-card ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="route-header">
                  <div className="route-status">
                    <span className="status-icon">{getStatusIcon(route.status)}</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(route.status) }}
                    >
                      {route.status.replace('-', ' ')}
                    </span>
                  </div>
                  <h3 className="route-name">{route.name}</h3>
                </div>
                
                <div className="route-info">
                  <div className="info-row">
                    <span className="info-label">Ranger:</span>
                    <span className="info-value">{route.ranger}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Distance:</span>
                    <span className="info-value">{route.distance}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{route.duration}</span>
                  </div>
                  {route.progress && (
                    <div className="progress-container">
                      <div className="progress-label">Progress: {route.progress}%</div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${route.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="route-actions">
                  <button className="action-button view">View on Map</button>
                  {route.status === 'in-progress' && (
                    <button className="action-button update">Update</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="routes-map-container">
          <MapComponent 
            mode="routes"
            selectedRoute={selectedRoute}
            routes={routes[activeTab]}
            isCreatingRoute={isCreatingRoute}
            newRouteWaypoints={newRoute.waypoints}
          />
        </div>
      </div>

      {/* Create Route Modal */}
      {isCreatingRoute && (
        <div className="modal-overlay">
          <div className="create-route-modal">
            <div className="modal-header">
              <h2>Create New Patrol Route</h2>
              <button 
                className="close-button"
                onClick={() => setIsCreatingRoute(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Route Name</label>
                <input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Northern Boundary Patrol"
                />
              </div>
              
              <div className="form-group">
                <label>Assign Ranger</label>
                <select
                  value={newRoute.ranger}
                  onChange={(e) => setNewRoute(prev => ({ ...prev, ranger: e.target.value }))}
                >
                  <option value="">Select Ranger</option>
                  <option value="James Kariuki">James Kariuki</option>
                  <option value="Sarah Mwende">Sarah Mwende</option>
                  <option value="Mike Otieno">Mike Otieno</option>
                  <option value="Anna Wambui">Anna Wambui</option>
                </select>
              </div>

              <div className="form-group">
                <label>Waypoints</label>
                <div className="waypoints-info">
                  <span>Click on the map to add waypoints</span>
                  <span className="waypoints-count">{newRoute.waypoints.length} points added</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setIsCreatingRoute(false)}
              >
                Cancel
              </button>
              <button 
                className="create-button"
                onClick={handleCreateRoute}
                disabled={!newRoute.name || !newRoute.ranger}
              >
                Create Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoutesPage;