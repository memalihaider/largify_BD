import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Edit3, 
  Trash2, 
  Save, 
  XCircle,
  FileText,
  Video,
  Building,
  User,
  Mail,
  Phone
} from 'lucide-react';

const MeetingDetailsModal = ({ 
  isOpen, 
  onClose, 
  meeting, 
  onEdit, 
  onDelete,
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (meeting) {
      setEditedMeeting({ ...meeting });
    }
  }, [meeting]);

  if (!isOpen || !meeting) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedMeeting);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMeeting({ ...meeting });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(meeting.id);
    }
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setEditedMeeting(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParticipantsChange = (value) => {
    const participants = value.split(',').map(p => p.trim()).filter(p => p);
    setEditedMeeting(prev => ({
      ...prev,
      participants
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getLocationIcon = (location) => {
    if (location.includes('http') || location.includes('zoom') || location.includes('teams')) {
      return <Video className="h-5 w-5" />;
    }
    return <Building className="h-5 w-5" />;
  };

  const isUpcoming = (date, time) => {
    const meetingDateTime = new Date(`${date} ${time}`);
    return meetingDateTime > new Date();
  };

  const currentMeeting = isEditing ? editedMeeting : meeting;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Meeting Details
            </h2>
            {!isUpcoming(currentMeeting.date, currentMeeting.time) && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                Past Meeting
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit Meeting"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Meeting"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Meeting Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Meeting Information
                </h3>
                
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentMeeting.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {currentMeeting.title}
                    </p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={currentMeeting.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {formatDate(currentMeeting.date)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time
                    </label>
                    {isEditing ? (
                      <input
                        type="time"
                        value={currentMeeting.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        {formatTime(currentMeeting.time)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  {isEditing ? (
                    <select
                      value={currentMeeting.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="1.5 hours">1.5 hours</option>
                      <option value="2 hours">2 hours</option>
                      <option value="3 hours">3 hours</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 dark:text-white">{currentMeeting.duration}</p>
                  )}
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentMeeting.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Meeting room or video link"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 dark:text-white">
                      {getLocationIcon(currentMeeting.location)}
                      <span className="ml-2">{currentMeeting.location || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                {/* Participants */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Participants ({currentMeeting.participants.length})
                  </label>
                  {isEditing ? (
                    <textarea
                      value={currentMeeting.participants.join(', ')}
                      onChange={(e) => handleParticipantsChange(e.target.value)}
                      placeholder="Enter participant names separated by commas"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="space-y-2">
                      {currentMeeting.participants.map((participant, index) => (
                        <div key={index} className="flex items-center text-gray-900 dark:text-white">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          {participant}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Agenda Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Meeting Agenda
                </h3>
                
                {currentMeeting.hasAgenda && currentMeeting.agenda ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                    {/* Introduction */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Introduction (5 minutes)
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentMeeting.agenda.introduction}
                      </p>
                    </div>

                    {/* Discussion Points */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Discussion Points
                      </h4>
                      <ul className="space-y-2">
                        {currentMeeting.agenda.discussionPoints.map((point, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Action Items
                      </h4>
                      <ul className="space-y-2">
                        {currentMeeting.agenda.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Closing Notes */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Closing Notes
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentMeeting.agenda.closingNotes}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No agenda available for this meeting</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <Trash2 className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Delete Meeting
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete "{meeting.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetailsModal;