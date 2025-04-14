// src/components/rider/DeliveryProgressChart.jsx
import React from 'react';

const DeliveryProgressChart = ({ deliveryRate }) => {
  // Convert to number if it's a string
  const rate = typeof deliveryRate === 'string' ? parseFloat(deliveryRate) : deliveryRate;
  
  // Ensure the rate is between 0 and 100
  const safeRate = Math.min(Math.max(0, rate), 100);
  
  // Calculate colors based on performance
  let progressColor = '#660E36'; // Default brand color
  
  if (safeRate < 50) {
    progressColor = '#EF4444'; // Red for < 50%
  } else if (safeRate < 75) {
    progressColor = '#F59E0B'; // Amber for < 75%
  } else {
    progressColor = '#10B981'; // Green for >= 75%
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 font-medium">Delivery Performance</h3>
        <span className="text-lg font-bold" style={{ color: progressColor }}>
          {safeRate.toFixed(1)}%
        </span>
      </div>
      
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${safeRate}%`,
            backgroundColor: progressColor 
          }}
        />
      </div>
      
      <div className="mt-3 text-xs text-gray-500 flex justify-between">
        <span>Poor</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

export default DeliveryProgressChart;
