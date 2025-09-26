import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail
} from 'lucide-react';
import { mockContacts, contactStatuses, contactSources } from '../data/mockContacts';
import ContactTable from '../components/ContactTable';
import ContactKanban from '../components/ContactKanban';
import ContactFormModal from '../components/ContactFormModal';
import { getUserRole, getCurrentUser } from '../utils/auth';

const Contacts = () => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
  const [contacts, setContacts] = useState(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [sourceFilter, setSourceFilter] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const userRole = getUserRole();

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let filtered = [...contacts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.company.toLowerCase().includes(query) ||
        contact.notes.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(contact => statusFilter.includes(contact.status));
    }

    // Source filter
    if (sourceFilter.length > 0) {
      filtered = filtered.filter(contact => sourceFilter.includes(contact.source));
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(contact => {
        const contactDate = new Date(contact.lastContacted);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return contactDate >= startDate && contactDate <= endDate;
      });
    }

    // Role-based filtering
    if (userRole === 'Team Member') {
      // Team members can only see their assigned contacts
      const currentUser = getCurrentUser();
      const currentUserName = currentUser?.name || 'John Smith'; // Fallback for demo
      filtered = filtered.filter(contact => contact.assignedTo === currentUserName);
    } else if (userRole === 'Customer') {
      // Customers can only see contacts related to their account (read-only)
      const currentUser = getCurrentUser();
      filtered = filtered.filter(contact => contact.customerId === currentUser?.id);
    }

    return filtered;
  }, [contacts, searchQuery, statusFilter, sourceFilter, dateRange, userRole]);

  // Sort contacts
  const sortedContacts = useMemo(() => {
    if (!sortConfig.key) return filteredContacts;

    return [...filteredContacts].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredContacts, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowContactModal(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowContactModal(true);
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
    }
  };

  const handleSaveContact = (contactData) => {
    if (editingContact) {
      // Update existing contact
      setContacts(prev => prev.map(contact =>
        contact.id === editingContact.id
          ? { ...contact, ...contactData, id: editingContact.id }
          : contact
      ));
    } else {
      // Add new contact
      const currentUser = getCurrentUser();
      const newContact = {
        ...contactData,
        id: Math.max(...contacts.map(c => c.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0],
        assignedTo: currentUser?.name || 'John Smith', // Assign to current user
        customerId: userRole === 'Customer' ? currentUser?.id : null // Link to customer if applicable
      };
      setContacts(prev => [...prev, newContact]);
    }
    setShowContactModal(false);
    setEditingContact(null);
  };

  const handleStatusChange = (contactId, newStatus) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId
        ? { ...contact, status: newStatus, lastContacted: new Date().toISOString().split('T')[0] }
        : contact
    ));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setSourceFilter([]);
    setDateRange({ start: '', end: '' });
  };

  const canManageContacts = () => {
    return ['Super Admin', 'Admin', 'Business Owner'].includes(userRole);
  };

  const canAddContacts = () => {
    return ['Super Admin', 'Admin', 'Business Owner', 'Team Member'].includes(userRole);
  };

  const canViewAllContacts = () => {
    return ['Super Admin', 'Admin', 'Business Owner'].includes(userRole);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your contact database and track lead interactions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {canAddContacts() && (
            <button
              onClick={handleAddContact}
              className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-lg p-4 space-y-4">
        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                showFilters || statusFilter.length > 0 || sourceFilter.length > 0 || dateRange.start || dateRange.end
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'table'
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'kanban'
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <div className="space-y-2">
                {contactStatuses.map(status => (
                  <label key={status.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStatusFilter(prev => [...prev, status.value]);
                        } else {
                          setStatusFilter(prev => prev.filter(s => s !== status.value));
                        }
                      }}
                      className="rounded border-slate-600 text-violet-600 focus:ring-violet-500 focus:ring-offset-slate-800"
                    />
                    <span className="ml-2 text-sm text-slate-300">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Source</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {contactSources.map(source => (
                  <label key={source.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sourceFilter.includes(source.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSourceFilter(prev => [...prev, source.value]);
                        } else {
                          setSourceFilter(prev => prev.filter(s => s !== source.value));
                        }
                      }}
                      className="rounded border-slate-600 text-violet-600 focus:ring-violet-500 focus:ring-offset-slate-800"
                    />
                    <span className="ml-2 text-sm text-slate-300">{source.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Last Contacted</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {sortedContacts.length} of {contacts.length} contacts
        </p>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <ContactTable
          contacts={sortedContacts}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          canManage={canManageContacts()}
        />
      ) : (
        <ContactKanban
          contacts={sortedContacts}
          onStatusChange={handleStatusChange}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          canManage={canManageContacts()}
        />
      )}

      {/* Contact Form Modal */}
      {showContactModal && (
        <ContactFormModal
          contact={editingContact}
          onSave={handleSaveContact}
          onClose={() => {
            setShowContactModal(false);
            setEditingContact(null);
          }}
        />
      )}
    </div>
  );
};

export default Contacts;