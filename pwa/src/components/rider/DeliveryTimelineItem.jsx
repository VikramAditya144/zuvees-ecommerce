// src/components/rider/DeliveryTimelineItem.jsx
import React from 'react';
import { format } from 'date-fns';
import { CheckIcon } from '@heroicons/react/24/outline';

const DeliveryTimelineItem = ({ title, description, time, isCompleted, isActive }) => {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      return format(new Date(dateString), 'h:mm a, MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="flex pb-8 last:pb-0">
      <div className="flex flex-col items-center mr-4">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${isCompleted 
            ? 'bg-green-100 text-green-600' 
            : isActive 
              ? 'bg-[#fdf0f5] text-[#660E36] border-2 border-[#660E36]' 
              : 'bg-gray-100 text-gray-400'
          }
        `}>
          {isCompleted ? (
            <CheckIcon className="w-5 h-5" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-current"></div>
          )}
        </div>
        
        {/* Connecting line */}
        <div className="w-0.5 h-full bg-gray-200 mt-2 last:hidden"></div>
      </div>
      
      <div className="pt-1.5">
        <h3 className={`font-medium ${
          isCompleted ? 'text-green-600' : isActive ? 'text-[#660E36]' : 'text-gray-500'
        }`}>
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
        
        {time && (
          <p className="text-xs text-gray-400 mt-1">{formatTime(time)}</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryTimelineItem;