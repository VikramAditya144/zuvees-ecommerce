// src/components/rider/OrderStatusUpdate.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

const OrderStatusUpdate = ({ 
  currentStatus, 
  onUpdateStatus, 
  loading = false,
  className = ''
}) => {
  const [showOptions, setShowOptions] = useState(false);
  
  // Only show update option for SHIPPED orders
  if (currentStatus !== 'shipped') {
    return null;
  }
  
  const handleUpdate = (status) => {
    onUpdateStatus(status);
    setShowOptions(false);
  };
  
  return (
    <div className={`${className}`}>
      <Button 
        variant="primary" 
        fullWidth
        onClick={() => setShowOptions(true)}
        disabled={loading}
      >
        Update Delivery Status
      </Button>
      
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-50 px-4 py-6"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white rounded-t-xl md:rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Update Order Status</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Mark this order as delivered or undelivered
                </p>
              </div>
              
              <div className="p-4 space-y-3">
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => handleUpdate('delivered')}
                  loading={loading}
                  icon={<CheckIcon className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Mark as Delivered
                </Button>
                
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => handleUpdate('undelivered')}
                  loading={loading}
                  icon={<XMarkIcon className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Mark as Undelivered
                </Button>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => setShowOptions(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderStatusUpdate;