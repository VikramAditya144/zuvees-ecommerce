// src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon,
  BellIcon,
  GlobeAltIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

import AdminLayout from '../../components/layouts/AdminLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

// Mock settings (in a real app, these would come from API)
const initialSettings = {
  general: {
    storeName: 'Zuvees Store',
    storeEmail: 'info@zuvees.com',
    storePhone: '+1234567890',
    storeAddress: '123 Main Street, City, Country',
    logoUrl: '',
    timezone: 'UTC+0',
    dateFormat: 'MM/DD/YYYY'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    orderStatusUpdates: true,
    marketingEmails: false,
    lowStockAlerts: true
  },
  currency: {
    defaultCurrency: 'USD',
    currencySymbol: '$',
    decimalPlaces: 2,
    showCurrencyCode: false
  },
  shipping: {
    deliveryEnabled: true,
    freeShippingThreshold: 100,
    defaultShippingFee: 10,
    maxDeliveryDuration: 3, // in days
    riderAssignmentType: 'automatic' // or 'manual'
  }
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Fetch settings (mock)
  useEffect(() => {
    // In a real app, would fetch from API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSettings(initialSettings);
      setLoading(false);
    }, 500);
  }, []);
  
  // Handle input change
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  // Handle toggle change
  const handleToggle = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };
  
  // Handle save settings
  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  // Tabs
  const tabs = [
    {
      id: 'general',
      name: 'General',
      icon: <Cog6ToothIcon className="w-5 h-5" />
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: <BellIcon className="w-5 h-5" />
    },
    {
      id: 'currency',
      name: 'Currency',
      icon: <CurrencyDollarIcon className="w-5 h-5" />
    },
    {
      id: 'shipping',
      name: 'Shipping',
      icon: <TruckIcon className="w-5 h-5" />
    }
  ];
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure your store settings and preferences</p>
      </div>
      
      {/* Save Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 p-4 rounded-md mb-6 flex items-center"
        >
          <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">Settings saved successfully!</span>
        </motion.div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[#660E36] text-[#660E36]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Store Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.storeName}
                    onChange={(e) => handleChange('general', 'storeName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.storeEmail}
                    onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.general.storePhone}
                    onChange={(e) => handleChange('general', 'storePhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Address
                  </label>
                  <input
                    type="text"
                    value={settings.general.storeAddress}
                    onChange={(e) => handleChange('general', 'storeAddress', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Regional Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                    >
                      <option value="UTC+0">UTC+0 (London, Lisbon)</option>
                      <option value="UTC-5">UTC-5 (New York, Toronto)</option>
                      <option value="UTC-8">UTC-8 (Los Angeles, Vancouver)</option>
                      <option value="UTC+1">UTC+1 (Berlin, Paris)</option>
                      <option value="UTC+8">UTC+8 (Beijing, Singapore)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Format
                    </label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => handleChange('general', 'dateFormat', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (UK/EU)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleToggle('notifications', 'emailNotifications')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.emailNotifications ? 'bg-[#660E36]' : 'bg-gray-200'
                      }`}
                    >
                      <span className="sr-only">Toggle email notifications</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.notifications.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleToggle('notifications', 'smsNotifications')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.smsNotifications ? 'bg-[#660E36]' : 'bg-gray-200'
                      }`}
                    >
                      <span className="sr-only">Toggle SMS notifications</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.notifications.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Order Status Updates</h3>
                    <p className="text-sm text-gray-500">Get notified when order status changes</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleToggle('notifications', 'orderStatusUpdates')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.orderStatusUpdates ? 'bg-[#660E36]' : 'bg-gray-200'
                      }`}
                    >
                      <span className="sr-only">Toggle order status updates</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.notifications.orderStatusUpdates ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                    <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleToggle('notifications', 'marketingEmails')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.marketingEmails ? 'bg-[#660E36]' : 'bg-gray-200'
                      }`}
                    >
                      <span className="sr-only">Toggle marketing emails</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.notifications.marketingEmails ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Low Stock Alerts</h3>
                    <p className="text-sm text-gray-500">Notify when products are running low on stock</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleToggle('notifications', 'lowStockAlerts')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.notifications.lowStockAlerts ? 'bg-[#660E36]' : 'bg-gray-200'
                      }`}
                    >
                      <span className="sr-only">Toggle low stock alerts</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.notifications.lowStockAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Currency Settings */}
          {activeTab === 'currency' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Currency Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Currency
                  </label>
                  <select
                    value={settings.currency.defaultCurrency}
                    onChange={(e) => handleChange('currency', 'defaultCurrency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={settings.currency.currencySymbol}
                    onChange={(e) => handleChange('currency', 'currencySymbol', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Decimal Places
                  </label>
                  <select
                    value={settings.currency.decimalPlaces}
                    onChange={(e) => handleChange('currency', 'decimalPlaces', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center py-2">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Show Currency Code</h3>
                  <p className="text-sm text-gray-500">Display the currency code alongside the symbol (e.g., $10 USD)</p>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleToggle('currency', 'showCurrencyCode')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.currency.showCurrencyCode ? 'bg-[#660E36]' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">Toggle currency code display</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.currency.showCurrencyCode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Price Display Preview</h3>
                <div className="flex space-x-4">
                  <div>
                    <span className="text-gray-500 text-sm">Item Price:</span>
                    <div className="text-gray-900 font-medium">
                      {settings.currency.currencySymbol}10{settings.currency.decimalPlaces > 0 ? '.' + '0'.repeat(settings.currency.decimalPlaces) : ''}
                      {settings.currency.showCurrencyCode ? ` ${settings.currency.defaultCurrency}` : ''}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Shipping:</span>
                    <div className="text-gray-900 font-medium">
                      {settings.currency.currencySymbol}5{settings.currency.decimalPlaces > 0 ? '.' + '0'.repeat(settings.currency.decimalPlaces) : ''}
                      {settings.currency.showCurrencyCode ? ` ${settings.currency.defaultCurrency}` : ''}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Total:</span>
                    <div className="text-gray-900 font-medium">
                      {settings.currency.currencySymbol}15{settings.currency.decimalPlaces > 0 ? '.' + '0'.repeat(settings.currency.decimalPlaces) : ''}
                      {settings.currency.showCurrencyCode ? ` ${settings.currency.defaultCurrency}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Shipping & Delivery Settings</h2>
              
              <div className="flex items-center py-2 border-b border-gray-100">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Enable Delivery</h3>
                  <p className="text-sm text-gray-500">Allow customers to select delivery option at checkout</p>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleToggle('shipping', 'deliveryEnabled')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.shipping.deliveryEnabled ? 'bg-[#660E36]' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">Toggle delivery option</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.shipping.deliveryEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Free Shipping Threshold ({settings.currency.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) => handleChange('shipping', 'freeShippingThreshold', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Orders above this amount qualify for free shipping. Set to 0 to disable.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Shipping Fee ({settings.currency.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.shipping.defaultShippingFee}
                    onChange={(e) => handleChange('shipping', 'defaultShippingFee', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Delivery Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.shipping.maxDeliveryDuration}
                    onChange={(e) => handleChange('shipping', 'maxDeliveryDuration', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum number of days for delivery after order is placed
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rider Assignment Type
                  </label>
                  <select
                    value={settings.shipping.riderAssignmentType}
                    onChange={(e) => handleChange('shipping', 'riderAssignmentType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  >
                    <option value="automatic">Automatic (System assigns riders)</option>
                    <option value="manual">Manual (Admin assigns riders)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="ml-3"
            icon={saving ? <Loader size="sm" /> : null}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;