import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaSearch, FaUser, FaComments, FaHome } from 'react-icons/fa';
import axios from 'axios';
import './ChatList.css';

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('conversations');
  
  // const { user } = useAuth(); // Will be used for future features
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch conversations and users in parallel
      const [conversationsRes, usersRes] = await Promise.all([
        axios.get('/api/messages/conversations'),
        axios.get('/api/auth/users')
      ]);

      setConversations(conversationsRes.data.conversations || []);
      setUsers(usersRes.data.users || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (username) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users.filter(userItem => 
    userItem.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return (
      <div className="chat-list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <div className="header-left">
          <Link to="/" className="nuvio-title" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#007bff', textDecoration: 'none', marginRight: '16px' }}>
            Nuvio
          </Link>
          <Link to="/" className="home-button">
            <FaHome />
            <span>Home</span>
          </Link>
          <h1>Chats</h1>
        </div>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'conversations' ? 'active' : ''}`}
          onClick={() => setActiveTab('conversations')}
        >
          <FaComments />
          Conversations
          {conversations.length > 0 && (
            <span className="tab-badge">{conversations.length}</span>
          )}
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUser />
          All Users
          <span className="tab-badge">{users.length}</span>
        </button>
      </div>

      <div className="chat-list-content">
        {activeTab === 'conversations' ? (
          <>
            {filteredConversations.length === 0 ? (
              <div className="empty-state">
                <FaComments className="empty-icon" />
                <h3>No conversations yet</h3>
                <p>Start chatting with other users to see your conversations here.</p>
              </div>
            ) : (
              <div className="chat-list">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="chat-item"
                    onClick={() => handleUserClick(conversation.id)}
                  >
                    <div className="avatar">
                      {conversation.avatar_url ? (
                        <img src={conversation.avatar_url} alt={conversation.username} />
                      ) : (
                        getInitials(conversation.username)
                      )}
                    </div>
                    <div className="content">
                      <h3>{conversation.username}</h3>
                      <p>{conversation.last_message || 'No messages yet'}</p>
                    </div>
                    <div className="meta">
                      <div className="time">
                        {formatTime(conversation.last_message_time)}
                      </div>
                      {conversation.unread_count > 0 && (
                        <div className="unread">
                          {conversation.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <FaUser className="empty-icon" />
                <h3>No users found</h3>
                <p>Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="chat-list">
                {filteredUsers.map((userItem) => (
                  <div
                    key={userItem.id}
                    className="chat-item"
                    onClick={() => handleUserClick(userItem.id)}
                  >
                    <div className="avatar">
                      {userItem.avatar_url ? (
                        <img src={userItem.avatar_url} alt={userItem.username} />
                      ) : (
                        getInitials(userItem.username)
                      )}
                    </div>
                    <div className="content">
                      <h3>{userItem.username}</h3>
                      <p>Click to start a conversation</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatList; 