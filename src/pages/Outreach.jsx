import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Calendar, Target, Mail, MessageCircle, Linkedin } from 'lucide-react';
import { getUserRole, getCurrentUser } from '../utils/auth';
import OutreachTemplates from '../components/outreach/OutreachTemplates';
import OutreachComposer from '../components/outreach/OutreachComposer';
import UpcomingOutreachTable from '../components/outreach/UpcomingOutreachTable';
import { 
  outreachTemplates, 
  scheduledOutreach, 
  templateTypes, 
  templateCategories,
  searchTemplates,
  searchScheduledOutreach
} from '../data/mockOutreach';

const Outreach = () => {
  const user = getCurrentUser();
  const userRole = getUserRole();
  const [activeTab, setActiveTab] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filteredTemplates, setFilteredTemplates] = useState(outreachTemplates);
  const [filteredOutreach, setFilteredOutreach] = useState(scheduledOutreach);

  // Role-based permissions
  const canCreateTemplates = userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'Business Owner';
  const canSendOutreach = userRole !== 'Customer';
  const canEditTemplates = userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'Business Owner';
  const canDeleteTemplates = userRole === 'Super Admin' || userRole === 'Admin';

  // Filter templates based on search and filters
  useEffect(() => {
    let filtered = outreachTemplates;

    // Apply search filter
    if (searchQuery) {
      filtered = searchTemplates(searchQuery);
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(template => template.type === selectedType);
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Role-based filtering for team members
    if (user?.role === 'Team Member') {
      // Team members can only see templates they created or public templates
      filtered = filtered.filter(template => 
        template.createdBy === user.name || template.isPublic !== false
      );
    }

    setFilteredTemplates(filtered);
  }, [searchQuery, selectedType, selectedCategory, user]);

  // Filter scheduled outreach based on search
  useEffect(() => {
    let filtered = scheduledOutreach;

    if (searchQuery && activeTab === 'scheduled') {
      filtered = searchScheduledOutreach(searchQuery);
    }

    // Role-based filtering for scheduled outreach
    if (user?.role === 'Team Member') {
      filtered = filtered.filter(outreach => outreach.assignedTo === user.name);
    }

    setFilteredOutreach(filtered);
  }, [searchQuery, activeTab, user]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsComposerOpen(true);
  };

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setIsComposerOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedCategory('');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-4 h-4" />;
      case 'LinkedIn':
        return <Linkedin className="w-4 h-4" />;
      case 'WhatsApp':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'templates', label: 'Template Library', icon: Target },
    { id: 'scheduled', label: 'Upcoming Outreach', icon: Calendar }
  ];

  return (
    <div className="p-6 space-y-6 dark-bg-primary min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark-text-primary">Outreach Management</h1>
          <p className="dark-text-secondary mt-1">Manage templates and track outreach campaigns</p>
        </div>
        {/* Action Buttons - Role-based visibility */}
        <div className="flex items-center gap-2">
          {canCreateTemplates && (
            <button
              onClick={handleNewTemplate}
              className="flex items-center gap-2 px-4 py-2 dark-btn-primary rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Template</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dark-card p-1 rounded-lg">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'dark-btn-primary'
                  : 'dark-text-secondary hover:dark-text-primary hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="dark-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder={activeTab === 'templates' ? 'Search templates...' : 'Search campaigns...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 dark-input rounded-lg"
              />
            </div>
          </div>
          {activeTab === 'templates' && (
            <div className="sm:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 dark-select rounded-lg"
              >
                <option value="">All Types</option>
                {templateTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {activeTab === 'templates' && (selectedType || selectedCategory) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                {getTypeIcon(selectedType)}
                {selectedType}
                <button
                  onClick={() => setSelectedType('')}
                  className="ml-1 text-blue-400 hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                <Filter className="w-3 h-3" />
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('')}
                  className="ml-1 text-green-400 hover:text-green-300"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Clear Filters Button */}
        {(searchQuery || selectedType || selectedCategory) && (
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 dark-btn-secondary rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'templates' && (
          <OutreachTemplates
            templates={filteredTemplates}
            onTemplateSelect={handleTemplateSelect}
            canEdit={canEditTemplates}
            canDelete={canDeleteTemplates}
            canSend={canSendOutreach}
          />
        )}

        {activeTab === 'scheduled' && (
          <UpcomingOutreachTable
            outreachData={filteredOutreach}
            userRole={userRole}
            currentUser={user}
          />
        )}
      </div>

      {/* Outreach Composer Modal */}
      {isComposerOpen && (
        <OutreachComposer
          isOpen={isComposerOpen}
          onClose={() => {
            setIsComposerOpen(false);
            setSelectedTemplate(null);
          }}
          selectedTemplate={selectedTemplate}
          userRole={userRole}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default Outreach;