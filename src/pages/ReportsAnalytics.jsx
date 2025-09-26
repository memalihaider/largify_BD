import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, Filter, Download, TrendingUp, TrendingDown, 
  Users, DollarSign, CheckCircle, Target, FileText 
} from 'lucide-react';
import { getCurrentUser, hasLegacyPermission } from '../utils/auth';

const ReportsAnalytics = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedBusiness, setSelectedBusiness] = useState('all');
  const [selectedTeamMember, setSelectedTeamMember] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('all');

  // Mock data for charts and KPIs
  const leadsGrowthData = [
    { month: 'Jan', leads: 45, converted: 12 },
    { month: 'Feb', leads: 52, converted: 18 },
    { month: 'Mar', leads: 48, converted: 15 },
    { month: 'Apr', leads: 61, converted: 22 },
    { month: 'May', leads: 55, converted: 19 },
    { month: 'Jun', leads: 67, converted: 28 },
    { month: 'Jul', leads: 72, converted: 31 },
    { month: 'Aug', leads: 68, converted: 29 },
    { month: 'Sep', leads: 75, converted: 34 },
    { month: 'Oct', leads: 82, converted: 38 },
    { month: 'Nov', leads: 79, converted: 36 },
    { month: 'Dec', leads: 88, converted: 42 }
  ];

  const monthlySalesData = [
    { month: 'Jan', sales: 12500, target: 15000 },
    { month: 'Feb', sales: 18200, target: 15000 },
    { month: 'Mar', sales: 15800, target: 15000 },
    { month: 'Apr', sales: 22100, target: 20000 },
    { month: 'May', sales: 19500, target: 20000 },
    { month: 'Jun', sales: 28300, target: 25000 },
    { month: 'Jul', sales: 31200, target: 25000 },
    { month: 'Aug', sales: 29800, target: 25000 },
    { month: 'Sep', sales: 34500, target: 30000 },
    { month: 'Oct', sales: 38200, target: 30000 },
    { month: 'Nov', sales: 36800, target: 30000 },
    { month: 'Dec', sales: 42500, target: 35000 }
  ];

  const dealStatusData = [
    { name: 'Won', value: 45, color: '#10B981' },
    { name: 'Open', value: 32, color: '#3B82F6' },
    { name: 'Lost', value: 23, color: '#EF4444' }
  ];

  const kpiData = {
    totalRevenue: { value: 342500, change: 12.5, trend: 'up' },
    activeSubscriptions: { value: 1247, change: 8.3, trend: 'up' },
    totalCustomers: { value: 2891, change: -2.1, trend: 'down' },
    tasksCompleted: { value: 1456, change: 15.7, trend: 'up' }
  };

  const businessOptions = [
    { value: 'all', label: 'All Businesses' },
    { value: 'tech-corp', label: 'Tech Corp' },
    { value: 'marketing-pro', label: 'Marketing Pro' },
    { value: 'sales-force', label: 'Sales Force' }
  ];

  const teamMemberOptions = [
    { value: 'all', label: 'All Team Members' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' }
  ];

  const planOptions = [
    { value: 'all', label: 'All Plans' },
    { value: 'basic', label: 'Basic Plan' },
    { value: 'professional', label: 'Professional Plan' },
    { value: 'enterprise', label: 'Enterprise Plan' }
  ];

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    // Set default date range to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    setDateRange({
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    });
  }, []);

  // Role-based access control
  const canViewReports = () => {
    if (!currentUser) return false;
    return hasLegacyPermission(currentUser.role, 'view_reports');
  };

  const canViewAllBusinesses = () => {
    if (!currentUser) return false;
    return currentUser.role === 'super_admin';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const handleExport = (format) => {
    // Export functionality would be implemented here
    // Format: 'pdf', 'excel', 'csv'
  };

  if (!canViewReports()) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400">You don't have permission to view reports and analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-slate-400">Comprehensive insights into your business performance</p>
        </div>

        {/* Filter Controls Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date Range Picker */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Business Filter */}
            {canViewAllBusinesses() && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Filter className="inline w-4 h-4 mr-1" />
                  Business
                </label>
                <select
                  value={selectedBusiness}
                  onChange={(e) => setSelectedBusiness(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {businessOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Team Member Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Team Member</label>
              <select
                value={selectedTeamMember}
                onChange={(e) => setSelectedTeamMember(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {teamMemberOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Plan Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Plan</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {planOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              {kpiData.totalRevenue.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(kpiData.totalRevenue.value)}
              </div>
              <div className="text-sm text-slate-400">Total Revenue</div>
            </div>
            <div className={`text-sm flex items-center gap-1 ${
              kpiData.totalRevenue.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {kpiData.totalRevenue.trend === 'up' ? '+' : ''}{kpiData.totalRevenue.change}% from last month
            </div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-900/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              {kpiData.activeSubscriptions.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-white">
                {formatNumber(kpiData.activeSubscriptions.value)}
              </div>
              <div className="text-sm text-slate-400">Active Subscriptions</div>
            </div>
            <div className={`text-sm flex items-center gap-1 ${
              kpiData.activeSubscriptions.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {kpiData.activeSubscriptions.trend === 'up' ? '+' : ''}{kpiData.activeSubscriptions.change}% from last month
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              {kpiData.totalCustomers.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-white">
                {formatNumber(kpiData.totalCustomers.value)}
              </div>
              <div className="text-sm text-slate-400">Total Customers</div>
            </div>
            <div className={`text-sm flex items-center gap-1 ${
              kpiData.totalCustomers.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {kpiData.totalCustomers.trend === 'up' ? '+' : ''}{kpiData.totalCustomers.change}% from last month
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-orange-400" />
              </div>
              {kpiData.tasksCompleted.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-white">
                {formatNumber(kpiData.tasksCompleted.value)}
              </div>
              <div className="text-sm text-slate-400">Tasks Completed</div>
            </div>
            <div className={`text-sm flex items-center gap-1 ${
              kpiData.tasksCompleted.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {kpiData.tasksCompleted.trend === 'up' ? '+' : ''}{kpiData.tasksCompleted.change}% from last month
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Leads Growth Line Chart */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Leads Growth Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="Total Leads"
                />
                <Line 
                  type="monotone" 
                  dataKey="converted" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Converted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Deal Status Pie Chart */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Deal Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dealStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dealStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales Bar Chart */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Monthly Sales Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
                formatter={(value) => [formatCurrency(value), '']}
              />
              <Legend />
              <Bar 
                dataKey="sales" 
                fill="#10B981" 
                name="Actual Sales"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="target" 
                fill="#6B7280" 
                name="Target"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;