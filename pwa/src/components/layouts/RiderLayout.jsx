// src/components/layouts/RiderLayout.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

const RiderLayout = ({ children, title = 'Zuvees Rider' }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
    { path: '/orders', label: 'Orders', icon: <ShoppingBagIcon className="w-6 h-6" /> },
    { path: '/profile', label: 'Profile', icon: <UserCircleIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#660E36] text-white sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo className="h-8 w-8" white />
              <h1 className="ml-3 text-xl font-bold">{title}</h1>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <div className="text-sm">
                  <span className="font-medium">{user.name}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-[#7a2a4f] transition-colors"
                aria-label="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
            
            <button
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 shadow-sm"
          >
            <div className="container mx-auto px-4 py-2">
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 rounded-md text-gray-700 ${
                        isActive ? 'bg-[#fdf0f5] text-[#660E36]' : 'hover:bg-gray-100'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-30">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-md text-gray-700 ${
                      isActive ? 'bg-[#fdf0f5] text-[#660E36] font-medium' : 'hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            {user && (
              <div className="mb-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#660E36] text-white flex items-center justify-center">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content Container (with proper layout for both mobile and desktop) */}
      <main className="flex-1 md:ml-64 pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full z-40 shadow-lg">
        <div className="grid grid-cols-3 h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center ${
                  isActive ? 'text-[#660E36]' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default RiderLayout;