// src/pages/products/index.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronDownIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  ShoppingCartIcon,
  StarIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import AnimatedCard from '../../components/common/AnimatedCard';
import { getProducts } from '../../services/products';
import { useCart } from '../../hooks/useCart';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    q: searchParams.get('q') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Categories (in a real app, these would come from an API)
  const categories = [
    { id: '', name: 'All Categories' },
    { id: '1', name: 'Birthday Gifts' },
    { id: '2', name: 'Anniversary' },
    { id: '3', name: 'Corporate Gifts' },
    { id: '4', name: 'Personalized' }
  ];
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build params for API call
        const params = {
          page: searchParams.get('page') || 1,
          limit: 12,
          ...filters
        };
        
        // Remove empty values
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null) {
            delete params[key];
          }
        });
        
        const response = await getProducts(params);
        
        setProducts(response.data);
        setPagination({
          page: parseInt(params.page),
          totalPages: response.meta.pages,
          totalItems: response.meta.total
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchParams]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Apply filters
  const applyFilters = () => {
    const newParams = new URLSearchParams();
    
    // Only add non-empty values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.append(key, value);
      }
    });
    
    // Reset to page 1 when filtering
    newParams.set('page', '1');
    
    setSearchParams(newParams);
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      q: ''
    });
    
    setSearchParams({ page: '1' });
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle add to cart
  const handleAddToCart = (product) => {
    // Use the first variant as default
    const defaultVariant = product.variants[0];
    addToCart(product, defaultVariant, 1);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover our collection of thoughtfully curated gifts for every occasion.
          </p>
        </div>
        
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center mb-4 md:mb-0">
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => setShowFilters(!showFilters)}
                icon={<FunnelIcon className="w-5 h-5" />}
                iconPosition="left"
              >
                Filters
              </Button>
              
              <span className="text-gray-500 text-sm">
                {pagination.totalItems} products found
              </span>
            </div>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.q}
                onChange={e => handleFilterChange({ target: { name: 'q', value: e.target.value } })}
                onKeyPress={e => e.key === 'Enter' && applyFilters()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 p-4 rounded-md mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    min="0"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    min="0"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button
                    onClick={applyFilters}
                    variant="primary"
                    className="flex-grow"
                  >
                    Apply Filters
                  </Button>
                  
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try changing your filters or search terms.</p>
            <Button
              onClick={clearFilters}
              variant="secondary"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            {products.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </motion.div>
        )}
        
        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                variant="ghost"
                className="px-2"
              >
                Previous
              </Button>
              
              {[...Array(pagination.totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                
                // Show current page, first page, last page, and pages around current
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
      </div>
    </MainLayout>
  );
};

// ProductCard Component
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <motion.div variants={fadeInUp} className="h-full">
      <AnimatedCard className="h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            <Link to={`/products/${product.id}`}>
              {product.name}
              
            </Link>
          </h3>
          <p className="text-gray-500 text-sm mb-2">{product.category}</p>
          
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon 
                key={i} 
                className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
          </div>
          
          <div className="mt-auto flex justify-between items-center">
            <span className="text-[#660E36] font-bold">
              ${product.variants[0].price.toFixed(2)}
            </span>
            <Button
              variant="ghost"
              className="text-sm hover:bg-[#660E36] hover:text-white"
              icon={<ShoppingCartIcon className="w-4 h-4" />}
              iconPosition="right"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart();
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </AnimatedCard>
    </motion.div>
  );
};

export default ProductsPage;