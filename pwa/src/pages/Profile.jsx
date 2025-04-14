// src/pages/Profile.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

import RiderLayout from '../components/layouts/RiderLayout';
import Button from '../components/common/Button';
import Notification from '../components/common/Notification';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();
  
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    isVisible: false,
  });
  
  // Show notification
  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
      isVisible: true,
    });
    
    // Auto hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };
  
  return (
    <RiderLayout title="My Profile">
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-[#660E36] to-[#8c1349] px-4 py-6 text-white">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mb-3">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-20 w-20 text-gray-300" />
                )}
              </div>
              
              <h1 className="text-xl font-bold">{user?.name}</h1>
              <p className="text-pink-100">Delivery Partner</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Joined On</p>
                  <p className="font-medium">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Account Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-800">Account Settings</h2>
          </div>
          
          <div className="p-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Account Update</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Need to update your profile information? Please contact your administrator at{' '}
                      <a href="mailto:support@zuvees.com" className="font-medium underline">
                        support@zuvees.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  showNotification('info', 'This feature is coming soon!');
                }}
              >
                Change Language
              </Button>
              
              <Button
                variant="danger"
                fullWidth
                onClick={logout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* App Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-800">App Information</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">App Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Developer</p>
                <p className="font-medium">Zuvees Tech Team</p>
              </div>
              
              <div className="pt-4 text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} Zuvees. All rights reserved.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </RiderLayout>
  );
};

export default Profile;