import React, { useState } from 'react';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

const CompetitorTable = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Dummy competitor data
  const [competitors] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      product: 'Enterprise CRM',
      price: '$299/month',
      priceValue: 299,
      positioning: 'High',
      marketTrend: 'up',
      trendValue: '+12%'
    },
    {
      id: 2,
      name: 'DataFlow Systems',
      product: 'Analytics Platform',
      price: '$149/month',
      priceValue: 149,
      positioning: 'Mid',
      marketTrend: 'up',
      trendValue: '+8%'
    },
    {
      id: 3,
      name: 'CloudBase Pro',
      product: 'Project Management',
      price: '$89/month',
      priceValue: 89,
      positioning: 'Low',
      marketTrend: 'down',
      trendValue: '-3%'
    },
    {
      id: 4,
      name: 'InnovateTech',
      product: 'Marketing Automation',
      price: '$199/month',
      priceValue: 199,
      positioning: 'Mid',
      marketTrend: 'up',
      trendValue: '+15%'
    },
    {
      id: 5,
      name: 'NextGen Analytics',
      product: 'Business Intelligence',
      price: '$399/month',
      priceValue: 399,
      positioning: 'High',
      marketTrend: 'up',
      trendValue: '+6%'
    },
    {
      id: 6,
      name: 'StartupTools',
      product: 'All-in-One Suite',
      price: '$49/month',
      priceValue: 49,
      positioning: 'Low',
      marketTrend: 'down',
      trendValue: '-5%'
    },
    {
      id: 7,
      name: 'Enterprise Hub',
      product: 'Workflow Management',
      price: '$249/month',
      priceValue: 249,
      positioning: 'High',
      marketTrend: 'up',
      trendValue: '+9%'
    }
  ]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCompetitors = React.useMemo(() => {
    let sortableCompetitors = [...competitors];
    if (sortConfig.key) {
      sortableCompetitors.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle price sorting by numeric value
        if (sortConfig.key === 'price') {
          aValue = a.priceValue;
          bValue = b.priceValue;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCompetitors;
  }, [competitors, sortConfig]);

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="w-4 h-4" /> : 
        <ChevronDown className="w-4 h-4" />;
    }
    return <ChevronUp className="w-4 h-4 opacity-30" />;
  };

  const getPositioningColor = (positioning) => {
    switch (positioning.toLowerCase()) {
      case 'high':
        return 'bg-red-900/30 text-red-300 border border-red-700/50';
      case 'mid':
        return 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50';
      case 'low':
        return 'bg-green-900/30 text-green-300 border border-green-700/50';
      default:
        return 'bg-gray-700/50 text-gray-300 border border-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-400" /> : 
      <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-600">
        <thead className="bg-gray-700">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1">
                Competitor Name
                {getSortIcon('name')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('product')}
            >
              <div className="flex items-center gap-1">
                Product
                {getSortIcon('product')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center gap-1">
                Price
                {getSortIcon('price')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('positioning')}
            >
              <div className="flex items-center gap-1">
                Positioning
                {getSortIcon('positioning')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleSort('marketTrend')}
            >
              <div className="flex items-center gap-1">
                Market Trend
                {getSortIcon('marketTrend')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-600">
          {sortedCompetitors.map((competitor) => (
            <tr key={competitor.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">
                  {competitor.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{competitor.product}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">
                  {competitor.price}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositioningColor(competitor.positioning)}`}>
                  {competitor.positioning}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {getTrendIcon(competitor.marketTrend)}
                  <span className={`text-sm font-medium ${
                    competitor.marketTrend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {competitor.trendValue}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompetitorTable;