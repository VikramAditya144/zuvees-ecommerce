// src/pages/admin/AdminRiders.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  TruckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

import AdminLayout from '../../components/layouts/AdminLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { getRiders, updateRider, toggleRiderStatus } from '../../services/user';
import { addApprovedEmail } from '../../services/admin';

const AdminRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false); // New stats modal
  const [selectedRider, setSelectedRider] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Fetch riders
  useEffect(() => {
    fetchRiders();
  }, [pagination.page, searchQuery, statusFilter]);
  
  const fetchRiders = async () => {
    try {
      setLoading(true);
      
      const response = await getRiders();
      
      if (response.success) {
        // Apply filtering client-side (you can move this to server-side later)
        let filteredRiders = response.data;
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredRiders = filteredRiders.filter(rider => 
            rider.name.toLowerCase().includes(query) || 
            rider.email.toLowerCase().includes(query) ||
            (rider.phone && rider.phone.includes(query))
          );
        }
        
        if (statusFilter) {
          filteredRiders = filteredRiders.filter(rider => 
            String(rider.isActive) === statusFilter
          );
        }
        
        // Simple pagination
        const startIndex = (pagination.page - 1) * 10;
        const paginatedRiders = filteredRiders.slice(startIndex, startIndex + 10);
        
        setRiders(paginatedRiders);
        setPagination({
          page: pagination.page,
          totalPages: Math.ceil(filteredRiders.length / 10),
          totalItems: filteredRiders.length
        });
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };
  
  // Handle invite submission
  const handleInvite = async () => {
    if (!inviteEmail) return;
    
    try {
      setModalLoading(true);
      
      const response = await addApprovedEmail(inviteEmail, 'rider');
      
      if (response.success) {
        setInviteEmail('');
        setShowInviteModal(false);
        // Show success notification or toast here
      }
    } catch (error) {
      console.error('Error inviting rider:', error);
      alert('Failed to invite rider. The email might already be approved.');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Open edit modal
  const openEditModal = (rider) => {
    setSelectedRider(rider);
    setEditFormData({
      name: rider.name || '',
      email: rider.email || '',
      phone: rider.phone || ''
    });
    setShowEditModal(true);
  };
  
  // Open stats modal
  const openStatsModal = (rider) => {
    setSelectedRider(rider);
    setShowStatsModal(true);
  };
  
  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle edit submission
  const handleEdit = async () => {
    if (!selectedRider) return;
    
    try {
      setModalLoading(true);
      
      const response = await updateRider(selectedRider._id, editFormData);
      
      if (response.success) {
        // Update rider in the list
        setRiders(prevRiders => 
          prevRiders.map(rider => 
            rider._id === selectedRider._id
              ? { ...rider, ...editFormData }
              : rider
          )
        );
        
        setShowEditModal(false);
        // Show success notification or toast here
      }
    } catch (error) {
      console.error('Error updating rider:', error);
      alert('Failed to update rider details. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Open status change modal
  const openStatusModal = (rider) => {
    setSelectedRider(rider);
    setShowStatusModal(true);
  };
  
  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedRider) return;
    
    const newStatus = !selectedRider.isActive;
    
    try {
      setModalLoading(true);
      
      const response = await toggleRiderStatus(selectedRider._id, newStatus);
      
      if (response.success) {
        // Update rider in the list
        setRiders(prevRiders => 
          prevRiders.map(rider => 
            rider._id === selectedRider._id
              ? { ...rider, isActive: newStatus }
              : rider
          )
        );
        
        setShowStatusModal(false);
        // Show success notification or toast here
      }
    } catch (error) {
      console.error('Error updating rider status:', error);
      alert('Failed to update rider status. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Riders Management</h1>
        <p className="text-gray-600">Manage delivery personnel</p>
      </div>
      
      {/* Actions and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              onClick={() => setShowInviteModal(true)}
              className="whitespace-nowrap"
            >
              Invite Rider
            </Button>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
                onKeyDown={e => e.key === 'Enter' && fetchRiders()}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <Button
            variant="secondary"
            onClick={fetchRiders}
            icon={<ArrowPathIcon className="w-5 h-5" />}
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Riders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="lg" />
          </div>
        ) : riders.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Riders Found</h3>
            <p className="text-gray-500 mb-4">Try changing your search criteria or invite new riders.</p>
            <Button
              variant="primary"
              onClick={() => setShowInviteModal(true)}
            >
              Invite Rider
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rider
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {riders.map((rider) => (
                  <tr key={rider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {rider.profilePicture ? (
                            <img 
                              src={rider.profilePicture} 
                              alt={rider.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                          <div className="text-xs text-gray-500">ID: {rider._id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-900">
                          <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {rider.email}
                        </div>
                        {rider.phone && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                            {rider.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      {rider.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(rider.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{rider.stats?.deliveredOrders || 0}</span> delivered
                        </div>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-blue-600"
                          onClick={() => openStatsModal(rider)}
                          icon={<ChartBarIcon className="w-4 h-4" />}
                        >
                          Stats
                        </Button>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(rider)}
                          icon={<PencilIcon className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        
                        <Button
                          variant={rider.isActive ? "danger" : "success"}
                          size="sm"
                          onClick={() => openStatusModal(rider)}
                        >
                          {rider.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td> */}
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
      
      {/* Invite Rider Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New Rider"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
              placeholder="rider@example.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              An invitation email will be sent to this address. The rider will need to complete registration.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowInviteModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleInvite}
              disabled={modalLoading || !inviteEmail}
              icon={modalLoading ? <Loader size="sm" /> : null}
            >
              {modalLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Rider Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Rider Details"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleEditFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={editFormData.phone}
              onChange={handleEditFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowEditModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleEdit}
              disabled={modalLoading}
              icon={modalLoading ? <Loader size="sm" /> : null}
            >
              {modalLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={selectedRider?.isActive ? "Deactivate Rider" : "Activate Rider"}
      >
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-start">
              {selectedRider?.isActive ? (
                <XCircleIcon className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" />
              ) : (
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
              )}
              <p className="text-gray-700">
                {selectedRider?.isActive 
                  ? `Are you sure you want to deactivate ${selectedRider?.name}? They will no longer be able to access the system or receive delivery assignments.`
                  : `Are you sure you want to activate ${selectedRider?.name}? They will be able to log in and receive delivery assignments.`
                }
              </p>
            </div>
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
              variant={selectedRider?.isActive ? "danger" : "success"}
              onClick={handleStatusChange}
              disabled={modalLoading}
              icon={modalLoading ? <Loader size="sm" /> : null}
            >
              {modalLoading ? 'Processing...' : (selectedRider?.isActive ? 'Deactivate' : 'Activate')}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Rider Stats Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="Rider Performance Statistics"
      >
        <div className="p-4">
          {selectedRider && (
            <>
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  {selectedRider.profilePicture ? (
                    <img 
                      src={selectedRider.profilePicture} 
                      alt={selectedRider.name} 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedRider.name}</h3>
                  <p className="text-sm text-gray-500">Rider since {formatDate(selectedRider.createdAt)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Total Deliveries</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedRider.stats?.totalAssigned || 0}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Completed</div>
                  <div className="text-2xl font-bold text-green-600">{selectedRider.stats?.deliveredOrders || 0}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">In Progress</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedRider.stats?.ongoingOrders || 0}</div>
                </div>
              </div>
              
              {/* Performance metrics */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Performance</h4>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {selectedRider.stats?.deliveryPerformance || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${selectedRider.stats?.deliveryPerformance || 0}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Activity information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Activity Information</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      Last Active
                    </div>
                    <div className="text-sm font-medium">
                      {selectedRider.stats?.lastActive ? formatDateTime(selectedRider.stats.lastActive) : 'Never'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <TruckIcon className="h-4 w-4 mr-2 text-gray-400" />
                      Current Deliveries
                    </div>
                    <div className="text-sm font-medium">
                      {selectedRider.stats?.ongoingOrders || 0}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                      Account Status
                    </div>
                    <Badge variant={selectedRider.isActive ? "success" : "danger"}>
                      {selectedRider.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="mt-6 flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowStatsModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminRiders;