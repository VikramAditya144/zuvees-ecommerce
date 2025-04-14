// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

import Logo from '../components/common/Logo';
import Notification from '../components/common/Notification';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import { googleLogin, checkEmailApproval } from '../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    isVisible: false,
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      
      const decoded = jwtDecode(response.credential);
      const { email } = decoded;
      
      // Check if email is approved for rider role
      const approvalResponse = await checkEmailApproval({ email });
      
      if (!approvalResponse.success || !approvalResponse.data.isApproved || approvalResponse.data.role !== 'rider') {
        showNotification('error', 'Your email is not authorized for rider access. Please contact the administrator.');
        return;
      }
      
      // Proceed with login
      const loginResponse = await googleLogin(response.credential);
      
      if (loginResponse.success) {
        const { token, user } = loginResponse.data;
        
        if (user.role !== 'rider') {
          showNotification('error', 'Access denied. This application is for riders only.');
          return;
        }
        
        login(user, token);
        navigate('/');
      } else {
        showNotification('error', loginResponse.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification('error', error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
    showNotification('error', 'Google login failed. Please try again.');
  };
  
  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
      isVisible: true,
    });
    
    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#660E36] to-[#8c1349] flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <Logo className="h-20 w-20" white />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Zuvees Rider
        </h2>
        <p className="mt-2 text-center text-md text-pink-100">
          Delivery Partner Portal
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ? (
            <div className="flex justify-center my-8">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-6">
                  Sign in with your Google account to access your rider dashboard
                </p>
                
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    shape="pill"
                    theme="filled_blue"
                    text="signin_with"
                    size="large"
                    width="100%"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Need help?
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    If you cannot access your account, please contact your administrator or
                    email <a href="mailto:support@zuvees.com" className="text-[#660E36] hover:underline">support@zuvees.com</a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Login;