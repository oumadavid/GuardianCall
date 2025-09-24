import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ setError] = useState(null);

  // Mock user data - in a real app, this would come from context or API
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    team: '',
    badgeNumber: '',
    station: '',
    joinDate: '',
    status: 'active',
    avatar: '👮', // In real app, this would be a URL
    bio: '',
    stats: {
      alertsResponded: 0,
      successfulInterventions: 0,
      averageResponseTime: '0 min',
      coverageArea: '0 km²'
    },
    certifications: [],
    recentActivity: []
  });

  const [formData, setFormData] = useState({ ...userData });

  //Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      //Fetch profile data from the backend
      const profileData = await apiService.getProfile();
      setUserData(profileData);
      setFormData(profileData);

    } catch (err) {
      setError('Failed to load profile data:' + err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading( false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUserData(formData);
    } else {
      // Start editing - reset form data to current user data
      setFormData({ ...userData });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      //send update to backend
      const updatedUser = await apiService.updateProfile(formData);

      //Update local state with response from the server
      setUserData (updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save profile:' + err.message);
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
    setError(null);
  };

  if (isLoading && !userData.name) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="profile-title">My Profile</h1>
        <div className="header-actions">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEditToggle}>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        {/* Main Profile Card */}
        <div className="profile-card main-profile">
          <div className="profile-header-section">
            <div className="avatar-section">
              <div className="avatar-large">{userData.avatar}</div>
              <div className="avatar-info">
                {isEditing ? (
                  <input
                    className="name-input"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <h2 className="user-name">{userData.name}</h2>
                )}
                <p className="user-role">{userData.role}</p>
                <div className="status-badge active">
                  <span className="status-dot"></span>
                  {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                </div>
              </div>
            </div>
            
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-number">{userData.stats.alertsResponded}</span>
                <span className="stat-label">Alerts Responded</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userData.stats.successfulInterventions}</span>
                <span className="stat-label">Successful Interventions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userData.stats.averageResponseTime}</span>
                <span className="stat-label">Avg Response Time</span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="info-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{userData.email}</span>
                )}
              </div>
              
              <div className="info-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{userData.phone}</span>
                )}
              </div>
              
              <div className="info-field">
                <label>Badge Number</label>
                <span className="info-value badge-number">{userData.badgeNumber}</span>
              </div>
              
              <div className="info-field">
                <label>Team</label>
                <span className="info-value team-badge">{userData.team}</span>
              </div>
              
              <div className="info-field">
                <label>Station</label>
                {isEditing ? (
                  <input
                    value={formData.station}
                    onChange={(e) => handleInputChange('station', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{userData.station}</span>
                )}
              </div>
              
              <div className="info-field">
                <label>Member Since</label>
                <span className="info-value">{new Date(userData.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="info-section">
            <h3>Bio</h3>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bio-textarea"
                rows="4"
              />
            ) : (
              <p className="bio-text">{userData.bio}</p>
            )}
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="profile-sidebar">
          {/* Certifications */}
          <div className="sidebar-card">
            <h3>Certifications</h3>
            <div className="certifications-list">
              {userData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <span className="cert-icon">✅</span>
                  <span className="cert-name">{cert}</span>
                </div>
              ))}
            </div>
            <button className="add-cert-button">+ Add Certification</button>
          </div>

          {/* Recent Activity */}
          <div className="sidebar-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {userData.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-content">
                    <span className="activity-action">{activity.action}</span>
                    <span className="activity-location">{activity.location}</span>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Settings */}
          <div className="sidebar-card">
            <h3>Preferences</h3>
            <div className="preferences-list">
              <div className="preference-item">
                <span>Push Notifications</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <span>Email Alerts</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <span>Dark Mode</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;