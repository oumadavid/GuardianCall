import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AllAlertsPage from './pages/AllAlertsPage/AllAlertsPage';
import AlertDetailsPage from './pages/AlertDetailsPage/AlertDetailsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Navbar from './components/Navbar/Navbar';
import RoutesPage from './pages/RoutePage/RoutePage';
import './App.css';
import SensorsPage from './pages/SensorsPage/SensorsPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/alerts" element={<AllAlertsPage />} />
          <Route path="/alerts/:id" element={<AlertDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/sensors" element={<SensorsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;