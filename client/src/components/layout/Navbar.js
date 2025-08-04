import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const getInitials = (username) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // const isChatPage = location.pathname.startsWith('/chat/'); // Will be used for future features

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Nuvio</h1>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="username">{user?.username}</span>
          </div>
          
          <div className="user-avatar" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} />
            ) : (
              getInitials(user?.username || '')
            )}
          </div>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <button onClick={handleProfileClick} className="dropdown-item">
              <FaUser />
              Profile
            </button>
            <button onClick={handleLogout} className="dropdown-item">
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 