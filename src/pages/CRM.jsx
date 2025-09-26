import React, { useState, useEffect } from 'react';
import { getUserRole, canAccessAdminFeatures } from '../utils/auth';
import { handleError } from '../utils/errorHandler';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  User
} from 'lucide-react';

const CRM = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentUserId, setCurrentUserId] = useState('user-1'); // Mock current user ID

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Modal states
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, customer: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, customer: null });

  // Status options with colors
  const statusOptions = [
    { value: 'Lead', label: 'Lead', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Prospect', label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
    { value: 'Customer', label: 'Customer', color: 'bg-green-100 text-green-800' },
    { value: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' }
  ];

  // Dummy customer data
  const dummyCustomers = [
    {
      id: 'cust-1',
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      email: 'john.smith@techsolutions.com',
      phone: '+1 (555) 123-4567',
      status: 'Customer',
      lastContact: '2024-01-15T10:30:00Z',
      notes: 'Long-term client, interested in enterprise solutions. Regular monthly check-ins scheduled.',
      assignedTo: 'user-1'
    },
    {
      id: 'cust-2',
      name: 'Sarah Johnson',
      company: 'Marketing Pro LLC',
      email: 'sarah.j@marketingpro.com',
      phone: '+1 (555) 234-5678',
      status: 'Prospect',
      lastContact: '2024-01-14T14:20:00Z',
      notes: 'Interested in our premium package. Follow up scheduled for next week.',
      assignedTo: 'user-2'
    },
    {
      id: 'cust-3',
      name: 'Michael Brown',
      company: 'Brown & Associates',
      email: 'mbrown@brownassoc.com',
      phone: '+1 (555) 345-6789',
      status: 'Lead',
      lastContact: '2024-01-13T09:15:00Z',
      notes: 'Initial contact made. Needs more information about pricing and features.',
      assignedTo: 'user-1'
    },
    {
      id: 'cust-4',
      name: 'Emily Davis',
      company: 'Creative Designs Studio',
      email: 'emily@creativedesigns.com',
      phone: '+1 (555) 456-7890',
      status: 'Customer',
      lastContact: '2024-01-12T16:45:00Z',
      notes: 'Satisfied customer, considering upgrade to premium plan.',
      assignedTo: 'user-3'
    },
    {
      id: 'cust-5',
      name: 'Robert Wilson',
      company: 'Wilson Enterprises',
      email: 'rwilson@wilsonent.com',
      phone: '+1 (555) 567-8901',
      status: 'Lost',
      lastContact: '2024-01-10T11:00:00Z',
      notes: 'Decided to go with competitor. Price was the main factor.',
      assignedTo: 'user-2'
    },
    {
      id: 'cust-6',
      name: 'Lisa Anderson',
      company: 'Anderson Consulting',
      email: 'lisa@andersonconsult.com',
      phone: '+1 (555) 678-9012',
      status: 'Prospect',
      lastContact: '2024-01-11T13:30:00Z',
      notes: 'Very interested in our services. Waiting for budget approval.',
      assignedTo: 'user-1'
    },
    {
      id: 'cust-7',
      name: 'David Martinez',
      company: 'Martinez Holdings',
      email: 'david@martinezholdings.com',
      phone: '+1 (555) 789-0123',
      status: 'Lead',
      lastContact: '2024-01-09T15:20:00Z',
      notes: 'New lead from website contact form. Initial qualification needed.',
      assignedTo: 'user-3'
    },
    {
      id: 'cust-8',
      name: 'Jennifer Taylor',
      company: 'Taylor & Co.',
      email: 'jennifer@taylorco.com',
      phone: '+1 (555) 890-1234',
      status: 'Customer',
      lastContact: '2024-01-08T12:15:00Z',
      notes: 'Loyal customer for 2+ years. Excellent relationship.',
      assignedTo: 'user-2'
    }
  ];

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    
    // Check if customer role should be redirected
    if (role === 'Customer') {
      setError('Access denied. CRM is not available for customer accounts.');
      return;
    }
    
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter, userRole]);

  const loadCustomers = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCustomers(dummyCustomers);
      setIsLoading(false);
    }, 500);
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    // Role-based filtering
    if (canAccessAdminFeatures()) {
      // Super Admin can see all customers
      filtered = customers;
    } else if (userRole === 'Admin') {
      // Admin can see customers in their business unit (for demo, show all)
      filtered = customers;
    } else {
      // Team members can only see assigned customers
      filtered = customers.filter(customer => customer.assignedTo === currentUserId);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(option => option.value === status);
    return statusConfig ? statusConfig.color : 'bg-gray-100 text-gray-800';
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: formData.name.trim(),
      company: formData.company.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      status: formData.status,
      lastContact: new Date().toISOString(),
      notes: formData.notes.trim(),
      assignedTo: currentUserId
    };
    
    setCustomers(prev => [newCustomer, ...prev]);
    setAddModal(false);
    resetForm();
    setError('');
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      notes: customer.notes
    });
    setEditModal({ isOpen: true, customer });
  };

  const handleSaveEdit = () => {
    if (!validateForm()) return;
    
    const updatedCustomers = customers.map(customer => 
      customer.id === editModal.customer.id 
        ? { 
            ...customer, 
            name: formData.name.trim(),
            company: formData.company.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            status: formData.status,
            notes: formData.notes.trim(),
            lastContact: new Date().toISOString()
          }
        : customer
    );
    
    setCustomers(updatedCustomers);
    setEditModal({ isOpen: false, customer: null });
    resetForm();
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'Lead',
      notes: ''
    });
    setFormErrors({});
  };

  const canEditCustomer = (customer) => {
    return canAccessAdminFeatures() || 
           userRole === 'Admin' || 
           customer.assignedTo === currentUserId;
  };

  // Redirect customers
  if (userRole === 'Customer') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
          <p>The CRM system is not available for customer accounts. Please contact your administrator if you need access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Set document title */}
      {typeof document !== 'undefined' && (document.title = 'CRM - Customer Relationship Management')}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">CRM - Customer Relationship Management</h1>
        <p className="text-slate-300">Manage your customer relationships and track interactions</p>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters and Add Button */}
          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Customer Button */}
            <button
              onClick={() => setAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-300 mt-2">Loading customers...</p>
        </div>
      ) : (
        <>
          {/* Customer Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Last Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{customer.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-white">
                          <Building2 className="h-4 w-4 text-slate-400 mr-2" />
                          {customer.company || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          <div className="flex items-center mb-1">
                            <Mail className="h-4 w-4 text-slate-400 mr-2" />
                            {customer.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-slate-400 mr-2" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-white">
                          <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                          {formatDate(customer.lastContact)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setViewModal({ isOpen: true, customer })}
                            className="text-blue-400 hover:text-blue-300 p-1 hover:bg-slate-700 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {canEditCustomer(customer) && (
                            <>
                              <button
                                onClick={() => handleEdit(customer)}
                                className="text-green-400 hover:text-green-300 p-1 hover:bg-slate-700 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(customer.id)}
                                className="text-red-400 hover:text-red-300 p-1 hover:bg-slate-700 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No customers found</p>
                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Customer Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Add New Customer</h2>
                <button
                  onClick={() => { setAddModal(false); resetForm(); }}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Enter customer name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter any additional notes..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAddModal(false); resetForm(); }}
                    className="px-4 py-2 border border-slate-600 text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Edit Customer</h2>
                <button
                  onClick={() => { setEditModal({ isOpen: false, customer: null }); resetForm(); }}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-slate-300 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Enter customer name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="edit-company" className="block text-sm font-medium text-slate-300 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      id="edit-company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="edit-email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-slate-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="edit-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="edit-status" className="block text-sm font-medium text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      id="edit-status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="edit-notes" className="block text-sm font-medium text-slate-300 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="edit-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter any additional notes..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => { setEditModal({ isOpen: false, customer: null }); resetForm(); }}
                    className="px-4 py-2 border border-slate-600 text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {viewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">Customer Details</h2>
                <button
                  onClick={() => setViewModal({ isOpen: false, customer: null })}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                    <p className="text-lg font-semibold text-white">{viewModal.customer.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Company</label>
                    <p className="text-lg text-gray-900">{viewModal.customer.company || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-lg text-gray-900">{viewModal.customer.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-lg text-gray-900">{viewModal.customer.phone}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(viewModal.customer.status)}`}>
                      {viewModal.customer.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Contact</label>
                    <p className="text-lg text-gray-900">{formatDate(viewModal.customer.lastContact)}</p>
                  </div>
                </div>
                
                {viewModal.customer.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-900 whitespace-pre-wrap">{viewModal.customer.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;