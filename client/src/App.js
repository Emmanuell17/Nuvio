import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './components/landing/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatList from './components/chat/ChatList';
import ChatRoom from './components/chat/ChatRoom';
import Profile from './components/profile/Profile';
import Navbar from './components/layout/Navbar';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Main App Content
const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="app">
      {user && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            user ? <Navigate to="/chats" replace /> : <Landing />
          } />
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={
            user ? <Navigate to="/chats" replace /> : <Login />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/chats" replace /> : <Register />
          } />
          <Route path="/chats" element={
            <ProtectedRoute>
              <ChatList />
            </ProtectedRoute>
          } />
          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 