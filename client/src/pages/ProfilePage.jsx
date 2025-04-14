// src/pages/profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  CogIcon,
  ShieldCheckIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../components/layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Notification from '../components/common/Notification';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../services/user';

const ProfilePage = () => {
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });
  
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    isVisible: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { redirectTo: '/profile' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'US'
        }
      });
    }
  }, [user]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare data for API
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        role: "customer",
      };
      
      const response = await updateProfile(updateData);
      
      if (response.success) {
        // Update user in auth state
        login({
          ...user,
          ...response.data
        }, user.token);
        
        setEditing(false);
        showNotification('success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
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
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <Loader size="lg" />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">
              Manage your account information and preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
              >
                <div className="p-6 text-center border-b border-gray-200">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-[#660E36] text-white rounded-full mb-4">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-16 h-16" />
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                  <p className="text-gray-500 mb-4">{user.email}</p>
                  
                  <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-800 capitalize">
                    {user.role}
                  </div>
                </div>
                
                <div className="p-6">
                  <nav className="space-y-2">
                    <a href="#profile" className="flex items-center px-3 py-2 text-[#660E36] bg-pink-50 rounded-md font-medium">
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      <span>Profile Information</span>
                    </a>
                    
                    <a href="/orders" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">
                      <ShoppingBagIcon className="w-5 h-5 mr-2" />
                      <span>My Orders</span>
                      <ArrowRightIcon className="w-4 h-4 ml-auto" />
                    </a>
                    
                    <a href="#settings" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">
                      <CogIcon className="w-5 h-5 mr-2" />
                      <span>Settings</span>
                      <ArrowRightIcon className="w-4 h-4 ml-auto" />
                    </a>
                  </nav>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">Verified Account</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Profile Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Profile Information</h2>
                    
                    {!editing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(true)}
                        icon={<PencilIcon className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  {editing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <Input
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        
                        <Input
                          label="Email"
                          type="email"
                          value={user.email}
                          disabled
                          readOnly
                        />
                        
                        <Input
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        
                        <div className="border-t border-gray-200 pt-4 mt-6">
                          <h3 className="text-lg font-medium mb-4">Address</h3>
                          
                          <Input
                            label="Street Address"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="City"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleChange}
                            />
                            
                            <Input
                              label="State/Province"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="ZIP/Postal Code"
                              name="address.zipCode"
                              value={formData.address.zipCode}
                              onChange={handleChange}
                            />
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                              </label>
                              <select
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                              >
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="GB">United Kingdom</option>
                                <option value="AU">Australia</option>
                                <option value="IN">India</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 mt-6">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setEditing(false)}
                          >
                            Cancel
                          </Button>
                          
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                          <p className="text-base">{user.name || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                          <div className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-1" />
                            <p className="text-base">{user.email}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                          <div className="flex items-center">
                            <PhoneIcon className="w-4 h-4 text-gray-400 mr-1" />
                            <p className="text-base">{user.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
                          <p className="text-base capitalize">{user.role}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium mb-4">Address</h3>
                        
                        {user.address && (user.address.street || user.address.city) ? (
                          <div className="flex items-start">
                            <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              {user.address.street && <p className="mb-1">{user.address.street}</p>}
                              {user.address.city && (
                                <p>
                                  {user.address.city}
                                  {user.address.state && `, ${user.address.state}`} 
                                  {user.address.zipCode && ` ${user.address.zipCode}`}
                                </p>
                              )}
                              {user.address.country && (
                                <p className="text-gray-500 text-sm">
                                  {user.address.country === 'US' ? 'United States' :
                                    user.address.country === 'CA' ? 'Canada' :
                                    user.address.country === 'GB' ? 'United Kingdom' :
                                    user.address.country === 'AU' ? 'Australia' :
                                    user.address.country === 'IN' ? 'India' :
                                    user.address.country}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500">No address provided</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/orders')}
                      icon={<ArrowRightIcon className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      View All Orders
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* This would be populated with actual order data in a real application */}
                  
                  <div className="text-center py-8">
                    <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">No recent orders found.</p>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/products')}
                    >
                      Start Shopping
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
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

export default ProfilePage;