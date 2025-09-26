import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Filter, 
  Calendar, 
  Clock, 
  Mail, 
  MessageCircle, 
  Linkedin,
  User,
  Eye,
  Edit3,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const UpcomingOutreachTable = ({ outreachData, userRole, currentUser }) => {
  const [sortField, setSortField] = useState('scheduledDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedOutreach, setSelectedOutreach] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Role-based permissions
  const canEdit = userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'Business Owner';
  const canDelete = userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'Business Owner';

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredData = useMemo(() => {
    let filtered = [...outreachData];

    // Apply filters
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    if (typeFilter) {
      filtered = filtered.filter(item => item.templateType === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date/time sorting
      if (sortField === 'scheduledDate') {
        aValue = new Date(`${a.scheduledDate} ${a.scheduledTime}`);
        bValue = new Date(`${b.scheduledDate} ${b.scheduledTime}`);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [outreachData, sortField, sortDirection, statusFilter, typeFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Scheduled':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'LinkedIn':
        return <Linkedin className="w-4 h-4 text-blue-700" />;
      case 'WhatsApp':
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date} ${time}`);
    return {
      date: dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const handleViewDetails = (outreach) => {
    setSelectedOutreach(outreach);
    setShowDetails(true);
  };

  const handleEdit = (outreach) => {
    // In a real app, this would open the composer with the outreach data
    alert(`Edit outreach for ${outreach.contactName}`);
  };

  const handleDelete = (outreach) => {
    if (window.confirm(`Are you sure you want to delete the outreach for ${outreach.contactName}?`)) {
      // In a real app, this would delete the outreach
      alert(`Outreach for ${outreach.contactName} deleted`);
    }
  };

  const handleMarkAsSent = (outreach) => {
    // In a real app, this would update the status
    alert(`Marked outreach for ${outreach.contactName} as sent`);
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-900 hover:text-gray-700"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  if (outreachData.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming outreach</h3>
        <p className="text-gray-500">
          Schedule some outreach to see them here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Sent">Sent</option>
                <option value="Failed">Failed</option>
                <option value="Scheduled">Scheduled</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Email">Email</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
              
              {(statusFilter || typeFilter) && (
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setTypeFilter('');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="contactName">Contact</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="templateName">Template</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="scheduledDate">Scheduled</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="status">Status</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton field="assignedTo">Assigned To</SortButton>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredData.map((outreach) => {
                const { date, time } = formatDateTime(outreach.scheduledDate, outreach.scheduledTime);
                
                return (
                  <tr key={outreach.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {outreach.contactName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {outreach.contactEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(outreach.templateType)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {outreach.templateName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {outreach.templateType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(outreach.status)}`}>
                        {getStatusIcon(outreach.status)}
                        {outreach.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {outreach.assignedTo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative group">
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <button
                            onClick={() => handleViewDetails(outreach)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleEdit(outreach)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                          )}
                          {outreach.status === 'Pending' && (
                            <button
                              onClick={() => handleMarkAsSent(outreach)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark as Sent
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(outreach)}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {sortedAndFilteredData.length} of {outreachData.length} outreach items
            </div>
            <div className="text-sm text-gray-500">
              {sortedAndFilteredData.filter(item => item.status === 'Pending').length} pending, {' '}
              {sortedAndFilteredData.filter(item => item.status === 'Sent').length} sent
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedOutreach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Outreach Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <p className="text-sm text-gray-900">{selectedOutreach.contactName}</p>
                    <p className="text-sm text-gray-500">{selectedOutreach.contactEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Template</label>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(selectedOutreach.templateType)}
                      <span className="text-sm text-gray-900">{selectedOutreach.templateName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scheduled</label>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(selectedOutreach.scheduledDate, selectedOutreach.scheduledTime).date} at {' '}
                      {formatDateTime(selectedOutreach.scheduledDate, selectedOutreach.scheduledTime).time}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedOutreach.status)}`}>
                      {getStatusIcon(selectedOutreach.status)}
                      {selectedOutreach.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                    <p className="text-sm text-gray-900">{selectedOutreach.assignedTo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedOutreach.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {selectedOutreach.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedOutreach.notes}
                    </p>
                  </div>
                )}
                
                {selectedOutreach.sentAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sent At</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedOutreach.sentAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              {canEdit && (
                <button
                  onClick={() => {
                    setShowDetails(false);
                    handleEdit(selectedOutreach);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingOutreachTable;