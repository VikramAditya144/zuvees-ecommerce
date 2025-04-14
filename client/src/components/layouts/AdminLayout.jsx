// src/components/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  TruckIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('zuvees-auth') || '{}')?.authState?.user;
  
  // Navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <ChartBarIcon className="w-5 h-5" />
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingBagIcon className="w-5 h-5" />
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <ShoppingCartIcon className="w-5 h-5" />
    },
    {
      name: 'Riders',
      path: '/admin/riders',
      icon: <TruckIcon className="w-5 h-5" />
    },
    {
      name: 'Approved Emails',
      path: '/admin/approved-emails',
      icon: <EnvelopeIcon className="w-5 h-5" />
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Cog6ToothIcon className="w-5 h-5" />
    }
  ];
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('zuvees-auth');
    navigate('/auth');
  };
  
  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" 
          onClick={handleOverlayClick}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/admin/dashboard" className="flex items-center">
            {/* Replace with your actual logo */}
            <div className="h-8 w-8 rounded-md bg-[#660E36] flex items-center justify-center text-white font-bold text-lg">
              Z
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">Zuvees Admin</span>
          </Link>
          
          {/* Close button (mobile only) */}
          <button 
            className="absolute right-4 top-4 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-[#660E36] text-white'
                  : 'text-gray-700 hover:bg-pink-50 hover:text-[#660E36]'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.name} 
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>
            
            {/* Page Title - would be dynamic in a real app */}
            <h1 className="text-lg font-semibold text-gray-900 md:hidden">
              {navItems.find(item => item.path === location.pathname)?.name || 'Admin'}
            </h1>
            
            {/* Right Side - could include notifications, profile dropdown, etc. */}
            <div>
              {/* Placeholder for potential header elements */}
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white p-4 border-t border-gray-200 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Zuvees. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;