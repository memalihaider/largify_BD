import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ChevronDown,
  Paperclip,
  Send,
  X,
  Download
} from 'lucide-react';
import MessageBubble from './MessageBubble';

const TicketDetail = ({ ticket, onStatusChange, onAssignmentChange, onReplySubmit }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await onReplySubmit(ticket.id, replyMessage, attachments);
      setReplyMessage('');
      setAttachments([]);
    } catch (error) {
      alert('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">{ticket.subject}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Ticket #{ticket.id}</span>
              <span>•</span>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(ticket.status)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              ticket.status === 'open' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              ticket.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-green-500/20 text-green-400 border-green-500/30'
            }`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Customer Info and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Customer</h3>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{ticket.customer.name}</p>
                <p className="text-gray-400 text-sm">{ticket.customer.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Priority</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Assigned To</h3>
            <select
              value={ticket.assignedTo || 'unassigned'}
              onChange={(e) => onAssignmentChange(ticket.id, e.target.value)}
              className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="unassigned">Unassigned</option>
              <option value="john_doe">John Doe</option>
              <option value="jane_smith">Jane Smith</option>
              <option value="mike_johnson">Mike Johnson</option>
            </select>
          </div>
        </div>

        {/* Status Controls */}
        <div className="mt-4 flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-300">Status:</label>
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value)}
            className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Ticket Description */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white mb-3">Description</h3>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <p className="text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-lg font-medium text-white mb-4">Conversation</h3>
        <div className="space-y-4">
          {ticket.messages && ticket.messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
        </div>
      </div>

      {/* Reply Form */}
      <div className="p-6 border-t border-gray-700">
        <form onSubmit={handleSubmitReply}>
          <div className="mb-4">
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Attachments</h4>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-2">
                    <span className="text-sm text-gray-300">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm">Attach Files</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={!replyMessage.trim() || isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Sending...' : 'Send Reply'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;