// src/pages/orders/[id].js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getOrderById, cancelOrder } from '../../services/orders';
import { useAuth } from '../../hooks/useAuth';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch order details
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { redirectTo: `/orders/${id}` } });
      return;
    }
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);
        
        if (response.success) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, isAuthenticated, navigate]);
  
  // Handle cancel order
  const handleCancelOrder = async () => {
    try {
      // Show confirmation before cancelling
      if (!window.confirm('Are you sure you want to cancel this order?')) {
        return;
      }
      
      const response = await cancelOrder(id);
      
      if (response.success) {
        setOrder(prevOrder => ({
          ...prevOrder,
          status: 'CANCELLED',
          cancelledAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Status badge component
  // const OrderStatusBadge = ({ status }) => {
  //   const statusConfig = {
  //     pending: { label: 'Pending', variant: 'warning', icon: <ClockIcon className="w-4 h-4 mr-1" /> },
  //     paid: { label: 'Paid', variant: 'primary', icon: <CheckCircleIcon className="w-4 h-4 mr-1" /> },
  //     shipped: { label: 'Shipped', variant: 'info', icon: <TruckIcon className="w-4 h-4 mr-1" /> },
  //     delivered: { label: 'Delivered', variant: 'success', icon: <CheckCircleIcon className="w-4 h-4 mr-1" /> },
  //     undelivered: { label: 'Undelivered', variant: 'danger', icon: <ExclamationCircleIcon className="w-4 h-4 mr-1" /> },
  //     cancelled: { label: 'Cancelled', variant: 'secondary', icon: <XCircleIcon className="w-4 h-4 mr-1" /> }
  //   };
    
  //   const config = statusConfig[status] || statusConfig.PENDING;
    
  //   return (
  //     <Badge variant={config.variant} size="lg" className="flex items-center">
  //       {config.icon}
  //       {config.label}
  //     </Badge>
  //   );
  // };
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
  
  const statusLower = status.toLowerCase();
  const config = statusConfig[statusLower] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant} size="lg" className="flex items-center">
      {config.icon}
      {config.label}
    </Badge>
  );
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
  
  if (error || !order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">
              {error || "The order you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/orders')}
              icon={<ArrowLeftIcon className="w-5 h-5" />}
              iconPosition="left"
            >
              Back to Orders
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders')}
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            iconPosition="left"
          >
            Back to Orders
          </Button>
        </div>
        
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Order #{order.orderNumber || order.id}
                </h1>
                <p className="text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              
              <OrderStatusBadge status={order.status} />
            </div>
            
            {/* Order Timeline */}
            {/* <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                
                <div className="space-y-8">
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-sm font-medium">Order Placed</h3>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${
                      order.status === 'PENDING' ? 'bg-gray-100' : 'bg-green-100'
                    } flex items-center justify-center`}>
                      {order.status === 'PENDING' ? (
                        <ClockIcon className="w-5 h-5 text-gray-600" />
                      ) : (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <h3 className="text-sm font-medium">Payment Processed</h3>
                    <p className="text-xs text-gray-500">
                      {order.status === 'PENDING' ? 'Pending' : formatDate(order.paidAt || order.createdAt)}
                    </p>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${
                      order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-green-100' : 'bg-gray-100'
                    } flex items-center justify-center`}>
                      {order.status === 'SHIPPED' || order.status === 'DELIVERED' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <TruckIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <h3 className="text-sm font-medium">Order Shipped</h3>
                    <p className="text-xs text-gray-500">
                      {order.status === 'SHIPPED' || order.status === 'DELIVERED'
                        ? `${formatDate(order.shippedAt || 'N/A')}`
                        : order.status === 'CANCELLED'
                          ? 'Cancelled'
                          : 'Pending'
                      }
                    </p>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100' : 'bg-gray-100'
                    } flex items-center justify-center`}>
                      {order.status === 'DELIVERED' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <CheckCircleIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <h3 className="text-sm font-medium">Delivered</h3>
                    <p className="text-xs text-gray-500">
                      {order.status === 'DELIVERED'
                        ? formatDate(order.deliveredAt)
                        : order.status === 'CANCELLED'
                          ? 'Cancelled'
                          : 'Pending'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div> */}

             {/* Order Timeline */}
<div className="mb-8">
  <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
  <div className="relative">
    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
    
    <div className="space-y-8">
      <div className="relative pl-10">
        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-sm font-medium">Order Placed</h3>
        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
      </div>
      
      <div className="relative pl-10">
        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${
          order.status === 'pending' ? 'bg-gray-100' : 'bg-green-100'
        } flex items-center justify-center`}>
          {order.status === 'pending' ? (
            <ClockIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          )}
        </div>
        <h3 className="text-sm font-medium">Payment Processed</h3>
        <p className="text-xs text-gray-500">
          {order.status === 'pending' ? 'Pending' : formatDate(order.paidAt || order.createdAt)}
        </p>
      </div>
      
      <div className="relative pl-10">
        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${
          order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'
        } flex items-center justify-center`}>
          {order.status === 'shipped' || order.status === 'delivered' ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          ) : (
            <TruckIcon className="w-5 h-5 text-gray-600" />
          )}
        </div>
        <h3 className="text-sm font-medium">Order Shipped</h3>
        <p className="text-xs text-gray-500">
          {order.status === 'shipped' || order.status === 'delivered'
            ? `${formatDate(order.shippedAt || order.createdAt)}`
            : order.status === 'cancelled'
              ? 'Cancelled'
              : 'Pending'
          }
        </p>
      </div>
      
      <div className="relative pl-10">
        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${
          order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'
        } flex items-center justify-center`}>
          {order.status === 'delivered' ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-gray-600" />
          )}
        </div>
        <h3 className="text-sm font-medium">Delivered</h3>
        <p className="text-xs text-gray-500">
          {order.status === 'delivered'
            ? formatDate(order.deliveredAt)
            : order.status === 'cancelled'
              ? 'Cancelled'
              : 'Pending'
          }
        </p>
      </div>
    </div>
  </div>
</div>


            
            {/* Rider Info (if assigned) */}
            {order.assignedRider && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Delivery Information</h3>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <TruckIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rider: {order.assignedRider.name}</p>
                    <p className="text-xs text-gray-600">Contact: {order.assignedRider.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions */}
            {(order.status === 'PENDING' || order.status === 'PAID') && (
              <div className="mt-4">
                <Button
                  variant="danger"
                  onClick={handleCancelOrder}
                  icon={<XCircleIcon className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="w-5 h-5 text-[#660E36] mr-2" />
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>
              
              <address className="not-italic text-gray-700">
                <p className="mb-1">{order.contactInfo.name}</p>
                <p className="mb-1">{order.shippingAddress.address}</p>
                <p className="mb-1">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <UserIcon className="w-5 h-5 text-[#660E36] mr-2" />
                <h2 className="text-lg font-semibold">Contact Information</h2>
              </div>
              
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{order.contactInfo.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{order.contactInfo.phone}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="w-5 h-5 text-[#660E36] mr-2" />
                <h2 className="text-lg font-semibold">Payment Information</h2>
              </div>
              
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className={`font-medium ${order.status === 'PENDING' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {order.status === 'PENDING' ? 'Pending' : 'Paid'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={item.image || '/assets/images/placeholder.jpg'} 
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {item.color?.name}, {item.size}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">Subtotal</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">Shipping</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      Free
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-[#660E36]">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Need Help Section */}
        <div className="bg-[#660E36] bg-opacity-5 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Need Help With Your Order?</h3>
              <p className="text-gray-600 mb-4 md:mb-0">
                Our customer support team is ready to assist you with any questions or concerns.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="primary">
                Contact Support
              </Button>
              <Button variant="secondary">
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetailPage;