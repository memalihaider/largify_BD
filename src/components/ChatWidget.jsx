import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { getUserProfile } from '../utils/auth';

const ChatWidget = ({ currentPage = 'dashboard' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [user, setUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const userProfile = getUserProfile();
    setUser(userProfile);
    
    // Load initial welcome message
    if (messages.length === 0) {
      setMessages([{
        id: Date.now(),
        type: 'bot',
        content: `Hello${userProfile?.name ? ` ${userProfile.name}` : ''}! 👋 I'm your BD SaaS assistant. I can help you navigate the platform, understand features, and answer questions about your business tools. How can I assist you today?`,
        timestamp: new Date(),
        suggestions: []
      }]);
    }
    
    // Load contextual suggestions
    loadSuggestions();
  }, [currentPage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/chatbot/suggestions?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message.trim(),
          context: {
            currentPage,
            timestamp: new Date().toISOString()
          }
        })
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        success: data.success
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact support.',
        timestamp: new Date(),
        success: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const provideFeedback = async (messageId, helpful) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/chatbot/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId,
          helpful,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: `Hello${user?.name ? ` ${user.name}` : ''}! 👋 I'm your BD SaaS assistant. How can I help you today?`,
      timestamp: new Date()
    }]);
    setShowSuggestions(true);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={toggleChat}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 animate-pulse"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          
          {/* AI Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            AI
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-96 h-12' : 'w-96 h-[600px]'
        }`}>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-750 dark:to-gray-750 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white font-semibold text-sm">BD SaaS Assistant</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {isLoading ? 'AI is thinking...' : 'Ready to help'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded"
                  title="Clear chat"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={minimizeChat}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded"
                  title="Minimize"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={closeChat}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <div className="flex items-center mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick suggestions:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(suggestion)}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <div className={`max-w-[85%] ${
                        message.type === 'user' ? 'order-2' : 'order-1'
                      }`}>
                        <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                        }`}>
                          <p className="break-words whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        <div className={`flex items-center mt-2 space-x-2 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </p>
                          
                          {message.type === 'bot' && (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => copyMessage(message.content)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title="Copy message"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => provideFeedback(message.id, true)}
                                className="text-gray-400 hover:text-green-500 transition-colors"
                                title="Helpful"
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => provideFeedback(message.id, false)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Not helpful"
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 order-1 mr-3' 
                          : 'bg-gradient-to-r from-green-500 to-blue-500 order-2 ml-3'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about BD SaaS..."
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                    <button
                      onClick={() => sendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                      className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Powered by AI • Ask about features, navigation, or get business insights
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;