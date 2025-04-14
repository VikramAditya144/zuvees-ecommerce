// src/components/common/Notification.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Notification = ({ 
  type = 'success',
  message,
  isVisible,
  duration = 3000,
  onClose
}) => {
  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    error: <XCircleIcon className="w-6 h-6 text-red-500" />,
    warning: <ExclamationCircleIcon className="w-6 h-6 text-yellow-500" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />
  };
  
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };
  
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className={`flex items-center p-4 rounded-lg shadow-md border ${bgColors[type]}`}>
            <div className="flex-shrink-0 mr-3">
              {icons[type]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;