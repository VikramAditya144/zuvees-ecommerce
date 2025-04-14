// src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  CheckIcon, 
  ShoppingBagIcon, 
  ExclamationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

import RiderLayout from '../components/layouts/RiderLayout';
import StatsCard from '../components/rider/StatusCard';
import DeliveryProgressChart from '../components/rider/DeliveryProgressChart';
import RecentOrdersList from '../components/rider/RecentOrdersList';
import Loader from '../components/common/Loader';
import { useRiderDashboard } from '../hooks/useRiderDashboard';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { stats, performance, recentOrders, loading, error, fetchDashboardStats } = useRiderDashboard();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);
  
  if (loading) {
    return (
      <RiderLayout title="Dashboard">
        <div className="container mx-auto px-4 py-8">
          <Loader className="py-20" />
        </div>
      </RiderLayout>
    );
  }
  
  return (
    <RiderLayout title="Dashboard">
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#660E36] to-[#8c1349] text-white rounded-lg p-6 shadow-md"
          >
            <h1 className="text-xl font-bold mb-2">Welcome Back, {user?.name?.split(' ')[0] || 'Rider'}!</h1>
            <p className="text-pink-100 mb-3">Here's your delivery overview for today</p>
            
            <div className="inline-block mt-2 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <div className="flex items-center">
                <ShoppingBagIcon className="w-4 h-4 mr-1" />
                <span className="font-medium mr-1">{stats.todayOrders } </span> {" orders assigned today"}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatsCard
            title="Pending Deliveries"
            value={stats.shippedOrders}
            icon={<TruckIcon className="w-6 h-6" />}
            color="#3B82F6" // Blue
          />
          
          <StatsCard
            title="Delivered"
            value={stats.deliveredOrders}
            icon={<CheckIcon className="w-6 h-6" />}
            color="#10B981" // Green
          />
          
          <StatsCard
            title="Undelivered"
            value={stats.undeliveredOrders}
            icon={<ExclamationCircleIcon className="w-6 h-6" />}
            color="#EF4444" // Red
          />
          
          <StatsCard
            title="Total Assigned"
            value={stats.totalAssigned}
            icon={<ShoppingBagIcon className="w-6 h-6" />}
            color="#8B5CF6" // Purple
          />
        </div>
        
        {/* Delivery Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <DeliveryProgressChart deliveryRate={performance.deliveryRate} />
        </motion.div>
        
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link 
              to="/orders" 
              className="text-[#660E36] hover:underline text-sm font-medium flex items-center"
            >
              View All
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <RecentOrdersList orders={recentOrders} />
        </motion.div>
      </div>
    </RiderLayout>
  );
};

export default Dashboard;