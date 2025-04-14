// src/components/common/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title,
  subtitle,
  footer,
  onClick
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="p-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {footer && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;