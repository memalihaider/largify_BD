import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Star,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { getUserRole, getCurrentUser, canAccessAdminFeatures, hasRole } from '../utils/auth';
import { mockLeadScoringData, mockKPIData, mockScoreDistribution, mockTeamMembers } from '../data/mockLeadScoring';
import LeadScoreChart from '../components/leadScoring/LeadScoreChart';
import LeadScoreTable from '../components/leadScoring/LeadScoreTable';
import LeadDetailModal from '../components/leadScoring/LeadDetailModal';

const LeadScoring = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Get user role and permissions
  const userRole = getUserRole();
  const currentUser = getCurrentUser();
  const canEditScores = canAccessAdminFeatures() || hasRole('Admin');
  const canAssignLeads = canAccessAdminFeatures() || hasRole('Team Member');
  const canViewAllLeads = canAccessAdminFeatures() || hasRole('Team Member');
  const [showFilters, setShowFilters] = useState(false);

  // Filter leads based on user role
  const getFilteredLeads = () => {
    let leads = mockLeadScoringData;
    
    // Role-based filtering
    if (userRole === 'Customer') {
      // Customers can only see their own lead information (if any)
      leads = leads.filter(lead => lead.email === currentUser?.email);
    } else if (userRole === 'Team Member') {
      // Team members can see leads assigned to them or unassigned leads
      leads = leads.filter(lead => 
        !lead.assignedTo || 
        lead.assignedTo === currentUser?.name ||
        lead.assignedTo === currentUser?.id
      );
    }
    // Admins and Super Admins can see all leads
    
    return leads;
  };

  // Filter and sort leads based on current filters
  const filteredAndSortedLeads = useMemo(() => {
    let filtered = getFilteredLeads().filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesScore = scoreFilter === 'all' || 
                          (scoreFilter === 'hot' && lead.leadScore >= 80) ||
                          (scoreFilter === 'warm' && lead.leadScore >= 60 && lead.leadScore < 80) ||
                          (scoreFilter === 'cold' && lead.leadScore < 60);
      
      const matchesStatus = statusFilter === 'all' || 
                           lead.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesScore && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'score':
          aValue = a.leadScore;
          bValue = b.leadScore;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'lastActivity':
          aValue = new Date(a.lastActivity);
          bValue = new Date(b.lastActivity);
          break;
        default:
          aValue = a.leadScore;
          bValue = b.leadScore;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, scoreFilter, statusFilter, sortBy, sortOrder]);

  const handleLeadClick = (lead) => {
    // Check if user has permission to view lead details
    if (userRole === 'Customer' && lead.email !== currentUser?.email) {
      return; // Customers can only view their own information
    }
    
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  const handleSaveLead = (updatedLead) => {
    // Only allow saving if user has permission
    if (!canEditScores && !canAssignLeads) {
      return;
    }
    
    // Save lead functionality would be implemented here
    setShowModal(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setScoreFilter('all');
    setStatusFilter('all');
    setSortBy('score');
    setSortOrder('desc');
  };

  return (
    <div className="p-6 space-y-6 dark-bg-primary min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark-text-primary">Lead Scoring Dashboard</h1>
          <p className="dark-text-secondary mt-1">AI-powered lead scoring and management</p>
        </div>
        {/* Action Buttons - Role-based visibility */}
        <div className="flex items-center gap-2">
          {canViewAllLeads && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 dark-btn-secondary rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dark-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium dark-text-secondary">Total Leads</p>
              <p className="text-3xl font-bold dark-text-primary mt-2">{mockKPIData.totalLeads}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm dark-text-muted">Active leads in pipeline</span>
          </div>
        </div>

        <div className="dark-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium dark-text-secondary">High-Score Leads</p>
              <p className="text-3xl font-bold dark-text-primary mt-2">{mockKPIData.highScoreLeads}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Star className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-400">Score ≥ 80</span>
          </div>
        </div>

        <div className="dark-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium dark-text-secondary">Conversion Rate</p>
              <p className="text-3xl font-bold dark-text-primary mt-2">{mockKPIData.conversionRate}%</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-400">+2.4% from last month</span>
          </div>
        </div>

        <div className="dark-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium dark-text-secondary">Average Score</p>
              <p className="text-3xl font-bold dark-text-primary mt-2">{mockKPIData.averageScore}</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-orange-400">+5.2% improvement</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="dark-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium dark-text-secondary mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark-text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 dark-input rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium dark-text-secondary mb-2">Score Range</label>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full px-3 py-2 dark-select rounded-lg"
              >
                <option value="all">All Scores</option>
                <option value="hot">Hot (80-100)</option>
                <option value="warm">Warm (60-79)</option>
                <option value="cold">Cold (0-59)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium dark-text-secondary mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 dark-select rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 dark-btn-secondary rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart and Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Score Distribution Chart */}
        <div className="lg:col-span-1">
          <LeadScoreChart data={mockScoreDistribution} />
        </div>

        {/* Lead Table */}
        <div className="lg:col-span-2">
          <LeadScoreTable
            leads={filteredAndSortedLeads}
            onLeadClick={handleLeadClick}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(field) => {
              if (sortBy === field) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy(field);
                setSortOrder('desc');
              }
            }}
          />
        </div>
      </div>

      {/* Lead Detail Modal */}
      {showModal && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={showModal}
          onClose={handleCloseModal}
          onSave={handleSaveLead}
          canEdit={canEditScores}
          canAssign={canAssignLeads}
          teamMembers={mockTeamMembers}
        />
      )}
    </div>
  );
};

export default LeadScoring;