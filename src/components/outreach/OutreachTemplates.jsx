import React, { useState } from 'react';
import { 
  Mail, 
  MessageCircle, 
  Linkedin, 
  Edit3, 
  Send, 
  Copy, 
  Eye, 
  MoreVertical,
  Calendar,
  User,
  Tag,
  Clock,
  Trash2
} from 'lucide-react';

const OutreachTemplates = ({ 
  templates, 
  onTemplateSelect, 
  canEdit, 
  canDelete, 
  canSend 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'LinkedIn':
        return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'WhatsApp':
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Mail className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Email':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LinkedIn':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'WhatsApp':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Cold Outreach':
        return 'bg-purple-100 text-purple-800';
      case 'Follow-up':
        return 'bg-orange-100 text-orange-800';
      case 'Introduction':
        return 'bg-cyan-100 text-cyan-800';
      case 'Connection':
        return 'bg-indigo-100 text-indigo-800';
      case 'Proposal':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleCopyTemplate = (template) => {
    const templateText = `${template.subject ? `Subject: ${template.subject}\n\n` : ''}${template.content}`;
    navigator.clipboard.writeText(templateText);
    // You could add a toast notification here
  };

  const handleDeleteTemplate = (template) => {
    if (window.confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      // In a real app, this would delete the template
      alert(`Template "${template.name}" deleted`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
        <p className="text-gray-500">
          {canEdit ? "Create your first outreach template to get started." : "No templates match your current filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${getTypeColor(template.type)}`}>
                    {getTypeIcon(template.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                </div>
                
                {/* Actions Dropdown */}
                <div className="relative group">
                  <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={() => handlePreview(template)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleCopyTemplate(template)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    {canSend && (
                      <button
                        onClick={() => onTemplateSelect(template)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Use Template
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => onTemplateSelect(template)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteTemplate(template)}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* Subject (for email templates) */}
              {template.subject && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Subject:</p>
                  <p className="text-sm text-gray-900 font-medium line-clamp-1">
                    {template.subject}
                  </p>
                </div>
              )}

              {/* Content Preview */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Content Preview:</p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {template.content.replace(/\{\{[^}]+\}\}/g, '[Variable]')}
                </p>
              </div>

              {/* Variables */}
              {template.variables && template.variables.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map((variable, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {variable}
                      </span>
                    ))}
                    {template.variables.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        +{template.variables.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{template.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(template.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Used {template.usageCount} times</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 pt-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handlePreview(template)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                {canSend && (
                  <button
                    onClick={() => onTemplateSelect(template)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Use
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getTypeIcon(selectedTemplate.type)}
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {selectedTemplate.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(selectedTemplate.type)}`}>
                        {selectedTemplate.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedTemplate.category)}`}>
                        {selectedTemplate.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedTemplate.subject && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject:
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedTemplate.subject}</p>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content:
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
                    {selectedTemplate.content}
                  </pre>
                </div>
              </div>

              {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variables:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              {canSend && (
                <button
                  onClick={() => {
                    setShowPreview(false);
                    onTemplateSelect(selectedTemplate);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Use Template
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutreachTemplates;