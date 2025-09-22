import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AllAlertsPage from './pages/AllAlertsPage/AllAlertsPage';
import AlertDetailsPage from './pages/AlertDetailsPage/AlertDetailsPage';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/alerts" element={<AllAlertsPage />} />
           <Route path="/alerts/:id" element={<AlertDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;