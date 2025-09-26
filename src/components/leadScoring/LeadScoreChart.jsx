import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const LeadScoreChart = ({ data }) => {
  // Calculate the maximum count for scaling
  const maxCount = Math.max(...data.map(item => item.count));
  
  // Color mapping for different score ranges
  const getBarColor = (range) => {
    switch (range) {
      case '0-20':
        return 'bg-red-500';
      case '21-40':
        return 'bg-orange-500';
      case '41-60':
        return 'bg-yellow-500';
      case '61-80':
        return 'bg-blue-500';
      case '81-100':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBarColorLight = (range) => {
    switch (range) {
      case '0-20':
        return 'bg-red-100';
      case '21-40':
        return 'bg-orange-100';
      case '41-60':
        return 'bg-yellow-100';
      case '61-80':
        return 'bg-blue-100';
      case '81-100':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTextColor = (range) => {
    switch (range) {
      case '0-20':
        return 'text-red-700';
      case '21-40':
        return 'text-orange-700';
      case '41-60':
        return 'text-yellow-700';
      case '61-80':
        return 'text-blue-700';
      case '81-100':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lead Score Distribution</h3>
          <p className="text-sm text-gray-600 mt-1">Distribution of leads by score range</p>
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          
          return (
            <div key={index} className="space-y-2">
              {/* Label and Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{item.range}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getBarColorLight(item.range)} ${getTextColor(item.range)}`}>
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
              
              {/* Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${getBarColor(item.range)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {/* Percentage label on bar */}
                {item.count > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white drop-shadow-sm">
                      {Math.round((item.count / data.reduce((sum, d) => sum + d.count, 0)) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.find(item => item.range === '81-100')?.count || 0}
            </div>
            <div className="text-sm text-gray-600">High Quality</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <span className="font-medium">Insight:</span> 
            {(() => {
              const hotLeads = data.find(item => item.range === '81-100')?.count || 0;
              const totalLeads = data.reduce((sum, item) => sum + item.count, 0);
              const hotPercentage = totalLeads > 0 ? Math.round((hotLeads / totalLeads) * 100) : 0;
              
              if (hotPercentage >= 30) {
                return ` Excellent! ${hotPercentage}% of your leads are high-quality prospects.`;
              } else if (hotPercentage >= 15) {
                return ` Good progress! ${hotPercentage}% of leads are high-quality. Focus on nurturing warm leads.`;
              } else {
                return ` Opportunity to improve lead quality. Consider refining your targeting strategy.`;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoreChart;