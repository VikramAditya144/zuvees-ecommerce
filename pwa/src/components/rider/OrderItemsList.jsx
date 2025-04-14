// src/components/rider/OrderItemsList.jsx
import React from 'react';

const OrderItemsList = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 italic">
        No items found
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <div key={index} className="flex p-3">
            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            
            <div className="ml-4 flex-1">
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.color?.name}, {item.size}
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsList;