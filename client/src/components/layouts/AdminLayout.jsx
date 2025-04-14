// src/components/layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  GiftIcon,
  UserCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
  { path: '/admin/products', label: 'Products', icon: <GiftIcon className="w-5 h-5" /> },
  { path: '/admin/orders', label: 'Orders', icon: <ShoppingBagIcon className="w-5 h-5" /> },
  { path: '/admin/users', label: 'Users', icon: <UsersIcon className="w-5 h-5" /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
  { path: '/admin/settings', label: 'Settings', icon: <CogIcon className="w-5 h-5" /> },
];

const AdminLayout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Check if user is authenticated and is an admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { redirectTo: location.pathname } });
      return;
    }
    
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, location.pathname]);
  
  // Close sidebar when location changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-[#660E36] text-white">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-[#7a2a4f]">
            <Link to="/admin/dashboard" className="flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Zuvees Admin</span>
            </Link>
          </div>
          
          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-[#4d0a28] text-white' 
                      : 'text-white hover:bg-[#7a2a4f]'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* User Info */}
          <div className="p-4 border-t border-[#7a2a4f]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-300">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center w-full px-4 py-2 text-sm text-white rounded-md hover:bg-[#7a2a4f] transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'tween' }}
              className="fixed inset-y-0 left-0 w-64 bg-[#660E36] text-white flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-[#7a2a4f]">
                <Link to="/admin/dashboard" className="flex items-center">
                  <Logo className="h-8 w-8" />
                  <span className="ml-2 text-xl font-bold">Zuvees Admin</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              
              {/* Nav Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-2 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.path 
                          ? 'bg-[#4d0a28] text-white' 
                          : 'text-white hover:bg-[#7a2a4f]'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              
              {/* User Info */}
              <div className="p-4 border-t border-[#7a2a4f]">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-300">{user?.email || 'admin@example.com'}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="mt-4 flex items-center w-full px-4 py-2 text-sm text-white rounded-md hover:bg-[#7a2a4f] transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button 
                onClick={toggleSidebar}
                className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
              <div className="ml-4 md:ml-0">
                <h1 className="text-lg font-semibold">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <EnvelopeIcon className="h-6 w-6" />
              </button>
              
              {/* User Menu - Mobile */}
              <div className="md:hidden">
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <UserCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;