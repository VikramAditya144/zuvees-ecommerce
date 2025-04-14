// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

// Pages
import Dashboard from './pages/Dashboard';
import OrdersList from './pages/OrdersList';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';

// State & Hooks
import { authState } from './recoil/atoms/authAtom';
import { useAuth } from './hooks/useAuth';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, user, loading } = useRecoilValue(authState);
  
  // Show loading if auth state is being checked
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="spinner"></div>
    </div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if authenticated but not a rider
  if (user && user.role !== 'rider') {
    return <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-4">This application is for delivery riders only.</p>
      <button 
        onClick={() => {
          localStorage.removeItem('zuvees-rider-auth');
          window.location.href = '/login';
        }}
        className="bg-[#660E36] text-white px-4 py-2 rounded-md"
      >
        Back to Login
      </button>
    </div>;
  }
  
  // Render the protected component
  return element;
};

const App = () => {
  const { loading } = useAuth();
  
  // Register for push notifications
  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
          // In a real app, here you would subscribe to push notifications
        }
      });
    }
  }, []);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/orders" element={<ProtectedRoute element={<OrdersList />} />} />
        <Route path="/orders/:id" element={<ProtectedRoute element={<OrderDetail />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;