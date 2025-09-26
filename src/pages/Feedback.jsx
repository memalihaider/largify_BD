import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Star, ThumbsUp, ThumbsDown, Filter, Search } from 'lucide-react';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    message: '',
    category: 'general',
    rating: 5
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock feedback data
  useEffect(() => {
    const mockFeedbacks = [
      {
        id: 1,
        title: 'Great Dashboard Experience',
        message: 'The new dashboard is very intuitive and easy to use. Love the dark theme!',
        category: 'ui',
        rating: 5,
        status: 'reviewed',
        date: '2024-01-15',
        author: 'John Doe'
      },
      {
        id: 2,
        title: 'Feature Request: Export Data',
        message: 'Would be great to have an export feature for reports and analytics data.',
        category: 'feature',
        rating: 4,
        status: 'pending',
        date: '2024-01-14',
        author: 'Jane Smith'
      },
      {
        id: 3,
        title: 'Mobile Responsiveness Issue',
        message: 'Some pages are not displaying correctly on mobile devices.',
        category: 'bug',
        rating: 2,
        status: 'in-progress',
        date: '2024-01-13',
        author: 'Mike Johnson'
      }
    ];
    setFeedbacks(mockFeedbacks);
  }, []);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const feedback = {
        id: feedbacks.length + 1,
        ...newFeedback,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        author: 'Current User'
      };
      
      setFeedbacks([feedback, ...feedbacks]);
      setNewFeedback({
        title: '',
        message: '',
        category: 'general',
        rating: 5
      });
      setLoading(false);
    }, 1000);
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesFilter = filter === 'all' || feedback.category === filter;
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'reviewed': return 'text-green-400 bg-green-400/10';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/10';
      case 'pending': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'ui': return '🎨';
      case 'feature': return '✨';
      case 'bug': return '🐛';
      case 'performance': return '⚡';
      default: return '💬';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Feedback & Suggestions</h1>
          <p className="text-slate-400 mt-1">Share your thoughts and help us improve</p>
        </div>
      </div>

      {/* Submit New Feedback */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Submit Feedback
        </h2>
        
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newFeedback.title}
                onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Brief title for your feedback"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={newFeedback.category}
                onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="general">General</option>
                <option value="ui">User Interface</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewFeedback({...newFeedback, rating: star})}
                  className={`text-2xl ${star <= newFeedback.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="text-slate-400 ml-2">({newFeedback.rating}/5)</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Message
            </label>
            <textarea
              value={newFeedback.message}
              onChange={(e) => setNewFeedback({...newFeedback, message: e.target.value})}
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Describe your feedback in detail..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="ui">User Interface</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feedback..."
            className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No feedback found matching your criteria.</p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getCategoryIcon(feedback.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{feedback.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-400">by {feedback.author}</span>
                      <span className="text-sm text-slate-400">{feedback.date}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                  {feedback.status.replace('-', ' ')}
                </span>
              </div>
              
              <p className="text-slate-300 leading-relaxed">{feedback.message}</p>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
                <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm">Not Helpful</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;