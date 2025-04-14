// src/pages/OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

import RiderLayout from '../components/layouts/RiderLayout';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import StatusBadge from '../components/common/StatusBadge';
import OrderStatusUpdate from '../components/rider/OrderStatusUpdate';
import OrderItemsList from '../components/rider/OrderItemsList';
import CustomerInfo from '../components/rider/CustomerInfo';
import DeliveryTimelineItem from '../components/rider/DeliveryTimelineItem';
import Notification from '../components/common/Notification';
import { useRiderOrders } from '../hooks/useRiderOrders';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    selectedOrder, 
    loading, 
    loadingAction,
    error,
    fetchOrderDetails,
    changeOrderStatus,
    clearSelectedOrder
  } = useRiderOrders();
  
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    isVisible: false,
  });
  
  // Fetch order details
  useEffect(() => {
    fetchOrderDetails(id);
    
    // Clear selected order on unmount
    return () => clearSelectedOrder();
  }, [id, fetchOrderDetails, clearSelectedOrder]);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
  };
  
  // Handle status update
  const handleUpdateStatus = async (status) => {
    try {
      const success = await changeOrderStatus(id, status);
      
      if (success) {
        showNotification('success', `Order marked as ${status.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('error', error.message || 'Failed to update order status');
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
  
  // Generate Google Maps URL
  const getGoogleMapsUrl = (address) => {
    if (!address) return '';
    
    const formattedAddress = encodeURIComponent(
      `${address.address}, ${address.city}, ${address.state} ${address.zipCode}`
    );
    
    return `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
  };
  
  if (loading) {
    return (
      <RiderLayout title="Order Details">
        <div className="flex justify-center items-center p-8">
          <Loader size="lg" />
        </div>
      </RiderLayout>
    );
  }
  
  if (error || !selectedOrder) {
    return (
      <RiderLayout title="Order Details">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              The order you're looking for doesn't exist or you don't have access to view it.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/orders')}
            >
              Back to Orders
            </Button>
          </div>
        </div>
      </RiderLayout>
    );
  }
  
  return (
    <RiderLayout title="Order Details">
      <div className="container mx-auto px-4 py-4 mb-20">
        {/* Back button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/orders')}
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            iconPosition="left"
          >
            Back to Orders
          </Button>
        </div>
        
        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4 mb-4"
        >
          <div className="flex flex-wrap justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-gray-800">
              Order #{selectedOrder.orderNumber || selectedOrder.id.substring(0, 8)}
            </h1>
            <StatusBadge status={selectedOrder.status} />
          </div>
          
          <p className="text-sm text-gray-500 mb-2">
            Placed on {formatDate(selectedOrder.createdAt)}
          </p>
          
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm mt-4">
            <div>
              <span className="text-gray-500">Items:</span>{' '}
              <span className="font-medium">{selectedOrder.orderItems?.length || 0}</span>
            </div>
            
            <div>
              <span className="text-gray-500">Total:</span>{' '}
              <span className="font-medium">${selectedOrder.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Order Status Update Action */}
        {selectedOrder.status === 'shipped' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <h2 className="text-lg font-medium text-gray-800 mb-2">Update Order Status</h2>
            <OrderStatusUpdate 
              currentStatus={selectedOrder.status}
              onUpdateStatus={handleUpdateStatus}
              loading={loadingAction}
            />
          </motion.div>
        )}
        
        {/* Address and Directions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
        >
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Delivery Address</h2>
          </div>
          
          <div className="p-4">
            <div className="flex items-start mb-4">
              <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-800">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-gray-600">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                </p>
              </div>
            </div>
            
            <a
              href={getGoogleMapsUrl(selectedOrder.shippingAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full flex justify-center items-center"
            >
              Get Directions
            </a>
          </div>
        </motion.div>
        
        {/* Customer Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <CustomerInfo 
            customer={selectedOrder.user || selectedOrder.contactInfo} 
            address={selectedOrder.shippingAddress}
          />
        </motion.div>
        
        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
        >
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Order Items</h2>
          </div>
          
          <div className="p-4">
            <OrderItemsList items={selectedOrder.orderItems} />
          </div>
        </motion.div>
        
        {/* Delivery Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-800">Delivery Timeline</h2>
          </div>
          
          <div className="p-4">
            <div className="ml-2">
              <DeliveryTimelineItem
                title="Order Placed"
                time={selectedOrder.createdAt}
                isCompleted={true}
              />
              
              <DeliveryTimelineItem
                title="Payment Confirmed"
                time={selectedOrder.paidAt || selectedOrder.createdAt}
                isCompleted={['paid', 'shipped', 'delivered', 'undelivered'].includes(selectedOrder.status)}
              />
              
              <DeliveryTimelineItem
                title="Out for Delivery"
                description="Order assigned to rider"
                time={selectedOrder.updatedAt}
                isCompleted={['shipped', 'delivered', 'undelivered'].includes(selectedOrder.status)}
                isActive={selectedOrder.status === 'shipped'}
              />
              
              <DeliveryTimelineItem
                title={
                  selectedOrder.status === 'delivered' 
                    ? 'delivered' 
                    : selectedOrder.status === 'undelivered'
                      ? 'delivered'
                      : 'delivered'
                }
                description={
                  selectedOrder.status === 'undelivered' 
                    ? 'Delivery attempt unsuccessful'
                    : null
                }
                time={selectedOrder.deliveredAt}
                isCompleted={['delivered', 'undelivered'].includes(selectedOrder.status)}
              />
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

export default OrderDetail;