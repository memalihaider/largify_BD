import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MessageSquare, Clock, CheckCircle, AlertCircle, User, Calendar, Ticket, Users } from 'lucide-react';
import { handleError } from '../utils/errorHandler';
import TicketDetail from '../components/TicketDetail';
import KPICard from '../components/KPICard';
import TicketListItem from '../components/TicketListItem';
import ChatWidget from '../components/ChatWidget';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [stats, setStats] = useState({ open: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTickets = [
          {
            id: 1,
            title: 'Login Issues',
            subject: 'Login Issues',
            description: 'Unable to login to my account',
            status: 'open',
            priority: 'high',
            category: 'Technical',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T14:20:00Z',
            customer: {
              name: 'John Doe',
              email: 'john@example.com'
            },
            assignedTo: 'Sarah Wilson',
            replies: []
          },
          {
            id: 2,
            title: 'Billing Question',
            subject: 'Billing Question',
            description: 'Question about my monthly subscription',
            status: 'pending',
            priority: 'medium',
            category: 'Billing',
            createdAt: '2024-01-14T09:15:00Z',
            updatedAt: '2024-01-14T16:30:00Z',
            customer: {
              name: 'Jane Smith',
              email: 'jane@example.com'
            },
            assignedTo: 'Mike Johnson',
            replies: []
          },
          {
            id: 3,
            title: 'Feature Request',
            subject: 'Feature Request',
            description: 'Would like to request a new dashboard feature',
            status: 'resolved',
            priority: 'low',
            category: 'Feature',
            createdAt: '2024-01-13T14:20:00Z',
            updatedAt: '2024-01-13T18:45:00Z',
            customer: {
              name: 'Bob Wilson',
              email: 'bob@example.com'
            },
            assignedTo: 'Sarah Wilson',
            replies: []
          }
        ];
        
        setTickets(mockTickets);
        
        // Calculate stats
        const ticketStats = {
          open: mockTickets.filter(t => t.status === 'open').length,
          pending: mockTickets.filter(t => t.status === 'pending').length,
          resolved: mockTickets.filter(t => t.status === 'resolved').length
        };
        setStats(ticketStats);
        setError(null);
      } catch (error) {
        const errorMessage = handleError(error, 'Support Data Loading', 'Failed to load support tickets. Please try again.');
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportData();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
          : ticket
      ));
    } catch (error) {
      handleError(error, 'Support Status Update', 'Failed to update ticket status. Please try again.');
    }
  };

  const handleAssignmentUpdate = async (ticketId, assignedTo) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignedTo, updatedAt: new Date().toISOString() }
          : ticket
      ));
    } catch (error) {
      handleError(error, 'Support Assignment Update', 'Failed to update ticket assignment. Please try again.');
    }
  };

  const handleReplySubmit = async (ticketId, reply) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReply = {
        id: Date.now(),
        message: reply,
        author: 'Support Agent',
        timestamp: new Date().toISOString(),
        isInternal: false
      };

      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              replies: [...ticket.replies, newReply],
              updatedAt: new Date().toISOString()
            }
          : ticket
      ));
    } catch (error) {
      handleError(error, 'Support Reply Submission', 'Failed to submit reply. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Support & Tickets</h1>
          <p className="text-slate-400 mt-1">Manage customer support tickets and conversations</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Open Tickets"
          value={stats.open}
          icon={AlertCircle}
          color="blue"
        />
        <KPICard
          title="Pending Tickets"
          value={stats.pending}
          icon={Clock}
          color="yellow"
        />
        <KPICard
          title="Resolved Tickets"
          value={stats.resolved}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* Ticket List */}
        <div className="lg:col-span-1 bg-slate-800 rounded-lg border border-slate-700 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-slate-700">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Ticket className="h-12 w-12 mb-4" />
                <p>No tickets found</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <TicketListItem
                  key={ticket.id}
                  ticket={ticket}
                  isSelected={selectedTicket?.id === ticket.id}
                  onClick={setSelectedTicket}
                />
              ))
            )}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <TicketDetail ticket={selectedTicket} />
          ) : (
            <div className="bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center h-full">
              <div className="text-center text-slate-400">
                <Users className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a ticket</h3>
                <p>Choose a ticket from the list to view details and conversations</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Support;