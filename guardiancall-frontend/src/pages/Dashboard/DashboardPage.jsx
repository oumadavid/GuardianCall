import React from 'react';
import AlertList from '../../components/AlertList/AlertList';
import MapComponent from '../../components/MapComponent/MapComponent';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">  
      <div className="dashboard-content">
        <AlertList />
        <MapComponent />
      </div>
    </div>
  );
}

export default DashboardPage;