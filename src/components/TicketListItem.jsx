import React from 'react';
import { Clock, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TicketListItem = ({ ticket, isSelected, onClick }) => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-blue-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'resolved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`p-4 border-b border-slate-700 cursor-pointer transition-colors hover:bg-slate-800/50 ${
        isSelected ? 'bg-slate-800 border-l-4 border-l-violet-500' : ''
      }`}
      onClick={() => onClick(ticket)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
          <span className="text-sm text-slate-400">#{ticket.id}</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
          <div className="flex items-center space-x-1">
            {getStatusIcon(ticket.status)}
            <span>{ticket.status}</span>
          </div>
        </div>
      </div>
      
      <h3 className="text-white font-medium mb-2 line-clamp-2">{ticket.subject}</h3>
      
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center space-x-1">
          <User className="h-3 w-3" />
          <span>{ticket.customer.name}</span>
        </div>
        <span>{formatDate(ticket.createdAt)}</span>
      </div>
      
      {ticket.lastReply && (
        <div className="mt-2 text-xs text-slate-500 line-clamp-1">
          Last reply: {ticket.lastReply.message.substring(0, 50)}...
        </div>
      )}
    </div>
  );
};

export default TicketListItem;