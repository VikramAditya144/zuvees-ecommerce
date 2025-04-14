// src/components/common/EmptyState.jsx
import React from 'react';

const EmptyState = ({ 
  title, 
  message, 
  icon, 
  actionButton = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg shadow-sm">
      <div className="mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{message}</p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
