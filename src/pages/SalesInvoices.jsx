import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, X, DollarSign, Calendar, User } from 'lucide-react';
import { getCurrentUser, hasLegacyPermission } from '../utils/auth';

const SalesInvoices = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('sales');
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');
  const [invoicesSearchTerm, setInvoicesSearchTerm] = useState('');
  const [salesFilter, setSalesFilter] = useState('all');
  const [invoicesFilter, setInvoicesFilter] = useState('all');
  const [sales, setSales] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [newSale, setNewSale] = useState({
    customer: '',
    dealValue: '',
    status: 'Open',
    assignedTo: '',
    notes: ''
  });
  const [newInvoice, setNewInvoice] = useState({
    customer: '',
    amount: '',
    dueDate: '',
    status: 'Pending',
    notes: ''
  });

  // Dummy data for sales deals
  const dummySales = [
    {
      id: 'SD001',
      customer: 'TechCorp Inc.',
      dealValue: 50000,
      status: 'Open',
      assignedTo: 'John Smith',
      lastUpdated: '2024-01-15T10:30:00Z',
      notes: 'Enterprise software license deal'
    },
    {
      id: 'SD002',
      customer: 'StartupXYZ',
      dealValue: 15000,
      status: 'Won',
      assignedTo: 'Sarah Johnson',
      lastUpdated: '2024-01-14T14:20:00Z',
      notes: 'Marketing automation setup'
    },
    {
      id: 'SD003',
      customer: 'BigCorp Ltd.',
      dealValue: 75000,
      status: 'Open',
      assignedTo: 'Mike Davis',
      lastUpdated: '2024-01-13T09:15:00Z',
      notes: 'Cloud migration project'
    },
    {
      id: 'SD004',
      customer: 'LocalBiz',
      dealValue: 8000,
      status: 'Lost',
      assignedTo: 'Emily Chen',
      lastUpdated: '2024-01-12T16:45:00Z',
      notes: 'Budget constraints'
    },
    {
      id: 'SD005',
      customer: 'RetailChain Co.',
      dealValue: 32000,
      status: 'Won',
      assignedTo: 'Tom Wilson',
      lastUpdated: '2024-01-11T11:30:00Z',
      notes: 'POS system implementation'
    },
    {
      id: 'SD006',
      customer: 'HealthTech Solutions',
      dealValue: 45000,
      status: 'Open',
      assignedTo: 'John Smith',
      lastUpdated: '2024-01-10T15:20:00Z',
      notes: 'Healthcare management system'
    }
  ];

  // Dummy data for invoices
  const dummyInvoices = [
    {
      id: 'INV001',
      customer: 'TechCorp Inc.',
      amount: 25000,
      status: 'Paid',
      dueDate: '2024-01-20',
      notes: 'First installment payment'
    },
    {
      id: 'INV002',
      customer: 'StartupXYZ',
      amount: 15000,
      status: 'Pending',
      dueDate: '2024-01-25',
      notes: 'Marketing automation setup'
    },
    {
      id: 'INV003',
      customer: 'MediumBiz Co.',
      amount: 12000,
      status: 'Overdue',
      dueDate: '2024-01-10',
      notes: 'CRM implementation'
    },
    {
      id: 'INV004',
      customer: 'BigCorp Ltd.',
      amount: 30000,
      status: 'Pending',
      dueDate: '2024-01-30',
      notes: 'Cloud migration - Phase 1'
    },
    {
      id: 'INV005',
      customer: 'RetailChain Co.',
      amount: 32000,
      status: 'Paid',
      dueDate: '2024-01-18',
      notes: 'POS system implementation - Full payment'
    },
    {
      id: 'INV006',
      customer: 'HealthTech Solutions',
      amount: 22500,
      status: 'Overdue',
      dueDate: '2024-01-05',
      notes: 'Healthcare management system - First phase'
    },
    {
      id: 'INV007',
      customer: 'EduTech Institute',
      amount: 18000,
      status: 'Pending',
      dueDate: '2024-02-01',
      notes: 'Learning management system'
    }
  ];

  const teamMembers = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Mike Davis' },
    { id: '4', name: 'Emily Chen' },
    { id: '5', name: 'Tom Wilson' }
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setSales(dummySales);
    setInvoices(dummyInvoices);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status, type = 'sale') => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide';
    
    if (type === 'sale') {
      switch (status) {
        case 'Open':
          return <span className={`${baseClasses} bg-blue-900/30 text-blue-300 border border-blue-500/50`}>{status}</span>;
        case 'Won':
          return <span className={`${baseClasses} bg-green-900/30 text-green-300 border border-green-500/50`}>{status}</span>;
        case 'Lost':
          return <span className={`${baseClasses} bg-red-900/30 text-red-300 border border-red-500/50`}>{status}</span>;
        default:
          return <span className={`${baseClasses} bg-slate-700 text-slate-300 border border-slate-500`}>{status}</span>;
      }
    } else {
      switch (status) {
        case 'Paid':
          return <span className={`${baseClasses} bg-green-900/30 text-green-300 border border-green-500/50`}>{status}</span>;
        case 'Pending':
          return <span className={`${baseClasses} bg-yellow-900/30 text-yellow-300 border border-yellow-500/50`}>{status}</span>;
        case 'Overdue':
          return <span className={`${baseClasses} bg-red-900/30 text-red-300 border border-red-500/50`}>{status}</span>;
        default:
          return <span className={`${baseClasses} bg-slate-700 text-slate-300 border border-slate-500`}>{status}</span>;
      }
    }
  };

  const handleAddSale = (e) => {
    e.preventDefault();
    const sale = {
      id: `SD${String(sales.length + 1).padStart(3, '0')}`,
      customer: newSale.customer,
      dealValue: parseFloat(newSale.dealValue),
      status: newSale.status,
      assignedTo: newSale.assignedTo,
      lastUpdated: new Date().toISOString(),
      notes: newSale.notes
    };
    setSales([...sales, sale]);
    setNewSale({
      customer: '',
      dealValue: '',
      status: 'Open',
      assignedTo: '',
      notes: ''
    });
    setShowAddSaleModal(false);
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const invoice = {
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      customer: newInvoice.customer,
      amount: parseFloat(newInvoice.amount),
      status: newInvoice.status,
      dueDate: newInvoice.dueDate,
      notes: newInvoice.notes
    };
    setInvoices([...invoices, invoice]);
    setNewInvoice({
      customer: '',
      amount: '',
      dueDate: '',
      status: 'Pending',
      notes: ''
    });
    setShowCreateInvoiceModal(false);
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(salesSearchTerm.toLowerCase());
    const matchesFilter = salesFilter === 'all' || sale.status === salesFilter;
    
    // Role-based filtering
    if (user?.role === 'team_member') {
      return matchesSearch && matchesFilter && sale.assignedTo === user.name;
    }
    
    return matchesSearch && matchesFilter;
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(invoicesSearchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(invoicesSearchTerm.toLowerCase());
    const matchesFilter = invoicesFilter === 'all' || invoice.status === invoicesFilter;
    
    // Role-based filtering
    if (user?.role === 'customer') {
      return matchesSearch && matchesFilter && invoice.customer === user.company;
    }
    
    return matchesSearch && matchesFilter;
  });

  const canCreateSale = () => {
    if (!user) return false;
    return hasLegacyPermission(user.role, 'create_sales') || user.role !== 'customer';
  };

  const canCreateInvoice = () => {
    if (!user) return false;
    return hasLegacyPermission(user.role, 'create_invoices') || ['super_admin', 'admin'].includes(user.role);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Sales & Invoices</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'sales'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Sales Deals
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'invoices'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Invoices
        </button>
      </div>

      {/* Sales Deals Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Sales Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sales..."
                  value={salesSearchTerm}
                  onChange={(e) => setSalesSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter */}
              <select
                value={salesFilter}
                onChange={(e) => setSalesFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            
            {canCreateSale() && (
              <button
                onClick={() => setShowAddSaleModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Sale
              </button>
            )}
          </div>

          {/* Sales Table */}
          <div className="bg-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Deal ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Deal Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{sale.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{sale.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                        {formatCurrency(sale.dealValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(sale.status, 'sale')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{sale.assignedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {formatDate(sale.lastUpdated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredSales.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-300">No sales found</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {salesSearchTerm || salesFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first sale.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* Invoice Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={invoicesSearchTerm}
                  onChange={(e) => setInvoicesSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter */}
              <select
                value={invoicesFilter}
                onChange={(e) => setInvoicesFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            
            {canCreateInvoice() && (
              <button
                onClick={() => setShowCreateInvoiceModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Invoice
              </button>
            )}
          </div>

          {/* Invoices Table */}
          <div className="bg-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{invoice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{invoice.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(invoice.status, 'invoice')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-slate-400 hover:text-slate-300">
                            <Download className="w-4 h-4" />
                          </button>
                          {canCreateInvoice() && (
                            <>
                              <button className="text-green-400 hover:text-green-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-400 hover:text-red-300">
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
            
            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-300">No invoices found</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {invoicesSearchTerm || invoicesFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first invoice.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Sale Modal */}
      {showAddSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Add New Sale</h2>
              <button
                onClick={() => setShowAddSaleModal(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddSale} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Customer *
                </label>
                <input
                  type="text"
                  required
                  value={newSale.customer}
                  onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Deal Value *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newSale.dealValue}
                  onChange={(e) => setNewSale({ ...newSale, dealValue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={newSale.status}
                  onChange={(e) => setNewSale({ ...newSale, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Open">Open</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Assigned To
                </label>
                <select
                  value={newSale.assignedTo}
                  onChange={(e) => setNewSale({ ...newSale, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newSale.notes}
                  onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this sale..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSaleModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Create Invoice</h2>
              <button
                onClick={() => setShowCreateInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Customer *
                </label>
                <input
                  type="text"
                  required
                  value={newInvoice.customer}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={newInvoice.status}
                  onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this invoice..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoices;