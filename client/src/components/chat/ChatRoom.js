import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaArrowLeft, FaPaperPlane, FaHome } from 'react-icons/fa';
import io from 'socket.io-client';
import axios from 'axios';
import './ChatRoom.css';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io('http://192.168.0.178:5001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('authenticate', token);
    });

    newSocket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
    });

    newSocket.on('auth_error', (error) => {
      console.error('Socket auth error:', error);
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_typing', (data) => {
      if (data.userId === parseInt(userId)) {
        setIsTyping(true);
      }
    });

    newSocket.on('user_stopped_typing', (data) => {
      if (data.userId === parseInt(userId)) {
        setIsTyping(false);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  // Fetch chat history and user info
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/messages/chat/${userId}`);
        setMessages(response.data.messages || []);
        setOtherUser(response.data.otherUser);
      } catch (error) {
        console.error('Error fetching chat data:', error);
        navigate('/chats');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchChatData();
    }
  }, [userId, navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (socket && otherUser) {
      socket.emit('mark_read', { senderId: parseInt(userId) });
    }
  }, [socket, userId, otherUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      receiverId: parseInt(userId),
      content: newMessage.trim(),
      messageType: 'text'
    };

    socket.emit('private_message', messageData);
    setNewMessage('');
    
    // Clear typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    socket.emit('typing_stop', { receiverId: parseInt(userId) });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!socket) return;

    // Emit typing start
    socket.emit('typing_start', { receiverId: parseInt(userId) });

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing indicator
    const timeout = setTimeout(() => {
      socket.emit('typing_stop', { receiverId: parseInt(userId) });
    }, 1000);

    setTypingTimeout(timeout);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (username) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="chat-room-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="chat-room-container">
        <div className="error-container">
          <p>User not found</p>
          <button onClick={() => navigate('/chats')} className="btn btn-primary">
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <div className="header-left">
          <button onClick={() => navigate('/chats')} className="back-button">
            <FaArrowLeft />
          </button>
          <Link to="/" className="home-button">
            <FaHome />
          </Link>
        </div>
        <div className="user-avatar">
          {otherUser.avatar_url ? (
            <img src={otherUser.avatar_url} alt={otherUser.username} />
          ) : (
            getInitials(otherUser.username)
          )}
        </div>
        <div className="user-info">
          <h3>{otherUser.username}</h3>
          <p>Online</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}
            >
              <div className="message-bubble">
                {message.content}
              </div>
              <div className="message-time">
                {formatTime(message.created_at)}
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="typing-indicator">
            {otherUser.username} is typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input">
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows="1"
          className="message-input"
        />
        <button
          type="submit"
          className="send-button"
          disabled={!newMessage.trim()}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom; 