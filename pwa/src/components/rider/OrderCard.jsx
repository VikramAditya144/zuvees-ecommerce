// src/components/rider/OrderCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPinIcon, PhoneIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import StatusBadge from '../common/StatusBadge';

const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <Link to={`/orders/${order.id}`} className="text-[#660E36] font-medium hover:underline">
            Order #{order.orderNumber || order.id.substring(0, 8)}
          </Link>
          <StatusBadge status={order.status} />
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(order.createdAt)}
        </div>
      </div>
      
      <div className="px-4 py-3">
        <h3 className="font-medium mb-2">{order.user?.name || order.contactInfo?.name}</h3>
        
        <div className="flex items-start mb-2">
          <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            </p>
          </div>
        </div>
        
        {(order.user?.phone || order.contactInfo?.phone) && (
          <div className="flex items-center mb-2">
            <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
            <a 
              href={`tel:${order.user?.phone || order.contactInfo?.phone}`} 
              className="text-sm text-[#660E36] hover:underline"
            >
              {order.user?.phone || order.contactInfo?.phone}
            </a>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
          <div className="flex justify-between">
            <div>
              <span className="text-gray-500">Items:</span>{' '}
              <span className="font-medium">{order.orderItems?.length || 0}</span>
            </div>
            
            <div>
              <span className="text-gray-500">Total:</span>{' '}
              <span className="font-medium">${order.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
            
            <Link 
              to={`/orders/${order.id}`} 
              className="text-[#660E36] hover:underline flex items-center"
            >
              View Details
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;