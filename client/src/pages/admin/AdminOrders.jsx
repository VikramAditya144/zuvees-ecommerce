// src/pages/admin/orders.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon,
  TruckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

import AdminLayout from '../../components/layouts/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { getAllOrders, updateOrderStatus, assignRiderToOrder } from '../../services/admin';
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
  
  const config = statusConfig[status] || statusConfig.PENDING;
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    q: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRider, setSelectedRider] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  
  // Fetch orders
  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, [pagination.page, filters]);
  
  // Fetch orders with pagination and filters
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = {
        page: pagination.page,
        limit: 10,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await getAllOrders(params);
      
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
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Apply filters
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      q: ''
    });
    setShowFilters(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };
  
  // Open update status modal
  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setShowUpdateModal(true);
  };
  
  // Open assign rider modal
  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setSelectedRider(order.assignedRider?._id || '');
    setShowAssignModal(true);
  };
  
  // Update order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !selectedStatus) return;
    
    try {
      setModalLoading(true);

      console.log('Selected Order: ', selectedOrder.id);
      console.log('Selected Status: ', selectedStatus);
      
      const response = await updateOrderStatus(selectedOrder.id, selectedStatus);
      
      if (response.success) {
        // Update order in the list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === selectedOrder.id
              ? { ...order, status: selectedStatus }
              : order
          )
        );
        
        setShowUpdateModal(false);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Assign rider to order
  const handleAssignRider = async () => {
    if (!selectedOrder || !selectedRider) return;
    
    try {
      setModalLoading(true);
      
      const response = await assignRiderToOrder(selectedOrder._id, selectedRider);
      
      if (response.success) {
        // Update order in the list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === selectedOrder._id
              ? { 
                  ...order, 
                  assignedRider: riders.find(rider => rider._id === selectedRider),
                  status: 'SHIPPED'
                }
              : order
          )
        );
        
        setShowAssignModal(false);
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
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Orders Management</h1>
        <p className="text-gray-600">View and manage all customer orders</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="mr-2"
              icon={<FunnelIcon className="w-5 h-5" />}
              iconPosition="left"
            >
              Filters
            </Button>
            
            <span className="text-sm text-gray-500">
              {pagination.totalItems} orders found
            </span>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
                placeholder="Search orders by ID or customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={fetchOrders}
            icon={<ArrowPathIcon className="w-5 h-5" />}
          >
            Refresh
          </Button>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="UNDELIVERED">Undelivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              
              <div className="md:col-span-2 flex items-end gap-4">
                <Button
                  variant="primary"
                  onClick={applyFilters}
                  className="flex-grow md:flex-grow-0"
                >
                  Apply Filters
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-4">Try changing your search criteria or clear filters.</p>
            <Button
              variant="secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
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
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/admin/orders/${order.id}`} 
                        className="text-[#660E36] hover:underline font-medium"
                      >
                        ##{order.orderNumber || order.id.substring(0, 8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {order.user?.profilePicture ? (
                            <img 
                              src={order.user.profilePicture} 
                              alt={order.user.name} 
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{order.user?.name || order.contactInfo?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{order.user?.email || order.contactInfo?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderItems.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUpdateModal(order)}
                        >
                          Update
                        </Button>
                        
                        {order.status === 'PAID' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openAssignModal(order)}
                          >
                            Assign Rider
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              variant="ghost"
              className="px-2"
            >
              Previous
            </Button>
            
            {Array.from({ length: pagination.totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              // Show current page, first page, last page, and one page before and after current
              if (
                pageNumber === 1 ||
                pageNumber === pagination.totalPages ||
                (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    variant={pagination.page === pageNumber ? 'primary' : 'ghost'}
                    className="w-10 h-10 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                (pageNumber === 2 && pagination.page > 3) ||
                (pageNumber === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2)
              ) {
                return <span key={pageNumber}>...</span>;
              }
              
              return null;
            })}
            
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              variant="ghost"
              className="px-2"
            >
              Next
            </Button>
          </nav>
        </div>
      )}
      
      {/* Update Status Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Order Status"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <div className="text-sm text-gray-900 font-medium">
              #{selectedOrder?.orderNumber || selectedOrder?.id.substring(0, 8)}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <div>
              <OrderStatusBadge status={selectedOrder?.status} />
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
              onClick={() => setShowUpdateModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              disabled={modalLoading || selectedStatus === selectedOrder?.status}
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
              #{selectedOrder?.orderNumber || selectedOrder?.id.substring(0, 8)}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <div className="text-sm text-gray-900">
              {selectedOrder?.user?.name || selectedOrder?.contactInfo?.name || 'N/A'}
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

export default AdminOrders;