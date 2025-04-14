// src/components/common/StatusBadge.jsx
import React from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  TruckIcon, 
  ClockIcon,
  ExclamationCircleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Badge from './Badge';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { 
          variant: 'warning', 
          label: 'Pending',
          icon: <ClockIcon className="w-4 h-4 mr-1" />
        };
      case 'paid':
        return { 
          variant: 'primary', 
          label: 'Paid',
          icon: <BanknotesIcon className="w-4 h-4 mr-1" />
        };
      case 'shipped':
        return { 
          variant: 'info', 
          label: 'Shipped',
          icon: <TruckIcon className="w-4 h-4 mr-1" />
        };
      case 'delivered':
        return { 
          variant: 'success', 
          label: 'Delivered',
          icon: <CheckCircleIcon className="w-4 h-4 mr-1" />
        };
      case 'undelivered':
        return { 
          variant: 'danger', 
          label: 'Undelivered',
          icon: <ExclamationCircleIcon className="w-4 h-4 mr-1" />
        };
      case 'cancelled':
        return { 
          variant: 'secondary', 
          label: 'Cancelled',
          icon: <XCircleIcon className="w-4 h-4 mr-1" />
        };
      default:
        return { 
          variant: 'secondary', 
          label: status || 'Unknown',
          icon: null
        };
    }
  };
  
  const { variant, label, icon } = getStatusConfig();
  
  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {label}
    </Badge>
  );
};

export default StatusBadge;