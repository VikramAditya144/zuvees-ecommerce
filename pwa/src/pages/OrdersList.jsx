// src/pages/OrdersList.jsx
import React, { useEffect, useState } from 'react';
import PullToRefresh from 'react-pull-to-refresh';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import RiderLayout from '../components/layouts/RiderLayout';
import OrderCard from '../components/rider/OrderCard';
import FilterTabs from '../components/rider/FilterTabs';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useRiderOrders } from '../hooks/useRiderOrders';

const OrdersList = () => {
  const { 
    orders, 
    filteredOrders,
    loading, 
    pagination, 
    filter,
    fetchAssignedOrders,
    setFilterStatus
  } = useRiderOrders();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  
  // Fetch orders on component mount
  useEffect(() => {
    fetchAssignedOrders();
  }, [fetchAssignedOrders]);
  
  // Filter orders based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDisplayedOrders(filteredOrders);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = filteredOrders.filter(order => 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(query)) ||
      (order._id && order._id.toLowerCase().includes(query)) ||
      (order.user?.name && order.user.name.toLowerCase().includes(query)) ||
      (order.contactInfo?.name && order.contactInfo.name.toLowerCase().includes(query)) ||
      (order.shippingAddress?.address && order.shippingAddress.address.toLowerCase().includes(query))
    );
    
    setDisplayedOrders(filtered);
  }, [filteredOrders, searchQuery]);
  
  const handleRefresh = async () => {
    return fetchAssignedOrders({
      status: filter.status
    });
  };
  
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchAssignedOrders({ status });
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };
  
  return (
    <RiderLayout title="Orders">
      <div className="container mx-auto px-4 py-4">
        {/* Search and Filters */}
        <div className="mb-4 sticky top-16 z-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md focus:outline-none"
              aria-label={showSearch ? 'Close search' : 'Search orders'}
            >
              {showSearch ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <FilterTabs
            activeFilter={filter.status}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Orders List */}
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="mb-20">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : displayedOrders.length === 0 ? (
              <EmptyState
                title="No orders found"
                message={searchQuery ? "No orders match your search criteria." : "You don't have any orders in this category yet."}
                icon={<ShoppingBagIcon className="w-12 h-12" />}
                actionButton={
                  searchQuery ? (
                    <Button
                      variant="secondary"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  ) : null
                }
              />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {displayedOrders.map(order => (
                  <motion.div
                    key={order.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <OrderCard order={order} />
                  </motion.div>
                ))}
                
                {pagination.page < pagination.totalPages && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => fetchAssignedOrders({
                        page: pagination.page + 1,
                        status: filter.status
                      })}
                      loading={loading}
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </PullToRefresh>
      </div>
    </RiderLayout>
  );
};

export default OrdersList;