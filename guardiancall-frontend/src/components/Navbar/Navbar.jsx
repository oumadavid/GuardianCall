import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock user data
  const user = {
    name: 'Ranger James',
    avatar: '👮',
    role: 'Senior Ranger'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/alerts', label: 'All Alerts', icon: '⚠️' },
    { path: '/routes', label: 'Routes', icon: '🛣️' },
    { path: '/sensors', label: 'Sensors', icon: '📡' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens
    console.log('Logging out...');
    setIsProfileOpen(false);
    // navigate('/login'); // You can add a login page later
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🛡️</span>
        <span className="brand-text">GuardianCall</span>
      </div>

      <div className="navbar-links">
        {navigationItems.map((item) => (
          <button
            key={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-profile" ref={dropdownRef}>
        <button 
          className="profile-trigger"
          onClick={handleProfileClick}
        >
          <div className="profile-avatar">
            {user.avatar}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user.name}</span>
            <span className="profile-role">{user.role}</span>
          </div>
          <span className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>

        {isProfileOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <div className="dropdown-avatar">{user.avatar}</div>
              <div>
                <div className="dropdown-name">{user.name}</div>
                <div className="dropdown-role">{user.role}</div>
              </div>
            </div>
            
            <div className="dropdown-divider"></div>
            
            <button 
              className="dropdown-item"
              onClick={handleProfileNavigation}
            >
              <span className="dropdown-icon">👤</span>
              View Profile
            </button>
            
            <button className="dropdown-item">
              <span className="dropdown-icon">⚙️</span>
              Settings
            </button>
            
            <div className="dropdown-divider"></div>
            
            <button 
              className="dropdown-item logout"
              onClick={handleLogout}
            >
              <span className="dropdown-icon">🚪</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;