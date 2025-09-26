import React from 'react';
import { User, Bot } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isCustomer = message.sender.type === 'customer';
  const isAgent = message.sender.type === 'agent';
  const isSystem = message.sender.type === 'system';

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSenderAvatar = () => {
    if (isSystem) {
      return (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-gray-300" />
        </div>
      );
    }

    if (message.sender.avatar) {
      return (
        <img
          src={message.sender.avatar}
          alt={message.sender.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isCustomer ? 'bg-blue-600' : 'bg-green-600'
      }`}>
        <User className="h-4 w-4 text-white" />
      </div>
    );
  };

  const getSenderName = () => {
    if (isSystem) return 'System';
    return message.sender.name || (isCustomer ? 'Customer' : 'Support Agent');
  };

  const getSenderRole = () => {
    if (isSystem) return 'Automated';
    if (isCustomer) return 'Customer';
    if (isAgent) return 'Support Agent';
    return message.sender.role || 'User';
  };

  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isAgent ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {getSenderAvatar()}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
          {/* Sender Info */}
          <div className={`flex items-center space-x-2 mb-1 ${isAgent ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <span className="text-sm font-medium text-white">
              {getSenderName()}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isCustomer ? 'bg-blue-500/20 text-blue-400' :
              isAgent ? 'bg-green-500/20 text-green-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {getSenderRole()}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* Message Bubble */}
          <div className={`rounded-lg px-4 py-3 max-w-full ${
            isAgent 
              ? 'bg-blue-600 text-white' 
              : isSystem
              ? 'bg-gray-700 text-gray-300 border border-gray-600'
              : 'bg-gray-700 text-white'
          }`}>
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-black/20 rounded border">
                    <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-xs text-white">📎</span>
                    </div>
                    <span className="text-xs text-gray-300">{attachment.name}</span>
                    <span className="text-xs text-gray-400">({attachment.size})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Status (for agent messages) */}
          {isAgent && message.status && (
            <div className="mt-1">
              <span className={`text-xs ${
                message.status === 'delivered' ? 'text-green-400' :
                message.status === 'read' ? 'text-blue-400' :
                'text-gray-500'
              }`}>
                {message.status === 'delivered' ? '✓ Delivered' :
                 message.status === 'read' ? '✓✓ Read' :
                 'Sending...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;