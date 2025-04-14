// src/pages/admin/products.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import AdminLayout from '../../components/layouts/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { getProducts, deleteProduct } from '../../services/products';

const AdminProducts = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, searchQuery]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build params
      const params = {
        page: pagination.page,
        limit: 12
      };
      
      if (searchQuery) {
        params.q = searchQuery;
      }
      
      const response = await getProducts(params);
      
      if (response.success) {
        setProducts(response.data);
        setPagination({
          page: response.meta.page,
          totalPages: response.meta.pages,
          totalItems: response.meta.total
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Open delete modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
    setDeleteSuccess(false);
  };
  
  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      setDeleteLoading(true);
      
      const response = await deleteProduct(productToDelete.id);
      
      if (response.success) {
        // Remove product from list
        setProducts(prevProducts => 
          prevProducts.filter(product => product._id !== productToDelete._id)
        );
        
        setDeleteSuccess(true);
        
        // Close modal after delay
        setTimeout(() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }, 1500);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your product inventory</p>
      </div>
      
      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="primary"
            onClick={() => navigate('/admin/products/new')}
            icon={<PlusIcon className="w-5 h-5" />}
            iconPosition="left"
          >
            Add New Product
          </Button>
          
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button type="submit" className="hidden">Search</button>
              </div>
            </form>
          </div>
          
          <Button
            variant="secondary"
            onClick={fetchProducts}
            icon={<ArrowPathIcon className="w-5 h-5" />}
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ExclamationCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'No products match your search criteria.' 
              : 'You haven\'t added any products yet.'}
          </p>
          
          {searchQuery ? (
            <Button
              variant="secondary"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => navigate('/admin/products/new')}
              icon={<PlusIcon className="w-5 h-5" />}
              iconPosition="left"
            >
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {!product.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <Badge variant="danger" size="lg" className="uppercase">Inactive</Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[#660E36] font-semibold">
                        ${product.variants[0]?.price.toFixed(2) || '0.00'}
                      </span>
                      {product.variants.length > 1 && (
                        <span className="text-gray-500 text-xs ml-1">
                          + {product.variants.length - 1} variants
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Badge variant="primary" size="sm" className="uppercase text-xs">
                        {product.variants.reduce((total, variant) => total + variant.stock, 0)} in stock
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      icon={<PencilIcon className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Edit
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => openDeleteModal(product)}
                      icon={<TrashIcon className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
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
        </>
      )}
      
      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleteLoading && setShowDeleteModal(false)}
        title={deleteSuccess ? "Product Deleted" : "Delete Product"}
        size="sm"
      >
        <div className="p-4">
          {deleteSuccess ? (
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Success!</p>
              <p className="text-gray-600 mb-4">
                The product has been deleted successfully.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete the product{' '}
                    <span className="font-semibold">{productToDelete?.name}</span>?
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="danger"
                  onClick={handleDeleteProduct}
                  disabled={deleteLoading}
                  icon={deleteLoading ? <Loader size="sm" /> : null}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Product'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProducts;