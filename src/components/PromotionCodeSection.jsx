import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Percent,
  Users,
  ShoppingCart,
  Target,
  BarChart3,
  Zap,
  Award,
  Activity,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';
import PromotionCodeModal from './PromotionCodeModal';
import { AnalyticsChart } from './AnalyticsChart';
import { MetricsCard } from './MetricsCard';
import { exportToCSV, exportToJSON, exportToExcel, exportAnalyticsReport } from '../utils/exportUtils';

const PromotionCodeSection = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  // Mock data - replace with actual API calls
  const mockPromotions = [
    {
      id: 1,
      name: 'Black Friday Mega Sale',
      description: 'Biggest sale of the year with up to 70% off',
      code: 'BLACKFRI70',
      discountType: 'percentage',
      discountValue: 70,
      minimumOrderValue: 100,
      maximumDiscount: 500,
      startDate: '2024-11-29T00:00',
      endDate: '2024-12-02T23:59',
      status: 'scheduled',
      priority: 'urgent',
      targetAudience: 'all',
      applicableProducts: 'all',
      usageLimit: 10000,
      usagePerUser: 1,
      stackable: false,
      requiresApproval: true,
      channels: ['website', 'email', 'social'],
      tags: ['black-friday', 'mega-sale', 'annual'],
      totalUses: 0,
      totalRevenue: 0,
      conversionRate: 0,
      clickThroughRate: 0,
      impressions: 0,
      createdAt: '2024-10-15',
      approvedBy: null,
      approvedAt: null
    },
    {
      id: 2,
      name: 'Summer Flash Sale',
      description: '48-hour flash sale on summer collection',
      code: 'FLASH48',
      discountType: 'percentage',
      discountValue: 40,
      minimumOrderValue: 50,
      maximumDiscount: 200,
      startDate: '2024-07-15T12:00',
      endDate: '2024-07-17T12:00',
      status: 'active',
      priority: 'high',
      targetAudience: 'existing_users',
      applicableProducts: 'categories',
      usageLimit: 2000,
      usagePerUser: 1,
      stackable: true,
      requiresApproval: false,
      channels: ['website', 'mobile', 'social'],
      tags: ['flash-sale', 'summer', 'limited-time'],
      totalUses: 1247,
      totalRevenue: 89340,
      conversionRate: 18.5,
      clickThroughRate: 12.3,
      impressions: 45230,
      createdAt: '2024-07-10',
      approvedBy: 'admin@company.com',
      approvedAt: '2024-07-12T10:30'
    },
    {
      id: 3,
      name: 'New Customer Welcome',
      description: 'Special discount for first-time customers',
      code: 'WELCOME30',
      discountType: 'percentage',
      discountValue: 30,
      minimumOrderValue: 25,
      maximumDiscount: 100,
      startDate: '2024-01-01T00:00',
      endDate: '2024-12-31T23:59',
      status: 'active',
      priority: 'medium',
      targetAudience: 'new_users',
      applicableProducts: 'all',
      usageLimit: null,
      usagePerUser: 1,
      stackable: false,
      requiresApproval: false,
      channels: ['website', 'email'],
      tags: ['welcome', 'new-customer', 'onboarding'],
      totalUses: 3456,
      totalRevenue: 156780,
      conversionRate: 24.7,
      clickThroughRate: 15.8,
      impressions: 78920,
      createdAt: '2023-12-15',
      approvedBy: 'admin@company.com',
      approvedAt: '2023-12-20T14:15'
    },
    {
      id: 4,
      name: 'Free Shipping Weekend',
      description: 'Free shipping on all orders this weekend',
      code: 'FREESHIP',
      discountType: 'shipping',
      discountValue: 0,
      minimumOrderValue: 0,
      maximumDiscount: null,
      startDate: '2024-06-01T00:00',
      endDate: '2024-06-03T23:59',
      status: 'expired',
      priority: 'low',
      targetAudience: 'all',
      applicableProducts: 'all',
      usageLimit: 5000,
      usagePerUser: 2,
      stackable: true,
      requiresApproval: false,
      channels: ['website', 'mobile'],
      tags: ['free-shipping', 'weekend', 'logistics'],
      totalUses: 4892,
      totalRevenue: 234560,
      conversionRate: 31.2,
      clickThroughRate: 22.1,
      impressions: 67890,
      createdAt: '2024-05-25',
      approvedBy: 'admin@company.com',
      approvedAt: '2024-05-28T09:45'
    },
    {
      id: 5,
      name: 'Premium Member Exclusive',
      description: 'Exclusive 25% discount for premium members',
      code: 'PREMIUM25',
      discountType: 'percentage',
      discountValue: 25,
      minimumOrderValue: 75,
      maximumDiscount: 150,
      startDate: '2024-08-01T00:00',
      endDate: '2024-08-31T23:59',
      status: 'paused',
      priority: 'medium',
      targetAudience: 'premium_users',
      applicableProducts: 'all',
      usageLimit: 1000,
      usagePerUser: 3,
      stackable: true,
      requiresApproval: true,
      channels: ['website', 'email', 'mobile'],
      tags: ['premium', 'exclusive', 'loyalty'],
      totalUses: 234,
      totalRevenue: 12450,
      conversionRate: 19.8,
      clickThroughRate: 14.2,
      impressions: 8920,
      createdAt: '2024-07-20',
      approvedBy: 'admin@company.com',
      approvedAt: '2024-07-25T16:20'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPromotions(mockPromotions);
      setFilteredPromotions(mockPromotions);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = promotions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(promotion =>
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(promotion => promotion.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(promotion => promotion.discountType === typeFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(promotion => promotion.priority === priorityFilter);
    }

    setFilteredPromotions(filtered);
  }, [promotions, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const handleCreatePromotion = async (promotionData) => {
    try {
      // Simulate API call
      const newPromotion = {
        ...promotionData,
        id: Date.now(),
        totalUses: 0,
        totalRevenue: 0,
        conversionRate: 0,
        clickThroughRate: 0,
        impressions: 0,
        createdAt: new Date().toISOString().split('T')[0],
        approvedBy: null,
        approvedAt: null,
        status: promotionData.requiresApproval ? 'pending_approval' : 'scheduled'
      };
      
      setPromotions(prev => [newPromotion, ...prev]);
    } catch (error) {
      console.error('Error creating promotion:', error);
    }
  };

  const handleEditPromotion = async (promotionData) => {
    try {
      // Simulate API call
      setPromotions(prev => prev.map(promotion => 
        promotion.id === editingPromotion.id 
          ? { ...promotion, ...promotionData }
          : promotion
      ));
      setEditingPromotion(null);
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    if (window.confirm('Are you sure you want to delete this promotion campaign?')) {
      try {
        // Simulate API call
        setPromotions(prev => prev.filter(promotion => promotion.id !== promotionId));
      } catch (error) {
        console.error('Error deleting promotion:', error);
      }
    }
  };

  const handlePromotionAction = async (promotionId, action) => {
    try {
      let newStatus;
      switch (action) {
        case 'activate':
          newStatus = 'active';
          break;
        case 'pause':
          newStatus = 'paused';
          break;
        case 'stop':
          newStatus = 'stopped';
          break;
        case 'approve':
          newStatus = 'scheduled';
          break;
        default:
          return;
      }

      setPromotions(prev => prev.map(promotion => 
        promotion.id === promotionId 
          ? { 
              ...promotion, 
              status: newStatus,
              ...(action === 'approve' && {
                approvedBy: 'current_user@company.com',
                approvedAt: new Date().toISOString()
              })
            }
          : promotion
      ));
    } catch (error) {
      console.error('Error updating promotion status:', error);
    }
  };

  const handleCopyPromotionCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const handleBulkAction = async (action) => {
    if (selectedPromotions.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          setPromotions(prev => prev.map(promotion => 
            selectedPromotions.includes(promotion.id) 
              ? { ...promotion, status: 'active' }
              : promotion
          ));
          break;
        case 'deactivate':
          setPromotions(prev => prev.map(promotion => 
            selectedPromotions.includes(promotion.id) 
              ? { ...promotion, status: 'inactive' }
              : promotion
          ));
          break;
        case 'pause':
          setPromotions(prev => prev.map(promotion => 
            selectedPromotions.includes(promotion.id) 
              ? { ...promotion, status: 'paused' }
              : promotion
          ));
          break;
        case 'schedule':
          const scheduleDate = new Date();
          scheduleDate.setDate(scheduleDate.getDate() + 1);
          setPromotions(prev => prev.map(promotion => 
            selectedPromotions.includes(promotion.id) 
              ? { ...promotion, status: 'scheduled', startDate: scheduleDate.toISOString().split('T')[0] }
              : promotion
          ));
          break;
        case 'duplicate':
          const promotionsToDuplicate = promotions.filter(promotion => selectedPromotions.includes(promotion.id));
          const duplicatedPromotions = promotionsToDuplicate.map(promotion => ({
            ...promotion,
            id: Date.now() + Math.random(),
            name: `${promotion.name} (Copy)`,
            code: `${promotion.code}_COPY`,
            status: 'draft',
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            createdAt: new Date().toISOString().split('T')[0]
          }));
          setPromotions(prev => [...duplicatedPromotions, ...prev]);
          break;
        case 'export':
          handleExportSelected();
          break;
        case 'extend':
          const extendDate = new Date();
          extendDate.setMonth(extendDate.getMonth() + 1);
          setPromotions(prev => prev.map(promotion => 
            selectedPromotions.includes(promotion.id) 
              ? { ...promotion, endDate: extendDate.toISOString().split('T')[0] }
              : promotion
          ));
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedPromotions.length} promotions?`)) {
            setPromotions(prev => prev.filter(promotion => !selectedPromotions.includes(promotion.id)));
          }
          break;
      }
      setSelectedPromotions([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleExportSelected = () => {
    const selectedData = promotions.filter(promotion => selectedPromotions.includes(promotion.id));
    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' },
      { key: 'type', label: 'Type' },
      { key: 'discount', label: 'Discount' },
      { key: 'status', label: 'Status' },
      { key: 'impressions', label: 'Impressions' },
      { key: 'clicks', label: 'Clicks' },
      { key: 'conversions', label: 'Conversions' },
      { key: 'ctr', label: 'CTR', format: (value) => `${value}%` },
      { key: 'conversionRate', label: 'Conversion Rate', format: (value) => `${value}%` },
      { key: 'revenue', label: 'Revenue', format: (value) => `$${value}` }
    ];
    
    exportToCSV(selectedData, columns, `selected-promotion-codes-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExport = () => {
    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' },
      { key: 'discountType', label: 'Type' },
      { key: 'discountValue', label: 'Value', format: (value, item) => {
        switch (item.discountType) {
          case 'fixed': return `$${value}`;
          case 'percentage': return `${value}%`;
          case 'shipping': return 'Free Shipping';
          default: return 'BOGO';
        }
      }},
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' },
      { key: 'totalUses', label: 'Total Uses' },
      { key: 'totalRevenue', label: 'Revenue', format: (value) => `$${value}` },
      { key: 'conversionRate', label: 'Conversion Rate', format: (value) => `${value}%` },
      { key: 'clickThroughRate', label: 'CTR', format: (value) => `${value}%` },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date' }
    ];

    // Show export options
    const exportFormat = prompt('Choose export format:\n1. CSV\n2. JSON\n3. Excel\n4. Analytics Report\n\nEnter number (1-4):', '1');
    
    switch (exportFormat) {
      case '1':
        exportToCSV(filteredPromotions, columns, 'promotion-campaigns');
        break;
      case '2':
        exportToJSON(filteredPromotions, 'promotion-campaigns');
        break;
      case '3':
        exportToExcel(filteredPromotions, columns, 'promotion-campaigns');
        break;
      case '4':
        const analyticsData = {
          summary: {
            totalCampaigns: promotions.length,
            activeCampaigns: promotions.filter(p => p.status === 'active').length,
            totalRevenue: promotions.reduce((sum, p) => sum + p.totalRevenue, 0),
            averageConversionRate: promotions.reduce((sum, p) => sum + p.conversionRate, 0) / promotions.length,
            totalImpressions: promotions.reduce((sum, p) => sum + p.impressions, 0),
            totalClicks: promotions.reduce((sum, p) => sum + p.clicks, 0)
          },
          campaigns: filteredPromotions
        };
        exportAnalyticsReport(analyticsData, 'promotion-campaigns-analytics');
        break;
      default:
        exportToCSV(filteredPromotions, columns, 'promotion-campaigns');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="w-4 h-4 text-green-400" />;
      case 'paused':
        return <PauseCircle className="w-4 h-4 text-yellow-400" />;
      case 'stopped':
        return <StopCircle className="w-4 h-4 text-red-400" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
      case 'pending_approval':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'stopped':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'expired':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'pending_approval':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Calculate summary statistics
  const totalPromotions = promotions.length;
  const activePromotions = promotions.filter(p => p.status === 'active').length;
  const totalUses = promotions.reduce((sum, p) => sum + p.totalUses, 0);
  const totalRevenue = promotions.reduce((sum, p) => sum + p.totalRevenue, 0);
  const avgConversionRate = promotions.length > 0 
    ? promotions.reduce((sum, p) => sum + p.conversionRate, 0) / promotions.length 
    : 0;
  const totalImpressions = promotions.reduce((sum, p) => sum + p.impressions, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Campaigns"
          value={totalPromotions}
          previousValue={totalPromotions - 4}
          icon={Target}
          color="violet"
          realTimeUpdate={true}
          target={50}
        />
        
        <MetricsCard
          title="Active Campaigns"
          value={activePromotions}
          previousValue={activePromotions - 2}
          icon={PlayCircle}
          color="green"
          realTimeUpdate={true}
        />
        
        <MetricsCard
          title="Total Revenue"
          value={totalRevenue}
          previousValue={totalRevenue - 12000}
          icon={DollarSign}
          color="emerald"
          format="currency"
          realTimeUpdate={true}
          target={1000000}
        />
        
        <MetricsCard
          title="Avg Conversion"
          value={avgConversionRate}
          previousValue={avgConversionRate - 0.5}
          icon={TrendingUp}
          color="blue"
          format="percentage"
          realTimeUpdate={true}
          target={15}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Campaign Performance"
          data={[
            { date: '2024-01-01', revenue: 15000 },
            { date: '2024-01-02', revenue: 18500 },
            { date: '2024-01-03', revenue: 16200 },
            { date: '2024-01-04', revenue: 22000 },
            { date: '2024-01-05', revenue: 25800 },
            { date: '2024-01-06', revenue: 23400 },
            { date: '2024-01-07', revenue: 28900 }
          ]}
          type="bar"
          dataKey="revenue"
          color="#10b981"
          height={250}
        />
        
        <AnalyticsChart
          title="Campaign Status Distribution"
          data={[
            { name: 'Active', value: activePromotions },
            { name: 'Paused', value: promotions.filter(p => p.status === 'paused').length },
            { name: 'Scheduled', value: promotions.filter(p => p.status === 'scheduled').length },
            { name: 'Expired', value: promotions.filter(p => p.status === 'expired').length }
          ]}
          type="pie"
          dataKey="value"
          height={250}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
              <option value="pending_approval">Pending Approval</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="shipping">Free Shipping</option>
              <option value="bogo">BOGO</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Bulk Actions */}
          {selectedPromotions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                Activate ({selectedPromotions.length})
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Deactivate ({selectedPromotions.length})
              </button>
              <button
                onClick={() => handleBulkAction('pause')}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
              >
                Pause ({selectedPromotions.length})
              </button>
              <button
                onClick={() => handleBulkAction('schedule')}
                className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm"
              >
                Schedule ({selectedPromotions.length})
              </button>
              <button
                onClick={() => handleBulkAction('duplicate')}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Duplicate ({selectedPromotions.length})
              </button>
              <button
                onClick={() => handleBulkAction('extend')}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                Extend ({selectedPromotions.length})
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
              >
                Export Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors text-sm"
              >
                Delete ({selectedPromotions.length})
              </button>
            </div>
          )}

          {/* Export */}
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          {/* Create Campaign */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-violet-400 animate-spin" />
            <span className="ml-2 text-slate-400">Loading campaigns...</span>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No promotion campaigns found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Create your first promotion campaign to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && priorityFilter === 'all' && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPromotions.length === filteredPromotions.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPromotions(filteredPromotions.map(p => p.id));
                        } else {
                          setSelectedPromotions([]);
                        }
                      }}
                      className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Performance</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Schedule</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPromotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPromotions.includes(promotion.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPromotions(prev => [...prev, promotion.id]);
                          } else {
                            setSelectedPromotions(prev => prev.filter(id => id !== promotion.id));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{promotion.name}</div>
                        <div className="text-sm text-slate-400 mt-1">{promotion.description}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="px-2 py-1 bg-slate-700 rounded text-violet-400 font-mono text-xs">
                            {promotion.code}
                          </code>
                          <button
                            onClick={() => handleCopyPromotionCode(promotion.code)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {promotion.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {promotion.tags.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                              +{promotion.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(promotion.status)}`}>
                        {getStatusIcon(promotion.status)}
                        <span className="ml-1 capitalize">{promotion.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(promotion.priority)}`}>
                        <span className="capitalize">{promotion.priority}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {promotion.discountType === 'fixed' ? (
                          <DollarSign className="w-4 h-4 text-emerald-400 mr-1" />
                        ) : promotion.discountType === 'percentage' ? (
                          <Percent className="w-4 h-4 text-blue-400 mr-1" />
                        ) : promotion.discountType === 'shipping' ? (
                          <Zap className="w-4 h-4 text-yellow-400 mr-1" />
                        ) : (
                          <Award className="w-4 h-4 text-purple-400 mr-1" />
                        )}
                        <span className="text-white font-medium">
                          {promotion.discountType === 'fixed' ? `$${promotion.discountValue}` : 
                           promotion.discountType === 'percentage' ? `${promotion.discountValue}%` :
                           promotion.discountType === 'shipping' ? 'Free Ship' : 'BOGO'}
                        </span>
                      </div>
                      {promotion.maximumDiscount && promotion.discountType === 'percentage' && (
                        <div className="text-xs text-slate-400 mt-1">
                          Max: ${promotion.maximumDiscount}
                        </div>
                      )}
                      {promotion.minimumOrderValue > 0 && (
                        <div className="text-xs text-slate-400 mt-1">
                          Min: ${promotion.minimumOrderValue}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <ShoppingCart className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">{promotion.totalUses.toLocaleString()}</span>
                          <span className="text-slate-400 ml-1">uses</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">${promotion.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <BarChart3 className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">{promotion.conversionRate}%</span>
                          <span className="text-slate-400 ml-1">CVR</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Activity className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">{promotion.clickThroughRate}%</span>
                          <span className="text-slate-400 ml-1">CTR</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-white">{new Date(promotion.startDate).toLocaleDateString()}</div>
                        <div className="text-slate-400">to {new Date(promotion.endDate).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {promotion.channels.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === promotion.id ? null : promotion.id)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {showDropdown === promotion.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => {
                                setEditingPromotion(promotion);
                                setShowModal(true);
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Campaign
                            </button>
                            
                            {promotion.status === 'pending_approval' && (
                              <button
                                onClick={() => {
                                  handlePromotionAction(promotion.id, 'approve');
                                  setShowDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </button>
                            )}
                            
                            {promotion.status === 'scheduled' && (
                              <button
                                onClick={() => {
                                  handlePromotionAction(promotion.id, 'activate');
                                  setShowDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                              >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Activate Now
                              </button>
                            )}
                            
                            {promotion.status === 'active' && (
                              <button
                                onClick={() => {
                                  handlePromotionAction(promotion.id, 'pause');
                                  setShowDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                              >
                                <PauseCircle className="w-4 h-4 mr-2" />
                                Pause Campaign
                              </button>
                            )}
                            
                            {promotion.status === 'paused' && (
                              <button
                                onClick={() => {
                                  handlePromotionAction(promotion.id, 'activate');
                                  setShowDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                              >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Resume Campaign
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                handleCopyPromotionCode(promotion.code);
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Code
                            </button>
                            
                            <button
                              onClick={() => {
                                // Handle view analytics
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Analytics
                            </button>
                            
                            <button
                              onClick={() => {
                                handleDeletePromotion(promotion.id);
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-slate-600 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Campaign
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <PromotionCodeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPromotion(null);
        }}
        onSave={editingPromotion ? handleEditPromotion : handleCreatePromotion}
        editData={editingPromotion}
      />
    </div>
  );
};

export default PromotionCodeSection;