import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaShieldAlt, FaMobile, FaBolt, FaUsers, FaLock } from 'react-icons/fa';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand-name">Nuvio</span>
            </h1>
            <p className="hero-subtitle">
              Connect with friends and family through real-time messaging. 
              Experience the future of communication with our secure, fast, and intuitive chat platform.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="chat-mockup">
              <div className="mockup-header">
                <div className="mockup-avatar"></div>
                <div className="mockup-info">
                  <div className="mockup-name">Nuvio Chat</div>
                  <div className="mockup-status">Online</div>
                </div>
              </div>
              <div className="mockup-messages">
                <div className="mockup-message received">
                  <div className="message-bubble">Hey! How are you doing?</div>
                </div>
                <div className="mockup-message sent">
                  <div className="message-bubble">Great! Just testing Nuvio 😊</div>
                </div>
                <div className="mockup-message received">
                  <div className="message-bubble">It looks amazing!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Nuvio?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaBolt />
              </div>
              <h3>Lightning Fast</h3>
              <p>Real-time messaging powered by Socket.io for instant message delivery</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure & Private</h3>
              <p>End-to-end encryption and secure authentication to protect your conversations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaMobile />
              </div>
              <h3>Mobile Optimized</h3>
              <p>Responsive design that works perfectly on all devices and screen sizes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Connect Everyone</h3>
              <p>Find and chat with all users in your network with our intuitive interface</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaComments />
              </div>
              <h3>Rich Conversations</h3>
              <p>Typing indicators, read receipts, and conversation history for better communication</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaLock />
              </div>
              <h3>Privacy First</h3>
              <p>Your data is stored securely and you have full control over your account</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Chatting?</h2>
            <p>Join thousands of users who are already connecting through Nuvio</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Nuvio</h3>
              <p>Connecting people through real-time messaging</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#security">Security</a></li>
                  <li><a href="#privacy">Privacy</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <ul>
                  <li><a href="#help">Help Center</a></li>
                  <li><a href="#contact">Contact Us</a></li>
                  <li><a href="#status">Status</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About</a></li>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#careers">Careers</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Nuvio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 