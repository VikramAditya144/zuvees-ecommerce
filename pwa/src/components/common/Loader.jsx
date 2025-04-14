// src/components/common/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'md', className = '', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <motion.div
          className={`rounded-full border-4 border-t-[#660E36] border-r-transparent border-b-transparent border-l-transparent ${sizes[size]}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`rounded-full border-4 border-t-[#660E36] border-r-transparent border-b-transparent border-l-transparent ${sizes[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default Loader;