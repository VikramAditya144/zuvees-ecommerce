// src/components/rider/StatsCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color = '#660E36', className = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {/* Mobile View (Column Layout) */}
      <div className="block sm:hidden p-4">
        <div className="flex flex-col items-center">
          {/* Larger icon for mobile */}
          <div 
            className="rounded-full p-1 mb-2" 
            style={{ backgroundColor: `${color}20` }}
          >
            <div 
              className="w-12 h-12 flex items-center justify-center"
              style={{ color }}
            >
              {icon}
            </div>
          </div>
          
          {/* Centered text for mobile */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          </div>
        </div>
      </div>
      
      {/* Tablet and Desktop View (Row Layout) */}
      <div className="hidden sm:block p-4">
        <div className="flex items-center">
          <div 
            className="rounded-full p-3 mr-4" 
            style={{ backgroundColor: `${color}20` }}
          >
            <div 
              className="w-8 h-8 flex items-center justify-center"
              style={{ color }}
            >
              {icon}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;