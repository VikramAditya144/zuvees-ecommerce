// src/components/rider/CustomerInfo.jsx
import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const CustomerInfo = ({ customer, address }) => {
  if (!customer && !address) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-medium text-gray-800 mb-3">Customer Information</h3>
      
      <div className="space-y-3">
        {customer?.name && (
          <div className="text-sm">
            <p className="font-medium">{customer.name}</p>
          </div>
        )}
        
        {customer?.phone && (
          <div className="flex items-center">
            <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
            <a 
              href={`tel:${customer.phone}`} 
              className="text-sm text-[#660E36] hover:underline"
            >
              {customer.phone}
            </a>
          </div>
        )}
        
        {customer?.email && (
          <div className="flex items-center">
            <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
            <a 
              href={`mailto:${customer.email}`} 
              className="text-sm text-[#660E36] hover:underline"
            >
              {customer.email}
            </a>
          </div>
        )}
        
        {address && (
          <div className="flex items-start">
            <MapPinIcon className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p>{address.address}</p>
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p>{address.country}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;