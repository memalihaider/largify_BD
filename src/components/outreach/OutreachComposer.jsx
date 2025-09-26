import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Calendar, 
  Eye, 
  EyeOff, 
  Mail, 
  MessageCircle, 
  Linkedin,
  User,
  Clock,
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import { outreachTemplates, getTemplateById } from '../../data/mockOutreach';
import { mockContacts } from '../../data/mockContacts';

const OutreachComposer = ({ 
  isOpen, 
  onClose, 
  selectedTemplate, 
  userRole, 
  currentUser 
}) => {
  const [formData, setFormData] = useState({
    templateId: selectedTemplate?.id || '',
    recipientEmail: '',
    recipientName: '',
    subject: '',
    content: '',
    scheduledDate: '',
    scheduledTime: '',
    sendNow: true,
    variables: {}
  });
  const [showPreview, setShowPreview] = useState(false);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [templateVariables, setTemplateVariables] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize form when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        templateId: selectedTemplate.id,
        subject: selectedTemplate.subject || '',
        content: selectedTemplate.content || '',
        variables: {}
      }));
      setTemplateVariables(selectedTemplate.variables || []);
    } else {
      // Reset form for new template
      setFormData({
        templateId: '',
        recipientEmail: '',
        recipientName: '',
        subject: '',
        content: '',
        scheduledDate: '',
        scheduledTime: '',
        sendNow: true,
        variables: {}
      });
      setTemplateVariables([]);
    }
  }, [selectedTemplate]);

  // Load available contacts
  useEffect(() => {
    if (userRole === 'Team Member') {
      // Team members see contacts assigned to them
      const userContacts = mockContacts.filter(contact => 
        contact.assignedTo === currentUser?.name
      );
      setAvailableContacts(userContacts);
    } else {
      // Admins and Super Admins see all contacts
      setAvailableContacts(mockContacts);
    }
  }, [userRole, currentUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleVariableChange = (variable, value) => {
    setFormData(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [variable]: value
      }
    }));
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setFormData(prev => ({
      ...prev,
      recipientEmail: contact.email,
      recipientName: contact.name,
      variables: {
        ...prev.variables,
        first_name: contact.name.split(' ')[0],
        company_name: contact.company || 'your company'
      }
    }));
  };

  const handleTemplateSelect = (templateId) => {
    const template = getTemplateById(templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        templateId: template.id,
        subject: template.subject || '',
        content: template.content || '',
        variables: {}
      }));
      setTemplateVariables(template.variables || []);
    }
  };

  const processContent = (content, variables) => {
    let processedContent = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedContent = processedContent.replace(regex, value || `{{${key}}}`);
    });
    return processedContent;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipientEmail) {
      newErrors.recipientEmail = 'Recipient email is required';
    }
    if (!formData.recipientName) {
      newErrors.recipientName = 'Recipient name is required';
    }
    if (!formData.content) {
      newErrors.content = 'Message content is required';
    }
    if (!formData.sendNow && !formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    if (!formData.sendNow && !formData.scheduledTime) {
      newErrors.scheduledTime = 'Scheduled time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = () => {
    if (!validateForm()) return;

    // Simulate sending/scheduling
    const action = formData.sendNow ? 'sent' : 'scheduled';
    const message = formData.sendNow 
      ? 'Outreach sent successfully!' 
      : `Outreach scheduled for ${formData.scheduledDate} at ${formData.scheduledTime}`;
    
    alert(message); // In a real app, you'd show a proper toast notification
    onClose();
  };

  const handleSaveTemplate = () => {
    if (!formData.subject && !formData.content) {
      alert('Please add subject and content to save as template');
      return;
    }
    
    // Simulate saving template
    alert('Template saved successfully!');
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
        return <Mail className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  const processedContent = processContent(formData.content, formData.variables);
  const processedSubject = processContent(formData.subject, formData.variables);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedTemplate ? 'Use Template' : 'Compose Outreach'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Main Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Template Selection */}
            {!selectedTemplate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template (Optional)
                </label>
                <select
                  value={formData.templateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a template...</option>
                  {outreachTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Contact Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Contact
              </label>
              <select
                value={selectedContact?.id || ''}
                onChange={(e) => {
                  const contact = availableContacts.find(c => c.id === parseInt(e.target.value));
                  if (contact) handleContactSelect(contact);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a contact...</option>
                {availableContacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} - {contact.email} ({contact.company})
                  </option>
                ))}
              </select>
            </div>

            {/* Manual Recipient Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.recipientName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter recipient name"
                />
                {errors.recipientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.recipientEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter recipient email"
                />
                {errors.recipientEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.recipientEmail}</p>
                )}
              </div>
            </div>

            {/* Template Variables */}
            {templateVariables.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Template Variables
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templateVariables.map((variable) => (
                    <div key={variable}>
                      <label className="block text-sm text-gray-600 mb-1">
                        {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        value={formData.variables[variable] || ''}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subject */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject (for Email)
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={8}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your message content..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            {/* Scheduling */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sendTiming"
                    checked={formData.sendNow}
                    onChange={() => handleInputChange('sendNow', true)}
                    className="mr-2"
                  />
                  Send Now
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sendTiming"
                    checked={!formData.sendNow}
                    onChange={() => handleInputChange('sendNow', false)}
                    className="mr-2"
                  />
                  Schedule for Later
                </label>
              </div>

              {!formData.sendNow && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.scheduledDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.scheduledTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.scheduledTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.scheduledTime}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/3 border-l border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Preview</h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {showPreview && (
              <div className="p-4 overflow-y-auto h-full">
                {processedSubject && (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Subject:
                    </label>
                    <div className="p-2 bg-white rounded border text-sm">
                      {processedSubject}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Content:
                  </label>
                  <div className="p-3 bg-white rounded border">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {processedContent}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            {(userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'Business Owner') && (
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Template
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              {formData.sendNow ? (
                <>
                  <Send className="w-4 h-4" />
                  Send Now
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Schedule
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutreachComposer;