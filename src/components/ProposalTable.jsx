import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const ProposalTable = ({ proposals, onProposalsUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'creationDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, proposalId: null, proposalTitle: '' });

  // Mock data for demonstration
  const mockProposals = [
    {
      id: 1,
      title: 'TechCorp - Technology Project',
      clientName: 'TechCorp Solutions',
      creationDate: '2024-01-15',
      status: 'Sent',
      industry: 'Technology',
      budgetRange: [25000, 50000]
    },
    {
      id: 2,
      title: 'HealthPlus - Healthcare Platform',
      clientName: 'HealthPlus Medical',
      creationDate: '2024-01-12',
      status: 'Draft',
      industry: 'Healthcare',
      budgetRange: [40000, 80000]
    },
    {
      id: 3,
      title: 'EduLearn - E-learning System',
      clientName: 'EduLearn Institute',
      creationDate: '2024-01-10',
      status: 'Accepted',
      industry: 'Education',
      budgetRange: [15000, 30000]
    },
    {
      id: 4,
      title: 'RetailMax - E-commerce Solution',
      clientName: 'RetailMax Inc',
      creationDate: '2024-01-08',
      status: 'Sent',
      industry: 'E-commerce',
      budgetRange: [35000, 70000]
    },
    {
      id: 5,
      title: 'FinanceFlow - Banking App',
      clientName: 'FinanceFlow Bank',
      creationDate: '2024-01-05',
      status: 'Draft',
      industry: 'Finance',
      budgetRange: [60000, 120000]
    }
  ];

  // Combine user proposals with mock data
  const allProposals = [...proposals, ...mockProposals];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Draft': { bg: 'bg-yellow-900/30', text: 'text-yellow-300', border: 'border-yellow-700' },
      'Sent': { bg: 'bg-blue-900/30', text: 'text-blue-300', border: 'border-blue-700' },
      'Accepted': { bg: 'bg-green-900/30', text: 'text-green-300', border: 'border-green-700' },
      'Rejected': { bg: 'bg-red-900/30', text: 'text-red-300', border: 'border-red-700' }
    };

    const config = statusConfig[status] || statusConfig['Draft'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter and sort proposals
  const filteredAndSortedProposals = useMemo(() => {
    let filtered = allProposals.filter(proposal => {
      const matchesSearch = 
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort proposals
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'creationDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [allProposals, searchTerm, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProposals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProposals = filteredAndSortedProposals.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-400" />
      : <ArrowDown className="h-4 w-4 text-blue-400" />;
  };

  const handleDeleteClick = (proposal) => {
    setDeleteModal({ 
      isOpen: true, 
      proposalId: proposal.id, 
      proposalTitle: proposal.title 
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.proposalId) {
      const updatedProposals = proposals.filter(p => p.id !== deleteModal.proposalId);
      onProposalsUpdate(updatedProposals);
      setDeleteModal({ isOpen: false, proposalId: null, proposalTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, proposalId: null, proposalTitle: '' });
  };

  const handleView = (proposal) => {
    // In a real app, this would navigate to a detailed view
    alert(`Viewing proposal: ${proposal.title}`);
  };

  const handleEdit = (proposal) => {
    // In a real app, this would open the proposal in edit mode
    alert(`Editing proposal: ${proposal.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {paginatedProposals.length} of {filteredAndSortedProposals.length} proposals
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-300 uppercase tracking-wider hover:text-white"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Proposal</span>
                    {getSortIcon('title')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('clientName')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-300 uppercase tracking-wider hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    <span>Client</span>
                    {getSortIcon('clientName')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('creationDate')}
                    className="flex items-center space-x-1 text-xs font-medium text-gray-300 uppercase tracking-wider hover:text-white"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                    {getSortIcon('creationDate')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Status</span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Budget</span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedProposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{proposal.title}</div>
                      <div className="text-sm text-gray-400">{proposal.industry}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{proposal.clientName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {new Date(proposal.creationDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(proposal.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {proposal.budgetRange ? 
                        `${formatCurrency(proposal.budgetRange[0])} - ${formatCurrency(proposal.budgetRange[1])}` :
                        'N/A'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(proposal)}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(proposal)}
                        className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(proposal)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedProposals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No proposals found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first proposal to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Proposal"
        message={`Are you sure you want to delete "${deleteModal.proposalTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
         onClose={handleDeleteCancel}
        type="danger"
      />
    </div>
  );
};

export default ProposalTable;