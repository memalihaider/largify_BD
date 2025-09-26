import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Pause } from 'lucide-react';

const OrderStatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          iconColor: 'text-green-400',
          label: 'Active'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          iconColor: 'text-blue-400',
          label: 'Approved'
        };
      case 'pending':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          iconColor: 'text-yellow-400',
          label: 'Pending'
        };
      case 'rejected':
        return {
          icon: XCircle,
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          iconColor: 'text-red-400',
          label: 'Rejected'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          iconColor: 'text-gray-400',
          label: 'Cancelled'
        };
      case 'suspended':
        return {
          icon: Pause,
          bgColor: 'bg-orange-500/10',
          textColor: 'text-orange-400',
          iconColor: 'text-orange-400',
          label: 'Suspended'
        };
      case 'expired':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          iconColor: 'text-red-400',
          label: 'Expired'
        };
      default:
        return {
          icon: Clock,
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          iconColor: 'text-gray-400',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    small: 'h-3 w-3',
    default: 'h-4 w-4',
    large: 'h-5 w-5'
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${config.bgColor} ${config.textColor} ${sizeClasses[size]}
    `}>
      <Icon className={`${config.iconColor} ${iconSizes[size]}`} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;