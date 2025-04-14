// src/components/rider/FilterTabs.jsx
import React from 'react';
import { motion } from 'framer-motion';

const FilterTabs = ({ 
  activeFilter, 
  onFilterChange, 
  filters = [
    { value: '', label: 'All' },
    { value: 'shipped', label: 'To Deliver' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'undelivered', label: 'Undelivered' }
  ],
  className = '' 
}) => {
  return (
    <div className={`bg-white p-2 rounded-lg shadow-md ${className}`}>
      <div className="flex overflow-x-auto scrollbar-hide space-x-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              activeFilter === filter.value
                ? 'text-[#660E36]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {filter.label}
            {activeFilter === filter.value && (
              <motion.div
                layoutId="activeFilterIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#660E36] rounded-full"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;