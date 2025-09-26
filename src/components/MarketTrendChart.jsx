import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MarketTrendChart = () => {
  // Dummy 12-month market trend data
  const marketData = [
    { month: 'Jan', marketShare: 28.5, competitors: 22, avgPrice: 185 },
    { month: 'Feb', marketShare: 29.2, competitors: 23, avgPrice: 188 },
    { month: 'Mar', marketShare: 30.1, competitors: 24, avgPrice: 192 },
    { month: 'Apr', marketShare: 31.8, competitors: 25, avgPrice: 195 },
    { month: 'May', marketShare: 32.4, competitors: 26, avgPrice: 198 },
    { month: 'Jun', marketShare: 33.1, competitors: 27, avgPrice: 201 },
    { month: 'Jul', marketShare: 32.9, competitors: 28, avgPrice: 203 },
    { month: 'Aug', marketShare: 33.5, competitors: 29, avgPrice: 206 },
    { month: 'Sep', marketShare: 34.2, competitors: 30, avgPrice: 208 },
    { month: 'Oct', marketShare: 33.8, competitors: 31, avgPrice: 210 },
    { month: 'Nov', marketShare: 34.6, competitors: 32, avgPrice: 212 },
    { month: 'Dec', marketShare: 35.2, competitors: 33, avgPrice: 215 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-4 border border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-white mb-2">{`${label} 2024`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.dataKey === 'marketShare' ? '%' : entry.dataKey === 'avgPrice' ? '$' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={marketData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="marketShare"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#1f2937' }}
            name="Market Share"
          />
          <Line
            type="monotone"
            dataKey="competitors"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#1f2937' }}
            name="Competitors"
          />
          <Line
            type="monotone"
            dataKey="avgPrice"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#f59e0b', strokeWidth: 2, fill: '#1f2937' }}
            name="Avg Price"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-300">Market Share (%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-300">Competitors Count</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-300">Average Price ($)</span>
        </div>
      </div>
    </div>
  );
};

export default MarketTrendChart;