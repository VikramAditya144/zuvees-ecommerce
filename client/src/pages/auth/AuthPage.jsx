// src/pages/auth/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';  // Add this import


import { authState } from '../../recoil/atoms/authAtom';
import { googleLogin, checkEmailApproval } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';

import MainLayout from '../../components/layouts/MainLayout';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Notification from '../../components/common/Notification';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useRecoilValue(authState);
  const { login } = useAuth();
  
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
      
      // Check if email is approved first
      const { email } = jwtDecode(response.credential);
      console.log('Decoded email:', email);
      const approvalResponse = await checkEmailApproval({ email });
      console.log('Approval response:', approvalResponse);
      if (!approvalResponse.data.isApproved) {
        showNotification('error', 'Your email is not approved for access. Please contact support.');
        return;
      }
      
      // Proceed with login
      const loginResponse = await googleLogin(response.credential);
      
      console.log('Login response:', loginResponse);
      if (loginResponse.success) {
        const { token, user } = loginResponse.data;
        login(user, token);
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'rider') {
          navigate('/rider/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Failed to login. Please try again.';
      showNotification('error', errorMessage);
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
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <Logo className="h-16 w-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800">Welcome to Zuvees</h1>
              <p className="text-gray-600 text-center mt-2">
                Sign in to access your account and explore our exceptional gifting experiences.
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center my-8">
                <Loader size="lg" />
              </div>
            ) : (
              <div className="space-y-6">
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
                
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-300 w-full"></div>
                  <span className="bg-white px-3 text-sm text-gray-500 relative">
                    or
                  </span>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Don't have an account? Contact us to get approved for access.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/contact')}
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </MainLayout>
  );
};

export default Auth;