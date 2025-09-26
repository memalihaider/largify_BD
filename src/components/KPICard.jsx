import React from 'react';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, color = 'blue', trend = null, change = null }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  };

  const iconColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400'
  };

  // Determine trend direction for marketing dashboard
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 hover:shadow-lg hover:bg-gray-650 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`p-2 rounded-lg bg-gray-600 ${iconColorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-gray-300 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && !change && (
          <div className={`flex items-center gap-1 text-xs mt-2 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="capitalize">{trend} trend</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;