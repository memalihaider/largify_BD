import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Gift, 
  Percent, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Download, 
  Filter, 
  Search,
  MoreHorizontal,
  CheckSquare,
  Square,
  RefreshCw,
  DollarSign,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getUserRole, canAccessSuperAdminFeatures } from '../utils/auth';

const MarketingDiscountDashboard = () => {
  const [activeTab, setActiveTab] = useState('referrals');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const userRole = getUserRole();

  // Mock data - replace with actual API calls
  const [dashboardStats, setDashboardStats] = useState({
    totalReferrals: { value: 1247, change: '+12%', trend: 'up' },
    activeCoupons: { value: 89, change: '+5%', trend: 'up' },
    activePromotions: { value: 23, change: '-2%', trend: 'down' },
    totalRevenue: { value: '$45,230', change: '+18%', trend: 'up' }
  });

  const [referralData, setReferralData] = useState([
    {
      id: 1,
      campaignName: 'Holiday Referral Boost',
      status: 'active',
      signups: 156,
      conversions: 89,
      conversionRate: '57%',
      reward: '$25',
      threshold: 3,
      createdDate: '2024-12-01',
      expiryDate: '2024-12-31'
    },
    {
      id: 2,
      campaignName: 'New Year Growth',
      status: 'scheduled',
      signups: 0,
      conversions: 0,
      conversionRate: '0%',
      reward: '$50',
      threshold: 5,
      createdDate: '2024-12-15',
      expiryDate: '2025-01-31'
    }
  ]);

  const [couponData, setCouponData] = useState([
    {
      id: 1,
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      status: 'active',
      usageCount: 234,
      usageLimit: 500,
      expiryDate: '2024-12-31',
      createdDate: '2024-11-01'
    },
    {
      id: 2,
      code: 'SAVE50NOW',
      type: 'fixed',
      value: 50,
      status: 'active',
      usageCount: 89,
      usageLimit: 200,
      expiryDate: '2024-12-25',
      createdDate: '2024-12-01'
    }
  ]);

  const [promotionData, setPromotionData] = useState([
    {
      id: 1,
      name: 'Black Friday Sale',
      type: 'percentage',
      discount: 30,
      status: 'completed',
      startDate: '2024-11-29',
      endDate: '2024-12-02',
      revenue: '$12,450',
      orders: 156,
      performance: 'excellent'
    },
    {
      id: 2,
      name: 'Christmas Special',
      type: 'fixed',
      discount: 100,
      status: 'active',
      startDate: '2024-12-20',
      endDate: '2024-12-26',
      revenue: '$8,230',
      orders: 89,
      performance: 'good'
    }
  ]);

  // Check if user has Super Admin access
  if (!canAccessSuperAdminFeatures()) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Access Denied</div>
          <p className="text-slate-300">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleSelectAll = (data) => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map(item => item.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Bulk ${action} for items:`, selectedItems);
      setSelectedItems([]);
      setLoading(false);
    }, 1000);
  };

  const handleExport = (type) => {
    console.log(`Exporting ${type} data...`);
    // Implement export functionality
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-500', icon: CheckCircle },
      inactive: { color: 'bg-gray-500', icon: XCircle },
      scheduled: { color: 'bg-blue-500', icon: Clock },
      completed: { color: 'bg-purple-500', icon: CheckCircle },
      expired: { color: 'bg-red-500', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const StatCard = ({ title, value, change, trend, icon: Icon }) => (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </span>
            <span className="text-slate-400 text-sm ml-2">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-violet-500/10 rounded-lg">
          <Icon className="w-6 h-6 text-violet-400" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'bg-violet-600 text-white' 
          : 'text-slate-400 hover:text-white hover:bg-slate-700'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  const ActionButton = ({ onClick, icon: Icon, label, variant = 'primary' }) => {
    const variants = {
      primary: 'bg-violet-600 hover:bg-violet-700 text-white',
      secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };

    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${variants[variant]}`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </button>
    );
  };

  const renderReferralSection = () => (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Referral Programs</h2>
          <p className="text-slate-400">Manage referral campaigns and track performance</p>
        </div>
        <div className="flex items-center gap-3">
          <ActionButton onClick={() => handleExport('referrals')} icon={Download} label="Export" variant="secondary" />
          <ActionButton onClick={() => console.log('Create referral')} icon={Plus} label="New Campaign" />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-white font-medium">{selectedItems.length} selected</span>
          <div className="flex items-center gap-2">
            <ActionButton onClick={() => handleBulkAction('activate')} icon={CheckCircle} label="Activate" variant="secondary" />
            <ActionButton onClick={() => handleBulkAction('deactivate')} icon={XCircle} label="Deactivate" variant="secondary" />
            <ActionButton onClick={() => handleBulkAction('delete')} icon={Trash2} label="Delete" variant="danger" />
          </div>
        </div>
      )}

      {/* Referral Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSelectAll(referralData)}
                    className="text-slate-400 hover:text-white"
                  >
                    {selectedItems.length === referralData.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Signups</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Conversions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Reward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {referralData.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectItem(campaign.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {selectedItems.includes(campaign.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{campaign.campaignName}</div>
                      <div className="text-slate-400 text-sm">Created: {campaign.createdDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(campaign.status)}</td>
                  <td className="px-6 py-4 text-white">{campaign.signups}</td>
                  <td className="px-6 py-4 text-white">{campaign.conversions}</td>
                  <td className="px-6 py-4 text-white">{campaign.conversionRate}</td>
                  <td className="px-6 py-4 text-white">{campaign.reward}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-white p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-white p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCouponSection = () => (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Coupon Code Management</h2>
          <p className="text-slate-400">Create, edit, and track coupon code performance</p>
        </div>
        <div className="flex items-center gap-3">
          <ActionButton onClick={() => handleExport('coupons')} icon={Download} label="Export" variant="secondary" />
          <ActionButton onClick={() => console.log('Create coupon')} icon={Plus} label="New Coupon" />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search coupon codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-white font-medium">{selectedItems.length} selected</span>
          <div className="flex items-center gap-2">
            <ActionButton onClick={() => handleBulkAction('activate')} icon={CheckCircle} label="Activate" variant="secondary" />
            <ActionButton onClick={() => handleBulkAction('deactivate')} icon={XCircle} label="Deactivate" variant="secondary" />
            <ActionButton onClick={() => handleBulkAction('delete')} icon={Trash2} label="Delete" variant="danger" />
          </div>
        </div>
      )}

      {/* Coupon Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSelectAll(couponData)}
                    className="text-slate-400 hover:text-white"
                  >
                    {selectedItems.length === couponData.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {couponData.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectItem(coupon.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {selectedItems.includes(coupon.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium font-mono">{coupon.code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.type === 'percentage' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {coupon.type === 'percentage' ? <Percent className="w-3 h-3 mr-1" /> : <DollarSign className="w-3 h-3 mr-1" />}
                      {coupon.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(coupon.status)}</td>
                  <td className="px-6 py-4">
                    <div className="text-white">{coupon.usageCount}/{coupon.usageLimit}</div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-violet-500 h-2 rounded-full" 
                        style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{coupon.expiryDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-white p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-white p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPromotionSection = () => (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Promotion Campaigns</h2>
          <p className="text-slate-400">Manage promotional campaigns and monitor performance</p>
        </div>
        <div className="flex items-center gap-3">
          <ActionButton onClick={() => handleExport('promotions')} icon={Download} label="Export" variant="secondary" />
          <ActionButton onClick={() => console.log('Create promotion')} icon={Plus} label="New Promotion" />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-white font-medium">{selectedItems.length} selected</span>
          <div className="flex items-center gap-2">
            <ActionButton onClick={() => handleBulkAction('activate')} icon={CheckCircle} label="Activate" variant="secondary" />
            <ActionButton onClick={() => handleBulkAction('deactivate')} icon={XCircle} label="Deactivate" variant="secondary" />
            <ActionButton onClick={() => handleBulkAction('delete')} icon={Trash2} label="Delete" variant="danger" />
          </div>
        </div>
      )}

      {/* Promotion Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSelectAll(promotionData)}
                    className="text-slate-400 hover:text-white"
                  >
                    {selectedItems.length === promotionData.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {promotionData.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectItem(promotion.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {selectedItems.includes(promotion.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{promotion.name}</div>
                      <div className="text-slate-400 text-sm">{promotion.startDate} - {promotion.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      promotion.type === 'percentage' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {promotion.type === 'percentage' ? <Percent className="w-3 h-3 mr-1" /> : <DollarSign className="w-3 h-3 mr-1" />}
                      {promotion.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {promotion.type === 'percentage' ? `${promotion.discount}%` : `$${promotion.discount}`}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(promotion.status)}</td>
                  <td className="px-6 py-4 text-white font-medium">{promotion.revenue}</td>
                  <td className="px-6 py-4 text-white">{promotion.orders}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      promotion.performance === 'excellent' ? 'bg-green-500/10 text-green-400' :
                      promotion.performance === 'good' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {promotion.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-white p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-white p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Marketing & Discount Management
        </h1>
        <p className="text-slate-400">
          Comprehensive dashboard for managing referrals, coupons, and promotional campaigns
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Referrals"
          value={dashboardStats.totalReferrals.value}
          change={dashboardStats.totalReferrals.change}
          trend={dashboardStats.totalReferrals.trend}
          icon={Users}
        />
        <StatCard
          title="Active Coupons"
          value={dashboardStats.activeCoupons.value}
          change={dashboardStats.activeCoupons.change}
          trend={dashboardStats.activeCoupons.trend}
          icon={Gift}
        />
        <StatCard
          title="Active Promotions"
          value={dashboardStats.activePromotions.value}
          change={dashboardStats.activePromotions.change}
          trend={dashboardStats.activePromotions.trend}
          icon={Percent}
        />
        <StatCard
          title="Total Revenue"
          value={dashboardStats.totalRevenue.value}
          change={dashboardStats.totalRevenue.change}
          trend={dashboardStats.totalRevenue.trend}
          icon={DollarSign}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-800 rounded-lg border border-slate-700">
        <TabButton
          id="referrals"
          label="Referral Programs"
          icon={Users}
          isActive={activeTab === 'referrals'}
          onClick={setActiveTab}
        />
        <TabButton
          id="coupons"
          label="Coupon Codes"
          icon={Gift}
          isActive={activeTab === 'coupons'}
          onClick={setActiveTab}
        />
        <TabButton
          id="promotions"
          label="Promotions"
          icon={Percent}
          isActive={activeTab === 'promotions'}
          onClick={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'referrals' && renderReferralSection()}
        {activeTab === 'coupons' && renderCouponSection()}
        {activeTab === 'promotions' && renderPromotionSection()}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
            <span className="text-white">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingDiscountDashboard;