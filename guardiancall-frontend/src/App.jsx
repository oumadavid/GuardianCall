import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AllAlertsPage from './pages/AllAlertsPage/AllAlertsPage';
import AlertDetailsPage from './pages/AlertDetailsPage/AlertDetailsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Navbar from './components/Navbar/Navbar';
import './App.css';


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
        </Routes>
      </div>
    </Router>
  );
}

export default App;