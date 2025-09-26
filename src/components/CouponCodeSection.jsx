import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Gift,
  Percent,
  Calendar,
  Users,
  Copy,
  Pause,
  Play,
  RotateCcw,
  Hash,
  ShoppingCart
} from 'lucide-react';
import CouponCodeModal from './CouponCodeModal';
import { AnalyticsChart } from './AnalyticsChart';
import { MetricsCard } from './MetricsCard';
import { exportToCSV, exportToJSON, exportToExcel, exportAnalyticsReport } from '../utils/exportUtils';

const CouponCodeSection = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  // Mock data - replace with actual API calls
  const mockCoupons = [
    {
      id: 1,
      code: 'SUMMER25',
      name: 'Summer Sale 2024',
      description: '25% off on all summer items',
      discountType: 'percentage',
      discountValue: 25,
      minimumOrderValue: 50,
      maximumDiscount: 100,
      usageLimit: 1000,
      usagePerUser: 1,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      status: 'active',
      applicableProducts: 'categories',
      userRestrictions: 'all',
      stackable: false,
      totalUses: 234,
      totalRevenue: 12450,
      conversionRate: 15.6,
      createdAt: '2024-05-15'
    },
    {
      id: 2,
      code: 'NEWUSER50',
      name: 'New User Welcome',
      description: '$50 off for first-time customers',
      discountType: 'fixed',
      discountValue: 50,
      minimumOrderValue: 100,
      maximumDiscount: null,
      usageLimit: null,
      usagePerUser: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      applicableProducts: 'all',
      userRestrictions: 'new_users',
      stackable: true,
      totalUses: 567,
      totalRevenue: 28350,
      conversionRate: 22.3,
      createdAt: '2023-12-20'
    },
    {
      id: 3,
      code: 'FLASH10',
      name: 'Flash Sale',
      description: '10% off flash sale items',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrderValue: 0,
      maximumDiscount: 50,
      usageLimit: 500,
      usagePerUser: 2,
      startDate: '2024-03-01',
      endDate: '2024-03-07',
      status: 'expired',
      applicableProducts: 'specific',
      userRestrictions: 'all',
      stackable: false,
      totalUses: 489,
      totalRevenue: 8920,
      conversionRate: 18.2,
      createdAt: '2024-02-25'
    },
    {
      id: 4,
      code: 'PREMIUM20',
      name: 'Premium Member Discount',
      description: '20% off for premium members',
      discountType: 'percentage',
      discountValue: 20,
      minimumOrderValue: 75,
      maximumDiscount: 200,
      usageLimit: 200,
      usagePerUser: 3,
      startDate: '2024-07-01',
      endDate: '2024-07-31',
      status: 'scheduled',
      applicableProducts: 'all',
      userRestrictions: 'existing_users',
      stackable: true,
      totalUses: 0,
      totalRevenue: 0,
      conversionRate: 0,
      createdAt: '2024-06-15'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCoupons(mockCoupons);
      setFilteredCoupons(mockCoupons);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = coupons;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(coupon => coupon.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(coupon => coupon.discountType === typeFilter);
    }

    setFilteredCoupons(filtered);
  }, [coupons, searchTerm, statusFilter, typeFilter]);

  const handleCreateCoupon = async (couponData) => {
    try {
      // Simulate API call
      const newCoupon = {
        ...couponData,
        id: Date.now(),
        totalUses: 0,
        totalRevenue: 0,
        conversionRate: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setCoupons(prev => [newCoupon, ...prev]);
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const handleEditCoupon = async (couponData) => {
    try {
      // Simulate API call
      setCoupons(prev => prev.map(coupon => 
        coupon.id === editingCoupon.id 
          ? { ...coupon, ...couponData }
          : coupon
      ));
      setEditingCoupon(null);
    } catch (error) {
      console.error('Error updating coupon:', error);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon code?')) {
      try {
        // Simulate API call
        setCoupons(prev => prev.filter(coupon => coupon.id !== couponId));
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const handleCopyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const handleBulkAction = async (action) => {
    if (selectedCoupons.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          setCoupons(prev => prev.map(coupon => 
            selectedCoupons.includes(coupon.id) 
              ? { ...coupon, status: 'active' }
              : coupon
          ));
          break;
        case 'deactivate':
          setCoupons(prev => prev.map(coupon => 
            selectedCoupons.includes(coupon.id) 
              ? { ...coupon, status: 'inactive' }
              : coupon
          ));
          break;
        case 'pause':
          setCoupons(prev => prev.map(coupon => 
            selectedCoupons.includes(coupon.id) 
              ? { ...coupon, status: 'paused' }
              : coupon
          ));
          break;
        case 'duplicate':
          const couponsToDuplicate = coupons.filter(coupon => selectedCoupons.includes(coupon.id));
          const duplicatedCoupons = couponsToDuplicate.map(coupon => ({
            ...coupon,
            id: Date.now() + Math.random(),
            code: `${coupon.code}_COPY`,
            status: 'draft',
            usageCount: 0,
            createdAt: new Date().toISOString().split('T')[0]
          }));
          setCoupons(prev => [...duplicatedCoupons, ...prev]);
          break;
        case 'export':
          handleExportSelected();
          break;
        case 'extend':
          const extendDate = new Date();
          extendDate.setMonth(extendDate.getMonth() + 1);
          setCoupons(prev => prev.map(coupon => 
            selectedCoupons.includes(coupon.id) 
              ? { ...coupon, expiryDate: extendDate.toISOString().split('T')[0] }
              : coupon
          ));
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedCoupons.length} coupons?`)) {
            setCoupons(prev => prev.filter(coupon => !selectedCoupons.includes(coupon.id)));
          }
          break;
      }
      setSelectedCoupons([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleExportSelected = () => {
    const selectedData = coupons.filter(coupon => selectedCoupons.includes(coupon.id));
    const columns = [
      { key: 'code', label: 'Code' },
      { key: 'type', label: 'Type' },
      { key: 'value', label: 'Value' },
      { key: 'status', label: 'Status' },
      { key: 'usageCount', label: 'Usage Count' },
      { key: 'usageLimit', label: 'Usage Limit', format: (value) => value || 'Unlimited' },
      { key: 'expiryDate', label: 'Expiry Date' },
      { key: 'createdAt', label: 'Created At' }
    ];
    
    exportToCSV(selectedData, columns, `selected-coupon-codes-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExport = () => {
    const columns = [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'discountType', label: 'Type' },
      { key: 'discountValue', label: 'Value', format: (value, item) => 
        item.discountType === 'fixed' ? `$${value}` : `${value}%` },
      { key: 'status', label: 'Status' },
      { key: 'totalUses', label: 'Total Uses' },
      { key: 'totalRevenue', label: 'Revenue', format: (value) => `$${value}` },
      { key: 'conversionRate', label: 'Conversion Rate', format: (value) => `${value}%` },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date' }
    ];

    // Show export options
    const exportFormat = prompt('Choose export format:\n1. CSV\n2. JSON\n3. Excel\n4. Analytics Report\n\nEnter number (1-4):', '1');
    
    switch (exportFormat) {
      case '1':
        exportToCSV(filteredCoupons, columns, 'coupon-codes');
        break;
      case '2':
        exportToJSON(filteredCoupons, 'coupon-codes');
        break;
      case '3':
        exportToExcel(filteredCoupons, columns, 'coupon-codes');
        break;
      case '4':
        const analyticsData = {
          summary: {
            totalCoupons: coupons.length,
            activeCoupons: coupons.filter(c => c.status === 'active').length,
            totalUses: coupons.reduce((sum, c) => sum + c.totalUses, 0),
            totalRevenue: coupons.reduce((sum, c) => sum + c.totalRevenue, 0),
            averageConversionRate: coupons.reduce((sum, c) => sum + c.conversionRate, 0) / coupons.length
          },
          coupons: filteredCoupons
        };
        exportAnalyticsReport(analyticsData, 'coupon-codes-analytics');
        break;
      default:
        exportToCSV(filteredCoupons, columns, 'coupon-codes');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'scheduled':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Calculate summary statistics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalUses = coupons.reduce((sum, c) => sum + c.totalUses, 0);
  const totalRevenue = coupons.reduce((sum, c) => sum + c.totalRevenue, 0);
  const avgConversionRate = coupons.length > 0 
    ? coupons.reduce((sum, c) => sum + c.conversionRate, 0) / coupons.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Coupons"
          value={totalCoupons}
          previousValue={totalCoupons - 3}
          icon={Hash}
          color="violet"
          realTimeUpdate={true}
          target={100}
        />
        
        <MetricsCard
          title="Active Coupons"
          value={activeCoupons}
          previousValue={activeCoupons - 2}
          icon={CheckCircle}
          color="green"
          realTimeUpdate={true}
        />
        
        <MetricsCard
          title="Total Uses"
          value={totalUses}
          previousValue={totalUses - 250}
          icon={ShoppingCart}
          color="blue"
          realTimeUpdate={true}
          target={50000}
        />
        
        <MetricsCard
          title="Total Revenue"
          value={totalRevenue}
          previousValue={totalRevenue - 8000}
          icon={DollarSign}
          color="emerald"
          format="currency"
          realTimeUpdate={true}
          target={500000}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Coupon Usage Trends"
          data={[
            { date: '2024-01-01', usage: 850 },
            { date: '2024-01-02', usage: 920 },
            { date: '2024-01-03', usage: 780 },
            { date: '2024-01-04', usage: 1100 },
            { date: '2024-01-05', usage: 1250 },
            { date: '2024-01-06', usage: 1180 },
            { date: '2024-01-07', usage: 1350 }
          ]}
          type="line"
          dataKey="usage"
          color="#8b5cf6"
          height={250}
        />
        
        <AnalyticsChart
          title="Coupon Types Performance"
          data={[
            { name: 'Percentage', value: 40 },
            { name: 'Fixed Amount', value: 35 },
            { name: 'Free Shipping', value: 15 },
            { name: 'BOGO', value: 10 }
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
              placeholder="Search coupons..."
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
              <option value="inactive">Inactive</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Bulk Actions */}
          {selectedCoupons.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                Activate ({selectedCoupons.length})
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Deactivate ({selectedCoupons.length})
              </button>
              <button
                onClick={() => handleBulkAction('pause')}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
              >
                Pause ({selectedCoupons.length})
              </button>
              <button
                onClick={() => handleBulkAction('duplicate')}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Duplicate ({selectedCoupons.length})
              </button>
              <button
                onClick={() => handleBulkAction('extend')}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                Extend ({selectedCoupons.length})
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
                Delete ({selectedCoupons.length})
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

          {/* Create Coupon */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-violet-400 animate-spin" />
            <span className="ml-2 text-slate-400">Loading coupons...</span>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <Hash className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No coupon codes found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Create your first coupon code to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Coupon
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
                      checked={selectedCoupons.length === filteredCoupons.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCoupons(filteredCoupons.map(c => c.id));
                        } else {
                          setSelectedCoupons([]);
                        }
                      }}
                      className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Details</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Performance</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Validity</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCoupons.includes(coupon.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCoupons(prev => [...prev, coupon.id]);
                          } else {
                            setSelectedCoupons(prev => prev.filter(id => id !== coupon.id));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-slate-700 rounded text-violet-400 font-mono text-sm">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => handleCopyCouponCode(coupon.code)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                          title="Copy code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{coupon.name}</div>
                        <div className="text-sm text-slate-400 mt-1">{coupon.description}</div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          {coupon.usageLimit && (
                            <span>Limit: {coupon.usageLimit}</span>
                          )}
                          {coupon.minimumOrderValue > 0 && (
                            <span>Min: ${coupon.minimumOrderValue}</span>
                          )}
                          {coupon.stackable && (
                            <span className="text-green-400">Stackable</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(coupon.status)}`}>
                        {getStatusIcon(coupon.status)}
                        <span className="ml-1 capitalize">{coupon.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {coupon.discountType === 'fixed' ? (
                          <DollarSign className="w-4 h-4 text-emerald-400 mr-1" />
                        ) : (
                          <Percent className="w-4 h-4 text-blue-400 mr-1" />
                        )}
                        <span className="text-white font-medium">
                          {coupon.discountType === 'fixed' ? `$${coupon.discountValue}` : `${coupon.discountValue}%`}
                        </span>
                      </div>
                      {coupon.maximumDiscount && coupon.discountType === 'percentage' && (
                        <div className="text-xs text-slate-400 mt-1">
                          Max: ${coupon.maximumDiscount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <ShoppingCart className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">{coupon.totalUses}</span>
                          <span className="text-slate-400 ml-1">uses</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">${coupon.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <BarChart3 className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">{coupon.conversionRate}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-white">{new Date(coupon.startDate).toLocaleDateString()}</div>
                        <div className="text-slate-400">to {new Date(coupon.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === coupon.id ? null : coupon.id)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {showDropdown === coupon.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => {
                                setEditingCoupon(coupon);
                                setShowModal(true);
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Coupon
                            </button>
                            <button
                              onClick={() => {
                                handleCopyCouponCode(coupon.code);
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
                                handleDeleteCoupon(coupon.id);
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-slate-600 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Coupon
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
      <CouponCodeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCoupon(null);
        }}
        onSave={editingCoupon ? handleEditCoupon : handleCreateCoupon}
        editData={editingCoupon}
      />
    </div>
  );
};

export default CouponCodeSection;