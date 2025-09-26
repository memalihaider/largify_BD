import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { AnalyticsChart } from './AnalyticsChart';
import { MetricsCard } from './MetricsCard';
import { exportToCSV, exportToJSON, exportToExcel, exportAnalyticsReport } from '../utils/exportUtils';
import ReferralProgramModal from './ReferralProgramModal';

const ReferralProgramSection = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  // Mock data - replace with actual API calls
  const mockPrograms = [
    {
      id: 1,
      campaignName: 'Summer Referral Boost',
      description: 'Get $25 for every friend you refer during summer',
      rewardType: 'fixed',
      rewardValue: 25,
      threshold: 1,
      maxRewards: 10,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      status: 'active',
      totalReferrals: 156,
      successfulReferrals: 89,
      totalRewards: 2225,
      conversionRate: 57.1,
      targetAudience: 'all',
      createdAt: '2024-05-15'
    },
    {
      id: 2,
      campaignName: 'Premium User Referral',
      description: '20% discount for premium referrals',
      rewardType: 'percentage',
      rewardValue: 20,
      threshold: 2,
      maxRewards: null,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      totalReferrals: 234,
      successfulReferrals: 145,
      totalRewards: 1890,
      conversionRate: 62.0,
      targetAudience: 'existing_users',
      createdAt: '2023-12-20'
    },
    {
      id: 3,
      campaignName: 'New Year Special',
      description: 'Limited time $50 referral bonus',
      rewardType: 'fixed',
      rewardValue: 50,
      threshold: 1,
      maxRewards: 100,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'completed',
      totalReferrals: 89,
      successfulReferrals: 67,
      totalRewards: 3350,
      conversionRate: 75.3,
      targetAudience: 'new_users',
      createdAt: '2023-12-15'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPrograms(mockPrograms);
      setFilteredPrograms(mockPrograms);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = programs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(program =>
        program.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(program => program.status === statusFilter);
    }

    setFilteredPrograms(filtered);
  }, [programs, searchTerm, statusFilter]);

  const handleCreateProgram = async (programData) => {
    try {
      // Simulate API call
      const newProgram = {
        ...programData,
        id: Date.now(),
        totalReferrals: 0,
        successfulReferrals: 0,
        totalRewards: 0,
        conversionRate: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setPrograms(prev => [newProgram, ...prev]);
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  const handleEditProgram = async (programData) => {
    try {
      // Simulate API call
      setPrograms(prev => prev.map(program => 
        program.id === editingProgram.id 
          ? { ...program, ...programData }
          : program
      ));
      setEditingProgram(null);
    } catch (error) {
      console.error('Error updating program:', error);
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (window.confirm('Are you sure you want to delete this referral program?')) {
      try {
        // Simulate API call
        setPrograms(prev => prev.filter(program => program.id !== programId));
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedPrograms.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          setPrograms(prev => prev.map(program => 
            selectedPrograms.includes(program.id) 
              ? { ...program, status: 'active' }
              : program
          ));
          break;
        case 'deactivate':
          setPrograms(prev => prev.map(program => 
            selectedPrograms.includes(program.id) 
              ? { ...program, status: 'inactive' }
              : program
          ));
          break;
        case 'pause':
          setPrograms(prev => prev.map(program => 
            selectedPrograms.includes(program.id) 
              ? { ...program, status: 'paused' }
              : program
          ));
          break;
        case 'duplicate':
          const programsToDuplicate = programs.filter(program => selectedPrograms.includes(program.id));
          const duplicatedPrograms = programsToDuplicate.map(program => ({
            ...program,
            id: Date.now() + Math.random(),
            campaignName: `${program.campaignName} (Copy)`,
            status: 'draft',
            totalReferrals: 0,
            successfulReferrals: 0,
            totalRewards: 0,
            conversionRate: 0,
            createdAt: new Date().toISOString().split('T')[0]
          }));
          setPrograms(prev => [...duplicatedPrograms, ...prev]);
          break;
        case 'export':
          handleExportSelected();
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedPrograms.length} programs?`)) {
            setPrograms(prev => prev.filter(program => !selectedPrograms.includes(program.id)));
          }
          break;
      }
      setSelectedPrograms([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleExportSelected = () => {
    const selectedData = programs.filter(program => selectedPrograms.includes(program.id));
    const columns = [
      { key: 'campaignName', label: 'Campaign Name' },
      { key: 'status', label: 'Status' },
      { key: 'rewardType', label: 'Reward Type' },
      { key: 'rewardValue', label: 'Reward Value' },
      { key: 'totalReferrals', label: 'Total Referrals' },
      { key: 'successfulReferrals', label: 'Successful Referrals' },
      { key: 'conversionRate', label: 'Conversion Rate', format: (value) => `${value}%` },
      { key: 'totalRewards', label: 'Total Rewards', format: (value) => `$${value}` }
    ];
    
    exportToCSV(selectedData, columns, `selected-referral-programs-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExport = () => {
    const columns = [
      { key: 'campaignName', label: 'Campaign Name' },
      { key: 'status', label: 'Status' },
      { key: 'rewardType', label: 'Reward Type' },
      { key: 'rewardValue', label: 'Reward Value' },
      { key: 'totalReferrals', label: 'Total Referrals' },
      { key: 'successfulReferrals', label: 'Successful Referrals' },
      { key: 'conversionRate', label: 'Conversion Rate', format: (value) => `${value}%` },
      { key: 'totalRewards', label: 'Total Rewards', format: (value) => `$${value}` }
    ];

    // Show export options
    const exportFormat = prompt('Choose export format:\n1. CSV\n2. JSON\n3. Excel\n4. Analytics Report\n\nEnter number (1-4):', '1');
    
    switch (exportFormat) {
      case '1':
        exportToCSV(filteredPrograms, columns, 'referral-programs');
        break;
      case '2':
        exportToJSON(filteredPrograms, 'referral-programs');
        break;
      case '3':
        exportToExcel(filteredPrograms, columns, 'referral-programs');
        break;
      case '4':
        const analyticsData = {
          summary: {
            totalPrograms: programs.length,
            activePrograms: programs.filter(p => p.status === 'active').length,
            totalReferrals: programs.reduce((sum, p) => sum + p.totalReferrals, 0),
            totalRewards: programs.reduce((sum, p) => sum + p.totalRewards, 0)
          },
          programs: filteredPrograms
        };
        exportAnalyticsReport(analyticsData, 'referral-programs-analytics');
        break;
      default:
        exportToCSV(filteredPrograms, columns, 'referral-programs');
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
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
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
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Calculate summary statistics
  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.status === 'active').length;
  const totalReferrals = programs.reduce((sum, p) => sum + p.totalReferrals, 0);
  const totalRewards = programs.reduce((sum, p) => sum + p.totalRewards, 0);
  const avgConversionRate = programs.length > 0 
    ? programs.reduce((sum, p) => sum + p.conversionRate, 0) / programs.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Programs"
          value={totalPrograms}
          previousValue={totalPrograms - 2}
          icon={Target}
          color="violet"
          realTimeUpdate={true}
          target={50}
        />
        
        <MetricsCard
          title="Active Programs"
          value={activePrograms}
          previousValue={activePrograms - 1}
          icon={CheckCircle}
          color="green"
          realTimeUpdate={true}
        />
        
        <MetricsCard
          title="Total Referrals"
          value={totalReferrals}
          previousValue={totalReferrals - 150}
          icon={Users}
          color="blue"
          realTimeUpdate={true}
          target={10000}
        />
        
        <MetricsCard
          title="Total Rewards"
          value={totalRewards}
          previousValue={totalRewards - 5000}
          icon={DollarSign}
          color="emerald"
          format="currency"
          realTimeUpdate={true}
          target={100000}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Referral Trends"
          data={[
            { date: '2024-01-01', referrals: 120 },
            { date: '2024-01-02', referrals: 145 },
            { date: '2024-01-03', referrals: 132 },
            { date: '2024-01-04', referrals: 168 },
            { date: '2024-01-05', referrals: 189 },
            { date: '2024-01-06', referrals: 201 },
            { date: '2024-01-07', referrals: 225 }
          ]}
          type="area"
          dataKey="referrals"
          color="#06b6d4"
          height={250}
        />
        
        <AnalyticsChart
          title="Reward Distribution"
          data={[
            { name: 'Cash Rewards', value: 45 },
            { name: 'Discounts', value: 30 },
            { name: 'Credits', value: 15 },
            { name: 'Products', value: 10 }
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
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-2">
          {/* Bulk Actions */}
          {selectedPrograms.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                Activate ({selectedPrograms.length})
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Deactivate ({selectedPrograms.length})
              </button>
              <button
                onClick={() => handleBulkAction('pause')}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
              >
                Pause ({selectedPrograms.length})
              </button>
              <button
                onClick={() => handleBulkAction('duplicate')}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Duplicate ({selectedPrograms.length})
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
                Delete ({selectedPrograms.length})
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

          {/* Create Program */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Program
          </button>
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-violet-400 animate-spin" />
            <span className="ml-2 text-slate-400">Loading programs...</span>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No referral programs found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first referral program to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Program
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
                      checked={selectedPrograms.length === filteredPrograms.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPrograms(filteredPrograms.map(p => p.id));
                        } else {
                          setSelectedPrograms([]);
                        }
                      }}
                      className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Program</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Reward</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Performance</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Duration</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPrograms.includes(program.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrograms(prev => [...prev, program.id]);
                          } else {
                            setSelectedPrograms(prev => prev.filter(id => id !== program.id));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{program.campaignName}</div>
                        <div className="text-sm text-slate-400 mt-1">{program.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(program.status)}`}>
                        {getStatusIcon(program.status)}
                        <span className="ml-1 capitalize">{program.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {program.rewardType === 'fixed' ? `$${program.rewardValue}` : `${program.rewardValue}%`}
                      </div>
                      <div className="text-sm text-slate-400">
                        Threshold: {program.threshold} referral{program.threshold !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">{program.totalReferrals}</span>
                          <span className="text-slate-400 ml-1">referrals</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">{program.conversionRate}%</span>
                          <span className="text-slate-400 ml-1">conversion</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 text-slate-400 mr-1" />
                          <span className="text-white">${program.totalRewards}</span>
                          <span className="text-slate-400 ml-1">rewards</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-white">{new Date(program.startDate).toLocaleDateString()}</div>
                        <div className="text-slate-400">to {new Date(program.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === program.id ? null : program.id)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {showDropdown === program.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => {
                                setEditingProgram(program);
                                setShowModal(true);
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Program
                            </button>
                            <button
                              onClick={() => {
                                // Handle view details
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-600 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteProgram(program.id);
                                setShowDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-slate-600 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Program
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
      <ReferralProgramModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProgram(null);
        }}
        onSave={editingProgram ? handleEditProgram : handleCreateProgram}
        editData={editingProgram}
      />
    </div>
  );
};

export default ReferralProgramSection;