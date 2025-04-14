// src/pages/admin/dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon, 
  UserIcon, 
  TruckIcon, 
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

import AdminLayout from '../../components/layouts/AdminLayout';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { getDashboardStats } from '../../services/admin';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get status badge for order
  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'warning' },
      paid: { label: 'Paid', variant: 'primary' },
      shipped: { label: 'Shipped', variant: 'info' },
      delivered: { label: 'Delivered', variant: 'success' },
      undelivered: { label: 'Undelivered', variant: 'danger' },
      cancelled: { label: 'Cancelled', variant: 'secondary' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
    );
  };
  
  // Month number to name converter
  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1];
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    );
  }
  
  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error || 'Failed to load dashboard data'}</p>
        </div>
      </AdminLayout>
    );
  }
  
  // Prepare data for charts
  const monthlySalesData = stats.monthlySales.map(item => ({
    name: getMonthName(item.month),
    sales: item.total,
    orders: item.count
  }));
  
  const orderStatusData = [
    { name: 'pending', value: stats.counts.pendingOrders },
    { name: 'paid', value: stats.counts.paidOrders },
    { name: 'shipped', value: stats.counts.shippedOrders },
    { name: 'delivered', value: stats.counts.deliveredOrders },
    { name: 'undelivered', value: stats.counts.undeliveredOrders },
    { name: 'cancelled', value: stats.counts.cancelledOrders }
  ];
  
  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="flex items-center">
            <div className="mr-4 bg-blue-100 p-3 rounded-full">
              <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{stats.counts.totalOrders}</h3>
              <p className="text-gray-500 text-sm">Total Orders</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
          <Card className="flex items-center">
            <div className="mr-4 bg-green-100 p-3 rounded-full">
              <BanknotesIcon className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                ${monthlySalesData.reduce((acc, item) => acc + item.sales, 0).toFixed(2)}
              </h3>
              <p className="text-gray-500 text-sm">Total Revenue</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
          <Card className="flex items-center">
            <div className="mr-4 bg-purple-100 p-3 rounded-full">
              <UserIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{stats.counts.totalUsers}</h3>
              <p className="text-gray-500 text-sm">Total Customers</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
          <Card className="flex items-center">
            <div className="mr-4 bg-yellow-100 p-3 rounded-full">
              <TruckIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{stats.counts.totalRiders}</h3>
              <p className="text-gray-500 text-sm">Delivery Riders</p>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Orders Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          variants={fadeInUp} 
          initial="initial" 
          animate="animate"
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Sales Overview</h2>
          </div>
          <div className="p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySalesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" name="Sales ($)" fill="#660E36" />
                <Bar dataKey="orders" name="Orders" fill="#FF9F1C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp} 
          initial="initial" 
          animate="animate"
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Performance</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Orders Completed</span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.counts.deliveredOrders} / {stats.counts.totalOrders}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.counts.deliveredOrders / stats.counts.totalOrders) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Pending Orders</span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.counts.pendingOrders} / {stats.counts.totalOrders}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(stats.counts.pendingOrders / stats.counts.totalOrders) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Cancelled Orders</span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.counts.cancelledOrders} / {stats.counts.totalOrders}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(stats.counts.cancelledOrders / stats.counts.totalOrders) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">32% increase</span>
                  </div>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp} 
          initial="initial" 
          animate="animate"
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Order Status</h2>
          </div>
          <div className="p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={orderStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#660E36" fill="#fde0ea" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Recent Orders */}
      <motion.div 
        variants={fadeInUp} 
        initial="initial" 
        animate="animate"
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link 
            to="/admin/orders" 
            className="text-[#660E36] text-sm font-medium hover:underline"
          >
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/admin/orders/${order._id}`} className="text-[#660E36] hover:underline">
                      #{order.orderNumber || order.id.substring(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {order.user?.profilePicture ? (
                          <img 
                            src={order.user.profilePicture} 
                            alt={order.user.name} 
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <UserIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{order.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getOrderStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          variants={fadeInUp} 
          initial="initial" 
          animate="animate"
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Orders Status</h2>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="text-sm font-medium">{stats.counts.pendingOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Paid</span>
                </div>
                <span className="text-sm font-medium">{stats.counts.paidOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Shipped</span>
                </div>
                <span className="text-sm font-medium">{stats.counts.shippedOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
                <span className="text-sm font-medium">{stats.counts.deliveredOrders}</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <span className="text-sm font-medium">{stats.counts.cancelledOrders}</span>
              </li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp} 
          initial="initial" 
          animate="animate"
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden sm:col-span-2 lg:col-span-1"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/admin/products/new" 
                className="flex flex-col items-center justify-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <ShoppingCartIcon className="w-8 h-8 text-[#660E36] mb-2" />
                <span className="text-sm font-medium">Add Product</span>
              </Link>
              
              <Link 
                to="/admin/orders" 
                className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ShoppingBagIcon className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">View Orders</span>
              </Link>
              
              <Link 
                to="/admin/approved-emails" 
                className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <UserIcon className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
              </Link>
              
              <Link 
                to="/admin/riders" 
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <TruckIcon className="w-8 h-8 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Manage Riders</span>
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp} 
          initial="initial" 
          animate="animate"
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">System Status</h2>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              <li className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Payment Gateway: Operational</span>
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Order Processing: Operational</span>
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Inventory System: Operational</span>
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Shipping API: Operational</span>
              </li>
              <li className="flex items-center">
                <XCircleIcon className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600">Analytics: Degraded Performance</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;