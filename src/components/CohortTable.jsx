import React, { useState } from 'react';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

const CohortTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className="w-4 h-4 text-slate-500" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-violet-400" />
      : <ChevronDown className="w-4 h-4 text-violet-400" />;
  };

  const getRetentionColor = (rate) => {
    if (rate >= 85) return 'text-green-400';
    if (rate >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLTVTrend = (ltv) => {
    // Mock trend calculation based on LTV value
    const trend = ltv > 1300 ? 'up' : 'down';
    const percentage = Math.abs(ltv - 1250) / 1250 * 100;
    return { trend, percentage: percentage.toFixed(1) };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th 
              className="text-left py-3 px-4 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('cohort')}
            >
              <div className="flex items-center gap-2">
                Cohort (Signup Month)
                <SortIcon column="cohort" />
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('users')}
            >
              <div className="flex items-center gap-2">
                Users
                <SortIcon column="users" />
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('retentionRate')}
            >
              <div className="flex items-center gap-2">
                Retention Rate (%)
                <SortIcon column="retentionRate" />
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
              onClick={() => handleSort('ltv')}
            >
              <div className="flex items-center gap-2">
                LTV (Lifetime Value)
                <SortIcon column="ltv" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((cohort, index) => {
            const ltvTrend = getLTVTrend(cohort.ltv);
            return (
              <tr 
                key={cohort.cohort} 
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                    <span className="text-white font-medium">{cohort.cohort}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-slate-300">{cohort.users.toLocaleString()}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getRetentionColor(cohort.retentionRate)}`}>
                      {cohort.retentionRate}%
                    </span>
                    <div className={`w-16 h-2 bg-slate-700 rounded-full overflow-hidden`}>
                      <div 
                        className={`h-full transition-all duration-300 ${
                          cohort.retentionRate >= 85 ? 'bg-green-400' :
                          cohort.retentionRate >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${cohort.retentionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      ${cohort.ltv.toLocaleString()}
                    </span>
                    <div className={`flex items-center gap-1 text-xs ${
                      ltvTrend.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {ltvTrend.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {ltvTrend.percentage}%
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 text-sm">Average Retention</p>
          <p className="text-xl font-bold text-white mt-1">
            {(data.reduce((sum, cohort) => sum + cohort.retentionRate, 0) / data.length).toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm">Average LTV</p>
          <p className="text-xl font-bold text-white mt-1">
            ${Math.round(data.reduce((sum, cohort) => sum + cohort.ltv, 0) / data.length).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm">Total Users</p>
          <p className="text-xl font-bold text-white mt-1">
            {data.reduce((sum, cohort) => sum + cohort.users, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CohortTable;