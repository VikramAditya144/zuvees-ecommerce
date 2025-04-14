// src/components/rider/RecentOrdersList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import StatusBadge from '../common/StatusBadge';

const RecentOrdersList = ({ orders = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };
  
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 italic">
        No recent orders found
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <Link 
            key={order.id} 
            to={`/orders/${order.id}`}
            className="flex items-center p-3 hover:bg-gray-50"
          >
            <div className="flex-1">
              <p className="font-medium text-[#660E36]">
                #{order.orderNumber || order.id.substring(0, 8)}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="flex items-center">
              <StatusBadge status={order.status} />
              <ChevronRightIcon className="w-5 h-5 ml-2 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentOrdersList;