import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, Brain, Plus, Trash2 } from 'lucide-react';
import AgendaPanel from './AgendaPanel';

const MeetingFormModal = ({ onClose, onSubmit, meeting = null }) => {
  const [formData, setFormData] = useState({
    title: meeting?.title || '',
    date: meeting?.date || '',
    time: meeting?.time || '',
    duration: meeting?.duration || '1hr',
    participants: meeting?.participants || [],
    location: meeting?.location || '',
    generateAgenda: meeting?.hasAgenda || false,
    agenda: meeting?.agenda || {
      introduction: '',
      discussionPoints: [''],
      actionItems: [''],
      closingNotes: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [newParticipant, setNewParticipant] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const durationOptions = [
    { value: '15min', label: '15 minutes' },
    { value: '30min', label: '30 minutes' },
    { value: '45min', label: '45 minutes' },
    { value: '1hr', label: '1 hour' },
    { value: '1.5hr', label: '1.5 hours' },
    { value: '2hr', label: '2 hours' },
    { value: '3hr', label: '3 hours' },
    { value: '4hr', label: '4 hours' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Meeting title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (formData.participants.length === 0) {
      newErrors.participants = 'At least one participant is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !formData.participants.includes(newParticipant.trim())) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (index) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateAgenda = () => {
    // Simulate AI agenda generation
    const aiGeneratedAgenda = {
      introduction: `Welcome and introductions for ${formData.title} (5 minutes)`,
      discussionPoints: [
        'Review current project status and milestones',
        'Discuss upcoming challenges and opportunities',
        'Align on next steps and priorities',
        'Address any questions or concerns'
      ],
      actionItems: [
        'Follow up on discussed action items',
        'Schedule next meeting if needed',
        'Share meeting notes with all participants'
      ],
      closingNotes: 'Thank you for your participation. Next steps will be communicated via email.'
    };

    setFormData(prev => ({
      ...prev,
      agenda: aiGeneratedAgenda
    }));
  };

  const handleAgendaUpdate = (updatedAgenda) => {
    setFormData(prev => ({
      ...prev,
      agenda: updatedAgenda
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const meetingData = {
        ...formData,
        hasAgenda: formData.generateAgenda,
        id: meeting?.id || Date.now()
      };

      onSubmit(meetingData);
    } catch (error) {
      // Handle submission error with user-friendly message
      alert('Failed to schedule meeting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {meeting ? 'Edit Meeting' : 'Schedule New Meeting'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                {/* Meeting Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter meeting title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.time ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.time}</p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location / Meeting Link
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Conference room or video call link"
                  />
                </div>
              </div>

              {/* Right Column - Participants */}
              <div className="space-y-6">
                {/* Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Participants *
                  </label>
                  
                  {/* Add Participant */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter participant name or email"
                    />
                    <button
                      type="button"
                      onClick={handleAddParticipant}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Participants List */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {formData.participants.map((participant, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">{participant}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(index)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {errors.participants && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.participants}</p>
                  )}
                </div>

                {/* AI Agenda Generation */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="generateAgenda"
                        checked={formData.generateAgenda}
                        onChange={(e) => handleInputChange('generateAgenda', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="generateAgenda" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Brain className="inline h-4 w-4 mr-1" />
                        Generate AI Agenda
                      </label>
                    </div>
                    
                    {formData.generateAgenda && (
                      <button
                        type="button"
                        onClick={handleGenerateAgenda}
                        className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      >
                        Generate
                      </button>
                    )}
                  </div>

                  {formData.generateAgenda && (
                    <AgendaPanel
                      agenda={formData.agenda}
                      onUpdate={handleAgendaUpdate}
                      isEditable={true}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
              >
                {isSubmitting ? 'Saving...' : (meeting ? 'Update Meeting' : 'Schedule Meeting')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingFormModal;