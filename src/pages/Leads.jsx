import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  Filter,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import Card from '../components/Card';

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock leads data
  const leads = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc.',
      status: 'New',
      source: 'Website',
      value: '$5,000',
      assignedTo: 'John Doe',
      createdAt: '2024-01-15',
      lastContact: '2024-01-15'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      phone: '+1 (555) 234-5678',
      company: 'Marketing Pro',
      status: 'Qualified',
      source: 'LinkedIn',
      value: '$12,000',
      assignedTo: 'Jane Smith',
      createdAt: '2024-01-14',
      lastContact: '2024-01-15'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      phone: '+1 (555) 345-6789',
      company: 'Design Studio',
      status: 'Proposal',
      source: 'Referral',
      value: '$8,500',
      assignedTo: 'Mike Johnson',
      createdAt: '2024-01-13',
      lastContact: '2024-01-14'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '+1 (555) 456-7890',
      company: 'Startup Hub',
      status: 'Negotiation',
      source: 'Cold Call',
      value: '$15,000',
      assignedTo: 'Sarah Wilson',
      createdAt: '2024-01-12',
      lastContact: '2024-01-15'
    },
    {
      id: 5,
      name: 'Eva Brown',
      email: 'eva.brown@example.com',
      phone: '+1 (555) 567-8901',
      company: 'E-commerce Plus',
      status: 'Won',
      source: 'Website',
      value: '$20,000',
      assignedTo: 'Tom Brown',
      createdAt: '2024-01-10',
      lastContact: '2024-01-14'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'text-blue-400 bg-blue-500/10';
      case 'Qualified': return 'text-green-400 bg-green-500/10';
      case 'Proposal': return 'text-yellow-400 bg-yellow-500/10';
      case 'Negotiation': return 'text-orange-400 bg-orange-500/10';
      case 'Won': return 'text-emerald-400 bg-emerald-500/10';
      case 'Lost': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'Website': return 'text-purple-400 bg-purple-500/10';
      case 'LinkedIn': return 'text-blue-400 bg-blue-500/10';
      case 'Referral': return 'text-green-400 bg-green-500/10';
      case 'Cold Call': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    proposal: leads.filter(l => l.status === 'Proposal').length,
    won: leads.filter(l => l.status === 'Won').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Leads</h1>
            <p className="text-slate-400">Track and manage your sales leads</p>
          </div>
        </div>
        <button className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <Plus className="h-4 w-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-white">{statusStats.total}</div>
          <div className="text-sm text-slate-400">Total Leads</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{statusStats.new}</div>
          <div className="text-sm text-slate-400">New</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{statusStats.qualified}</div>
          <div className="text-sm text-slate-400">Qualified</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{statusStats.proposal}</div>
          <div className="text-sm text-slate-400">Proposal</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{statusStats.won}</div>
          <div className="text-sm text-slate-400">Won</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{lead.name}</div>
                      <div className="text-sm text-slate-400">{lead.company}</div>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                          {lead.source}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-slate-300">
                        <Mail className="h-3 w-3 mr-2 text-slate-400" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-300">
                        <Phone className="h-3 w-3 mr-2 text-slate-400" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {lead.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{lead.assignedTo}</div>
                    <div className="flex items-center text-xs text-slate-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {lead.lastContact}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-400 hover:text-green-300 p-1 rounded transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-slate-400 hover:text-slate-300 p-1 rounded transition-colors duration-200">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No leads found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {filteredLeads.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors duration-200">
                Previous
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors duration-200">
                2
              </button>
              <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Leads;