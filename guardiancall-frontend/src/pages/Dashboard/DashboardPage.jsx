import React from 'react';
import AlertList from '../../components/AlertList/AlertList';
import MapComponent from '../../components/MapComponent/MapComponent';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">GuardianCall</h1>
        <div className="status-indicator">
          <span className="status-dot active"></span>
          <span className="status-text">System Active</span>
        </div>
      </div>
      
      <div className="dashboard-content">
        <AlertList />
        <MapComponent />
      </div>
    </div>
  );
}

export default DashboardPage;