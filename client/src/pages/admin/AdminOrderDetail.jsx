// src/pages/admin/AdminOrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  TruckIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import AdminLayout from '../../components/layouts/AdminLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { getOrderById, updateOrderStatus, assignRiderToOrder } from '../../services/admin';
import { getRiders } from '../../services/user';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'warning' },
    paid: { label: 'Paid', variant: 'primary' },
    shipped: { label: 'Shipped', variant: 'info' },
    delivered: { label: 'Delivered', variant: 'success' },
    undelivered: { label: 'Undelivered', variant: 'danger' },
    cancelled: { label: 'Cancelled', variant: 'secondary' }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRider, setSelectedRider] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  
  // Fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getOrderById(id);
        
        if (response.success) {
          setOrder(response.data);
          setSelectedStatus(response.data.status);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderData();
    fetchRiders();
  }, [id]);
  
  // Fetch riders for assignment
  const fetchRiders = async () => {
    try {
      const response = await getRiders();
      
      if (response.success) {
        setRiders(response.data);
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };
  
  // Handle status update
  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === order.status) return;
    
    try {
      setModalLoading(true);
      
      const response = await updateOrderStatus(order.id, selectedStatus);
      
      if (response.success) {
        setOrder(response.data);
        setShowStatusModal(false);
        // Show success notification or toast here
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Handle rider assignment
  const handleAssignRider = async () => {
    if (!selectedRider) return;
    
    try {
      setModalLoading(true);
      
      const response = await assignRiderToOrder(order.id, selectedRider);
      
      if (response.success) {
        setOrder(response.data);
        setShowAssignModal(false);
        // Show success notification or toast here
      }
    } catch (error) {
      console.error('Error assigning rider:', error);
      alert('Failed to assign rider. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
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
  
  if (error || !order) {
    return (
      <AdminLayout>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error || 'Failed to load order details'}</p>
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/orders')}
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            iconPosition="left"
          >
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/orders')}
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            iconPosition="left"
            className="mr-4"
          >
            Back to Orders
          </Button>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber || order.id.substring(0, 8)}</h1>
        </div>
        
        <div className="flex space-x-3">
          {order.status === 'paid' && (
            <Button
              variant="primary"
              onClick={() => setShowAssignModal(true)}
              icon={<TruckIcon className="w-5 h-5" />}
              iconPosition="left"
            >
              Assign Rider
            </Button>
          )}
          
          <Button
            variant="secondary"
            onClick={() => setShowStatusModal(true)}
          >
            Update Status
          </Button>
        </div>
      </div>
      
      {/* Order Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mb-2">Order Status</h2>
            <div className="flex items-center">
              <OrderStatusBadge status={order.status} />
              <span className="ml-3 text-gray-500">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className="text-sm text-gray-500 mb-1">
              Order Total
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${order.totalPrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              {order.orderItems.length} items
            </div>
          </div>
        </div>
        
        {/* Timeline (optional) */}
        {order.status !== 'pending' && order.status !== 'cancelled' && (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-between">
                <div className={`flex flex-col items-center ${order.status !== 'pending' ? 'text-[#660E36]' : 'text-gray-400'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${order.status !== 'pending' ? 'bg-[#660E36] text-white' : 'border-2 border-gray-300 bg-white'}`}>
                    {order.status !== 'pending' ? <CheckIcon className="h-5 w-5" /> : 1}
                  </div>
                  <div className="mt-2 text-sm font-medium">Paid</div>
                </div>
                
                <div className={`flex flex-col items-center ${order.status === 'shipped' || order.status === 'delivered' || order.status === 'undelivered' ? 'text-[#660E36]' : 'text-gray-400'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${order.status === 'shipped' || order.status === 'delivered' || order.status === 'undelivered' ? 'bg-[#660E36] text-white' : 'border-2 border-gray-300 bg-white'}`}>
                    {order.status === 'shipped' || order.status === 'delivered' || order.status === 'undelivered' ? <CheckIcon className="h-5 w-5" /> : 2}
                  </div>
                  <div className="mt-2 text-sm font-medium">Shipped</div>
                </div>
                
                <div className={`flex flex-col items-center ${order.status === 'delivered' || order.status === 'undelivered' ? 'text-[#660E36]' : 'text-gray-400'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${order.status === 'delivered' ? 'bg-green-500 text-white' : order.status === 'undelivered' ? 'bg-red-500 text-white' : 'border-2 border-gray-300 bg-white'}`}>
                    {order.status === 'delivered' ? <CheckIcon className="h-5 w-5" /> : order.status === 'undelivered' ? <XMarkIcon className="h-5 w-5" /> : 3}
                  </div>
                  <div className="mt-2 text-sm font-medium">Delivered</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
          
          <div className="mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                {order.user?.profilePicture ? (
                  <img 
                    src={order.user.profilePicture} 
                    alt={order.user.name} 
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {order.user?.name || order.contactInfo?.name || 'N/A'}
                </h3>
                
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  {order.user?.email || order.contactInfo?.email || 'N/A'}
                </div>
                
                {(order.user?.phone || order.contactInfo?.phone) && (
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {order.user?.phone || order.contactInfo?.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-500">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>
            </div>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Payment Method</span>
              <span className="text-sm font-medium text-gray-900">
                {order.paymentMethod || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Payment Status</span>
              <Badge variant={order.isPaid ? 'success' : 'warning'}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </Badge>
            </div>
            
            {order.isPaid && order.paidAt && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Date</span>
                <span className="text-sm text-gray-900">{formatDate(order.paidAt)}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 my-3 pt-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Items Total</span>
                <span className="text-sm text-gray-900">${order.itemsPrice?.toFixed(2) || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">Shipping Fee</span>
                <span className="text-sm text-gray-900">${order.shippingPrice?.toFixed(2) || 'N/A'}</span>
              </div>
              
              {order.taxPrice > 0 && (
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">Tax</span>
                  <span className="text-sm text-gray-900">${order.taxPrice?.toFixed(2) || 'N/A'}</span>
                </div>
              )}
              
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-medium text-gray-900">${order.totalPrice?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
          
          {order.assignedRider ? (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Assigned Rider</h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {order.assignedRider.profilePicture ? (
                      <img 
                        src={order.assignedRider.profilePicture} 
                        alt={order.assignedRider.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {order.assignedRider.name}
                    </h3>
                    
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {order.assignedRider.email}
                    </div>
                    
                    {order.assignedRider.phone && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {order.assignedRider.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  {order.status === 'shipped' && (
                    <div className="flex items-center text-sm text-blue-600">
                      <TruckIcon className="h-5 w-5 mr-2" />
                      <span>Out for delivery</span>
                    </div>
                  )}
                  
                  {order.status === 'delivered' && order.deliveredAt && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckIcon className="h-5 w-5 mr-2" />
                      <span>Delivered on {formatDate(order.deliveredAt)}</span>
                    </div>
                  )}
                  
                  {order.status === 'undelivered' && (
                    <div className="flex items-center text-sm text-red-600">
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      <span>Delivery failed</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-md">
              <TruckIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-3">No rider assigned yet</p>
              
              {order.status === 'paid' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign Rider
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Order Items */}
      <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Order Items</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {order.orderItems.map((item, index) => (
            <div key={index} className="p-6 flex flex-wrap md:flex-nowrap">
              <div className="w-full md:w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 mb-4 md:mb-0">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingBagIcon className="w-10 h-10 text-gray-400 m-auto" />
                )}
              </div>
              
              <div className="md:ml-6 flex-grow">
                <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                
                <div className="mt-1 flex flex-wrap text-sm text-gray-500">
                  {item.variant && (
                    <div className="mr-4">
                      <span className="font-medium">Variant:</span> {item.variant}
                    </div>
                  )}
                  
                  <div className="mr-4">
                    <span className="font-medium">Quantity:</span> {item.quantity}
                  </div>
                  
                  <div>
                    <span className="font-medium">Price:</span> ${item.price.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex-shrink-0 text-right">
                <div className="text-base font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Order Status"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <div className="text-sm text-gray-900 font-medium">
              #{order.orderNumber || order.id.substring(0, 8)}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="undelivered">Undelivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowStatusModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              disabled={modalLoading || selectedStatus === order.status}
              icon={modalLoading ? <Loader size="sm" /> : null}
            >
              {modalLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Assign Rider Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Rider to Order"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <div className="text-sm text-gray-900 font-medium">
              #{order.orderNumber || order.id.substring(0, 8)}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <div className="text-sm text-gray-900">
              {order.user?.name || order.contactInfo?.name || 'N/A'}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Rider
            </label>
            {riders.length === 0 ? (
              <div className="text-sm text-red-500">No riders available</div>
            ) : (
              <select
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
              >
                <option value="">Select a rider</option>
                {riders.map((rider) => (
                  <option key={rider._id} value={rider._id}>
                    {rider.name} ({rider.phone || rider.email})
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <div className="flex">
              <TruckIcon className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Important Note</p>
                <p>Assigning a rider will automatically change the order status to "Shipped".</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowAssignModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleAssignRider}
              disabled={modalLoading || !selectedRider || riders.length === 0}
              icon={modalLoading ? <Loader size="sm" /> : null}
            >
              {modalLoading ? 'Assigning...' : 'Assign Rider'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrderDetail;