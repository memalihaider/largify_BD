import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

const MetricsCard = ({ 
  title, 
  value, 
  previousValue, 
  icon: Icon, 
  color = 'violet',
  format = 'number',
  suffix = '',
  prefix = '',
  showTrend = true,
  isLoading = false,
  realTimeUpdate = false,
  target = null,
  className = ''
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (realTimeUpdate && value !== undefined) {
      const interval = setInterval(() => {
        setIsUpdating(true);
        setTimeout(() => {
          setCurrentValue(prev => {
            const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
            const newValue = Math.max(0, prev * (1 + variation));
            return format === 'currency' ? Math.round(newValue * 100) / 100 : Math.round(newValue);
          });
          setIsUpdating(false);
        }, 300);
      }, 8000); // Update every 8 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeUpdate, value, format]);

  // Calculate trend
  const calculateTrend = () => {
    if (!showTrend || previousValue === undefined || previousValue === 0) {
      return { value: 0, isPositive: true, percentage: 0 };
    }
    
    const change = currentValue - previousValue;
    const percentage = (change / previousValue) * 100;
    
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
      percentage: Math.abs(percentage)
    };
  };

  const trend = calculateTrend();

  // Format value based on type
  const formatValue = (val) => {
    if (val === undefined || val === null) return '0';
    
    switch (format) {
      case 'currency':
        return val.toLocaleString('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'decimal':
        return val.toFixed(2);
      default:
        return val.toLocaleString();
    }
  };

  // Color variants
  const colorVariants = {
    violet: {
      bg: 'bg-violet-500/20',
      icon: 'text-violet-400',
      trend: 'text-violet-400'
    },
    blue: {
      bg: 'bg-blue-500/20',
      icon: 'text-blue-400',
      trend: 'text-blue-400'
    },
    green: {
      bg: 'bg-green-500/20',
      icon: 'text-green-400',
      trend: 'text-green-400'
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      icon: 'text-yellow-400',
      trend: 'text-yellow-400'
    },
    red: {
      bg: 'bg-red-500/20',
      icon: 'text-red-400',
      trend: 'text-red-400'
    },
    emerald: {
      bg: 'bg-emerald-500/20',
      icon: 'text-emerald-400',
      trend: 'text-emerald-400'
    },
    cyan: {
      bg: 'bg-cyan-500/20',
      icon: 'text-cyan-400',
      trend: 'text-cyan-400'
    }
  };

  const colors = colorVariants[color] || colorVariants.violet;

  // Check if target is met
  const isTargetMet = target !== null && currentValue >= target;
  const targetProgress = target !== null ? (currentValue / target) * 100 : null;

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 p-6 transition-all duration-300 ${isUpdating ? 'ring-2 ring-violet-500/50' : ''} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            {realTimeUpdate && (
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-400" />
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-700 animate-pulse rounded"></div>
            ) : (
              <p className={`text-2xl font-bold text-white transition-all duration-300 ${isUpdating ? 'scale-105' : ''}`}>
                {prefix}{formatValue(currentValue)}{suffix}
              </p>
            )}
          </div>

          {/* Trend Indicator */}
          {showTrend && previousValue !== undefined && !isLoading && (
            <div className="flex items-center gap-2 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trend.percentage.toFixed(1)}% vs previous
              </span>
            </div>
          )}

          {/* Target Progress */}
          {target !== null && !isLoading && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Target Progress</span>
                <span>{targetProgress?.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isTargetMet ? 'bg-green-500' : 'bg-violet-500'
                  }`}
                  style={{ width: `${Math.min(100, targetProgress || 0)}%` }}
                ></div>
              </div>
              {isTargetMet && (
                <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>Target achieved!</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={`p-3 ${colors.bg} rounded-lg ml-4`}>
          {Icon && <Icon className={`w-6 h-6 ${colors.icon}`} />}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;