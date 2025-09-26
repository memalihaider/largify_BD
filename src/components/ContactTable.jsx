import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { contactStatuses } from '../data/mockContacts';

const ContactTable = ({ 
  contacts, 
  sortConfig, 
  onSort, 
  onEdit, 
  onDelete, 
  canManage 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Pagination
  const totalPages = Math.ceil(contacts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedContacts = contacts.slice(startIndex, endIndex);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="h-4 w-4 text-slate-500" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-violet-400" />
      : <ChevronDown className="h-4 w-4 text-violet-400" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = contactStatuses.find(s => s.value === status);
    if (!statusConfig) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusConfig.color}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleActionClick = (contactId) => {
    setActionMenuOpen(actionMenuOpen === contactId ? null : contactId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setActionMenuOpen(null);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setActionMenuOpen(null);
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors duration-200"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors duration-200"
                onClick={() => onSort('email')}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  {getSortIcon('email')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors duration-200"
                onClick={() => onSort('phone')}
              >
                <div className="flex items-center space-x-1">
                  <span>Phone</span>
                  {getSortIcon('phone')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors duration-200"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors duration-200"
                onClick={() => onSort('source')}
              >
                <div className="flex items-center space-x-1">
                  <span>Source</span>
                  {getSortIcon('source')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors duration-200"
                onClick={() => onSort('lastContacted')}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Contacted</span>
                  {getSortIcon('lastContacted')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {paginatedContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">{contact.name}</div>
                    <div className="text-sm text-slate-400">{contact.company}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-slate-400 mr-2" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-sm text-violet-400 hover:text-violet-300 transition-colors duration-200"
                    >
                      {contact.email}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-slate-400 mr-2" />
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-sm text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(contact.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {contact.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {formatDate(contact.lastContacted)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => handleActionClick(contact.id)}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-600 transition-colors duration-200"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {actionMenuOpen === contact.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActionMenuOpen(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-20">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                window.open(`mailto:${contact.email}`, '_blank');
                                setActionMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 transition-colors duration-200 flex items-center"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </button>
                            <button
                              onClick={() => {
                                window.open(`tel:${contact.phone}`, '_blank');
                                setActionMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 transition-colors duration-200 flex items-center"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </button>
                            {canManage && (
                              <>
                                <button
                                  onClick={() => {
                                    onEdit(contact);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 transition-colors duration-200 flex items-center"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    onDelete(contact.id);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-600 transition-colors duration-200 flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {contacts.length > 0 && (
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-t border-slate-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-slate-400">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, contacts.length)}</span> of{' '}
                <span className="font-medium">{contacts.length}</span> results
              </p>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-600 bg-slate-800 text-sm font-medium text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNumber
                          ? 'z-10 bg-violet-600 border-violet-600 text-white'
                          : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-600 bg-slate-800 text-sm font-medium text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {contacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No contacts found</div>
          <div className="text-slate-500 text-sm">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
};

export default ContactTable;