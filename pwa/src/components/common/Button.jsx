// src/components/common/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  loading = false
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  const variants = {
    primary: 'bg-[#660E36] hover:bg-[#4d0a28] text-white focus:ring-[#660E36]',
    secondary: 'bg-white border-2 border-[#660E36] text-[#660E36] hover:bg-[#fdf0f5] focus:ring-[#660E36]',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent',
  };
  
  const sizes = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-5 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${widthStyles} ${className}`}
    >
      {loading && (
        <div className="spinner mr-2 w-4 h-4"></div>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;