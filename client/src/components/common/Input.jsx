

// src/components/common/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  name, 
  type = 'text', 
  error, 
  placeholder,
  className = '',
  onChange,
  onBlur,
  value,
  id,
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id || name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36] ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

export default Input;