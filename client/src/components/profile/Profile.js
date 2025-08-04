import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaCalendar, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // const { user, updateUser } = useAuth(); // Will be used for future features
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/profile');
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (username) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate('/chats')} className="btn btn-primary">
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={() => navigate('/chats')} className="back-button">
          <FaArrowLeft />
        </button>
        <h1>Profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} />
          ) : (
            getInitials(profile?.username || '')
          )}
        </div>

        <div className="profile-info">
          <div className="info-item">
            <div className="info-label">
              <FaUser />
              Username
            </div>
            <div className="info-value">{profile?.username}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <FaEnvelope />
              Email
            </div>
            <div className="info-value">{profile?.email}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <FaCalendar />
              Member Since
            </div>
            <div className="info-value">{formatDate(profile?.created_at)}</div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-number">Active</div>
            <div className="stat-label">Status</div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button 
          onClick={() => navigate('/chats')} 
          className="btn btn-primary w-100"
        >
          Back to Chats
        </button>
      </div>
    </div>
  );
};

export default Profile; 