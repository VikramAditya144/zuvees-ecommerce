// src/pages/admin/AdminApprovedEmails.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserIcon,
  TrashIcon,
  PlusIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

import AdminLayout from '../../components/layouts/AdminLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { getApprovedEmails, addApprovedEmail, removeApprovedEmail } from '../../services/admin';

const RoleBadge = ({ role }) => {
  const roleConfig = {
    customer: { label: 'Customer', variant: 'primary', icon: <UserIcon className="w-3 h-3 mr-1" /> },
    admin: { label: 'Admin', variant: 'danger', icon: <ShieldCheckIcon className="w-3 h-3 mr-1" /> },
    rider: { label: 'Rider', variant: 'success', icon: <TruckIcon className="w-3 h-3 mr-1" /> }
  };
  
  const config = roleConfig[role] || roleConfig.customer;
  
  return (
    <Badge variant={config.variant} size="sm" className="flex items-center">
      {config.icon}
      {config.label}
    </Badge>
  );
};

const AdminApprovedEmails = () => {
  const [approvedEmails, setApprovedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Add email modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    role: 'customer'
  });
  const [modalLoading, setModalLoading] = useState(false);
  
  // Fetch approved emails
  useEffect(() => {
    fetchApprovedEmails();
  }, [pagination.page, searchQuery, roleFilter]);
  
  const fetchApprovedEmails = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = {
        page: pagination.page,
        limit: 10,
        q: searchQuery || undefined,
        role: roleFilter || undefined
      };
      
      const response = await getApprovedEmails(params);
      
      if (response.success) {
        setApprovedEmails(response.data);
        setPagination({
          page: response.meta.page,
          totalPages: response.meta.pages,
          totalItems: response.meta.total
        });
      }
    } catch (error) {
      console.error('Error fetching approved emails:', error);
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
  
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle add email
  const handleAddEmail = async () => {
    try {
      setModalLoading(true);
      
      const response = await addApprovedEmail(formData.email, formData.role);
      
      if (response.success) {
        // Add the new email to the list if we're on the first page and no filters
        if (pagination.page === 1 && !roleFilter && !searchQuery) {
          setApprovedEmails(prev => [response.data, ...prev]);
        } else {
          // Otherwise refresh the list
          fetchApprovedEmails();
        }
        
        // Reset form
        setFormData({
          email: '',
          role: 'customer'
        });
        
        setShowAddModal(false);
        // Show success notification or toast here
      }
    } catch (error) {
      console.error('Error adding approved email:', error);
      alert('Failed to add approved email. The email might already be approved.');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Open delete modal
  const openDeleteModal = (email) => {
    setSelectedEmail(email);
    setShowDeleteModal(true);
  };
  
  // Handle delete email
  const handleDeleteEmail = async () => {
    if (!selectedEmail) return;
    
    try {
      setModalLoading(true);
      
      const response = await removeApprovedEmail(selectedEmail._id);
      
      if (response.success) {
        // Remove the email from the list
        setApprovedEmails(prev => 
          prev.filter(email => email._id !== selectedEmail._id)
        );
        
        setShowDeleteModal(false);
        // Show success notification or toast here
      }
    } catch (error) {
      console.error('Error removing approved email:', error);
      alert('Failed to remove approved email. Please try again.');
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
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Approved Emails</h1>
        <p className="text-gray-600">Manage pre-approved email addresses that can register for accounts</p>
      </div>
      
      {/* Actions and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              icon={<PlusIcon className="w-5 h-5" />}
              iconPosition="left"
              className="whitespace-nowrap"
            >
              Add Approved Email
            </Button>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
            >
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="rider">Rider</option>
            </select>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
                onKeyDown={e => e.key === 'Enter' && fetchApprovedEmails()}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <Button
            variant="secondary"
            onClick={fetchApprovedEmails}
            icon={<ArrowPathIcon className="w-5 h-5" />}
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Approved Emails Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="lg" />
          </div>
        ) : approvedEmails.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Approved Emails Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || roleFilter 
                ? 'Try changing your search criteria or filters.' 
                : 'Start by adding pre-approved email addresses.'}
            </p>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              icon={<PlusIcon className="w-5 h-5" />}
              iconPosition="left"
            >
              Add Approved Email
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedEmails.map((email) => (
                  <tr key={email._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{email.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={email.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                          <UserIcon className="h-3 w-3 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-900">{email.addedBy?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(email.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {email.isRegistered ? (
                        <Badge variant="success" size="sm">Registered</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Pending</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(email)}
                        icon={<TrashIcon className="w-4 h-4" />}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
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
      
      {/* Add Approved Email Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Approved Email"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
              placeholder="example@example.com"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="rider">Rider</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              This determines what privileges the user will have after registration.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowAddModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleAddEmail}
              disabled={modalLoading || !formData.email}
              icon={modalLoading ? <Loader size="sm" /> : null}
            >
              {modalLoading ? 'Adding...' : 'Add Email'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Approved Email Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Approved Email"
      >
        <div className="p-4">
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Are you sure you want to remove this approved email?
            </p>
            {selectedEmail && (
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex items-center mb-1">
                  <EnvelopeIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium">{selectedEmail.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <RoleBadge role={selectedEmail.role} />
                  <span className="ml-2">• Added {formatDate(selectedEmail.createdAt)}</span>
                </div>
              </div>
            )}
            <p className="mt-3 text-sm text-red-600">
              {selectedEmail?.isRegistered 
                ? 'Warning: This email is already registered. Removing it will not affect existing users.'
                : 'This email will no longer be able to register for an account.'}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="danger"
              onClick={handleDeleteEmail}
              disabled={modalLoading}
              icon={modalLoading ? <Loader size="sm" /> : null}
            >
              {modalLoading ? 'Removing...' : 'Remove Email'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminApprovedEmails;