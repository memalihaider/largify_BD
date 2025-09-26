import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Tag, Calendar, User, Lightbulb } from 'lucide-react';
import Card from '../components/Card';
import { getUserRole, getUserProfile, canAccessSuperAdminFeatures, canAccessAdminFeatures } from '../utils/auth';

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  });

  const userRole = getUserRole();
  const userProfile = getUserProfile();
  const isSuperAdmin = canAccessSuperAdminFeatures();
  const isAdmin = canAccessAdminFeatures();
  const isCustomer = userRole === 'Customer';

  // Dummy data for ideas
  const dummyIdeas = [
    {
      id: 1,
      title: 'AI-Powered Lead Scoring',
      description: 'Implement machine learning algorithms to automatically score and prioritize leads based on their likelihood to convert. This would help sales teams focus on the most promising prospects.',
      category: 'Sales & Marketing',
      tags: ['AI', 'Machine Learning', 'Lead Generation', 'Sales'],
      createdBy: 'John Admin',
      userId: 1,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Customer Feedback Dashboard',
      description: 'Create a comprehensive dashboard that aggregates customer feedback from multiple channels including surveys, support tickets, and social media mentions.',
      category: 'Customer Experience',
      tags: ['Dashboard', 'Feedback', 'Analytics', 'Customer Service'],
      createdBy: 'Sarah Team',
      userId: 2,
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      id: 3,
      title: 'Mobile App Integration',
      description: 'Develop a mobile application that integrates with our existing platform to allow users to manage their accounts and access key features on the go.',
      category: 'Technology',
      tags: ['Mobile', 'Integration', 'User Experience', 'Development'],
      createdBy: 'Mike Developer',
      userId: 3,
      createdAt: '2024-01-13T09:15:00Z'
    },
    {
      id: 4,
      title: 'Automated Reporting System',
      description: 'Build an automated system that generates and distributes custom reports to stakeholders based on predefined schedules and criteria.',
      category: 'Operations',
      tags: ['Automation', 'Reporting', 'Analytics', 'Efficiency'],
      createdBy: 'Lisa Manager',
      userId: 4,
      createdAt: '2024-01-12T16:45:00Z'
    },
    {
      id: 5,
      title: 'Gamification Features',
      description: 'Add gamification elements to increase user engagement, including achievement badges, progress tracking, and leaderboards.',
      category: 'User Engagement',
      tags: ['Gamification', 'Engagement', 'User Experience', 'Motivation'],
      createdBy: 'Tom Customer',
      userId: 5,
      createdAt: '2024-01-11T11:30:00Z'
    },
    {
      id: 6,
      title: 'Voice Command Interface',
      description: 'Implement voice recognition technology to allow users to interact with the platform using voice commands for hands-free operation.',
      category: 'Innovation',
      tags: ['Voice Recognition', 'AI', 'Accessibility', 'Innovation'],
      createdBy: 'Emma Innovator',
      userId: 6,
      createdAt: '2024-01-10T13:20:00Z'
    }
  ];

  useEffect(() => {
    setIdeas(dummyIdeas);
  }, []);

  // Filter ideas based on user role
  const getFilteredIdeas = () => {
    if (isSuperAdmin) {
      return ideas; // Super Admin can see all ideas
    } else if (isAdmin || userRole === 'Team Member') {
      // Admin and Team Members can see their own ideas
      return ideas.filter(idea => idea.userId === userProfile?.id || idea.createdBy === userProfile?.name);
    } else if (isCustomer) {
      // Customers can only see their own ideas
      return ideas.filter(idea => idea.userId === userProfile?.id || idea.createdBy === userProfile?.name);
    }
    return [];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newIdea = {
      id: ideas.length + 1,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdBy: userProfile?.name || 'Current User',
      userId: userProfile?.id || 1,
      createdAt: new Date().toISOString()
    };

    setIdeas(prev => [newIdea, ...prev]);
    setFormData({ title: '', description: '', category: '', tags: '' });
    setShowAddModal(false);
  };

  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      description: idea.description,
      category: idea.category,
      tags: Array.isArray(idea.tags) ? idea.tags.join(', ') : idea.tags
    });
    setShowEditModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    const updatedIdea = {
      ...editingIdea,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setIdeas(prev => prev.map(idea => 
      idea.id === editingIdea.id ? updatedIdea : idea
    ));
    
    setFormData({ title: '', description: '', category: '', tags: '' });
    setShowEditModal(false);
    setEditingIdea(null);
  };

  const handleDelete = (ideaId) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      setIdeas(prev => prev.filter(idea => idea.id !== ideaId));
    }
  };

  const canManageIdea = (idea) => {
    if (isSuperAdmin) return true;
    if (isAdmin || userRole === 'Team Member') {
      return idea.userId === userProfile?.id || idea.createdBy === userProfile?.name;
    }
    if (isCustomer) {
      return idea.userId === userProfile?.id || idea.createdBy === userProfile?.name;
    }
    return false;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Sales & Marketing': 'bg-blue-500/10 text-blue-400',
      'Customer Experience': 'bg-green-500/10 text-green-400',
      'Technology': 'bg-purple-500/10 text-purple-400',
      'Operations': 'bg-orange-500/10 text-orange-400',
      'User Engagement': 'bg-pink-500/10 text-pink-400',
      'Innovation': 'bg-cyan-500/10 text-cyan-400'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-400';
  };

  const filteredIdeas = getFilteredIdeas();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-400" />
            Ideas Creator
          </h1>
          <p className="text-slate-400 mt-1">
            {isSuperAdmin 
              ? 'Manage all ideas across the organization' 
              : isCustomer 
                ? 'Create and manage your innovative ideas'
                : 'Create and manage your team ideas'
            }
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Idea
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Ideas</p>
              <p className="text-2xl font-bold text-white">{filteredIdeas.length}</p>
            </div>
            <Lightbulb className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Categories</p>
              <p className="text-2xl font-bold text-white">
                {new Set(filteredIdeas.map(idea => idea.category)).size}
              </p>
            </div>
            <Tag className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">This Month</p>
              <p className="text-2xl font-bold text-white">
                {filteredIdeas.filter(idea => {
                  const ideaDate = new Date(idea.createdAt);
                  const now = new Date();
                  return ideaDate.getMonth() === now.getMonth() && ideaDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="p-6 hover:border-slate-600 transition-colors">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(idea.category)}`}>
                    {idea.category}
                  </span>
                </div>
                {canManageIdea(idea) && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(idea)}
                      className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                      title="Edit idea"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete idea"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed">
                {idea.description.length > 120 
                  ? `${idea.description.substring(0, 120)}...` 
                  : idea.description
                }
              </p>

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {idea.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {idea.tags.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                      +{idea.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <User className="h-3 w-3" />
                  <span>{idea.createdBy}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(idea.createdAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <Card className="p-12 text-center">
          <Lightbulb className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No ideas yet</h3>
          <p className="text-slate-500 mb-4">Start by creating your first innovative idea!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create First Idea
          </button>
        </Card>
      )}

      {/* Add Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add New Idea</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter idea title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Describe your idea in detail"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Customer Experience">Customer Experience</option>
                  <option value="Technology">Technology</option>
                  <option value="Operations">Operations</option>
                  <option value="User Engagement">User Engagement</option>
                  <option value="Innovation">Innovation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-slate-400 mt-1">Separate multiple tags with commas</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Idea Modal */}
      {showEditModal && editingIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Edit Idea</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingIdea(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter idea title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Describe your idea in detail"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Customer Experience">Customer Experience</option>
                  <option value="Technology">Technology</option>
                  <option value="Operations">Operations</option>
                  <option value="User Engagement">User Engagement</option>
                  <option value="Innovation">Innovation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-slate-400 mt-1">Separate multiple tags with commas</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingIdea(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Update Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ideas;