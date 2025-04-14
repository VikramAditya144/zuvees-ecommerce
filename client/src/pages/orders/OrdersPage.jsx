// src/pages/orders/index.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRightIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { getMyOrders, cancelOrder } from '../../services/orders';
import { useAuth } from '../../hooks/useAuth';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // Fetch orders
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { redirectTo: '/orders' } });
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders({ page: 1, limit: 10 });
        
        if (response.success) {
          setOrders(response.data);
          setPagination({
            page: response.meta.page,
            totalPages: response.meta.pages,
            totalItems: response.meta.total
          });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated, navigate]);
  
  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      // Show confirmation before cancelling
      if (!window.confirm('Are you sure you want to cancel this order?')) {
        return;
      }
      
      const response = await cancelOrder(orderId);
      
      if (response.success) {
        // Update order in the list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: 'CANCELLED', cancelledAt: new Date().toISOString() }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };
  
  // Status badge component
  const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'warning', icon: <ClockIcon className="w-4 h-4 mr-1" /> },
      paid: { label: 'Paid', variant: 'primary', icon: <CheckCircleIcon className="w-4 h-4 mr-1" /> },
      shipped: { label: 'Shipped', variant: 'info', icon: <TruckIcon className="w-4 h-4 mr-1" /> },
      delivered: { label: 'Delivered', variant: 'success', icon: <CheckCircleIcon className="w-4 h-4 mr-1" /> },
      undelivered: { label: 'Undelivered', variant: 'danger', icon: <ExclamationCircleIcon className="w-4 h-4 mr-1" /> },
      cancelled: { label: 'Cancelled', variant: 'secondary', icon: <XCircleIcon className="w-4 h-4 mr-1" /> }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <Badge variant={config.variant} className="flex items-center">
        {config.icon}
        {config.label}
      </Badge>
    );
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (loading) {
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
  
  if (orders.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to explore our collection of amazing gifts.
            </p>
            
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">
            View and manage your order history.
          </p>
        </div>
        
        {/* Orders List */}
        <div className="space-y-6 mb-10">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Order #{order.orderNumber || order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  <OrderStatusBadge status={order.status} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Total</h4>
                    <p className="font-medium">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Items</h4>
                    <p className="font-medium">{order.orderItems.length} items</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Shipping Address</h4>
                    <p className="text-sm truncate">
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                  <Link to={`/orders/${order.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<ChevronRightIcon className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      View Order Details
                    </Button>
                  </Link>
                  
                  {(order.status === 'PENDING' || order.status === 'PAID') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase">Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="relative w-10 h-10 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    
                    {order.orderItems.length > 3 && (
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs font-medium text-gray-600">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <Button
                onClick={() => {/* Handle previous page */}}
                disabled={pagination.page === 1}
                variant="ghost"
                className="px-2"
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              {[...Array(pagination.totalPages)].map((_, index) => (
                <Button
                  key={index}
                  onClick={() => {/* Handle page change */}}
                  variant={pagination.page === index + 1 ? 'primary' : 'ghost'}
                  className="w-10 h-10 p-0"
                >
                  {index + 1}
                </Button>
              ))}
              
              <Button
                onClick={() => {/* Handle next page */}}
                disabled={pagination.page === pagination.totalPages}
                variant="ghost"
                className="px-2"
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrdersPage;