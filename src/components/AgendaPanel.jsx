import React, { useState } from 'react';
import { Edit3, Save, Plus, Trash2, Clock, MessageSquare, CheckSquare, FileText } from 'lucide-react';

const AgendaPanel = ({ agenda, onUpdate, isEditable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgenda, setEditedAgenda] = useState(agenda);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAgenda({ ...agenda });
  };

  const handleSave = () => {
    onUpdate(editedAgenda);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAgenda({ ...agenda });
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setEditedAgenda(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addDiscussionPoint = () => {
    setEditedAgenda(prev => ({
      ...prev,
      discussionPoints: [...prev.discussionPoints, '']
    }));
  };

  const updateDiscussionPoint = (index, value) => {
    setEditedAgenda(prev => ({
      ...prev,
      discussionPoints: prev.discussionPoints.map((point, i) => 
        i === index ? value : point
      )
    }));
  };

  const removeDiscussionPoint = (index) => {
    setEditedAgenda(prev => ({
      ...prev,
      discussionPoints: prev.discussionPoints.filter((_, i) => i !== index)
    }));
  };

  const addActionItem = () => {
    setEditedAgenda(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, '']
    }));
  };

  const updateActionItem = (index, value) => {
    setEditedAgenda(prev => ({
      ...prev,
      actionItems: prev.actionItems.map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const removeActionItem = (index) => {
    setEditedAgenda(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter((_, i) => i !== index)
    }));
  };

  const currentAgenda = isEditing ? editedAgenda : agenda;

  if (!currentAgenda) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No agenda available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Meeting Agenda
        </h3>
        
        {isEditable && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Introduction */}
        <div>
          <div className="flex items-center mb-3">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Introduction</h4>
          </div>
          
          {isEditing ? (
            <textarea
              value={currentAgenda.introduction}
              onChange={(e) => updateField('introduction', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows="2"
              placeholder="Enter introduction..."
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {currentAgenda.introduction || 'No introduction provided'}
            </p>
          )}
        </div>

        {/* Discussion Points */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Discussion Points</h4>
            </div>
            
            {isEditing && (
              <button
                onClick={addDiscussionPoint}
                className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {currentAgenda.discussionPoints?.map((point, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full flex items-center justify-center text-xs font-medium mt-1">
                  {index + 1}
                </span>
                
                {isEditing ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => updateDiscussionPoint(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter discussion point..."
                    />
                    <button
                      onClick={() => removeDiscussionPoint(index)}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <p className="flex-1 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    {point || 'No content'}
                  </p>
                )}
              </div>
            ))}
            
            {(!currentAgenda.discussionPoints || currentAgenda.discussionPoints.length === 0) && !isEditing && (
              <p className="text-gray-500 dark:text-gray-400 italic">No discussion points added</p>
            )}
          </div>
        </div>

        {/* Action Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CheckSquare className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Action Items</h4>
            </div>
            
            {isEditing && (
              <button
                onClick={addActionItem}
                className="p-1 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {currentAgenda.actionItems?.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full flex items-center justify-center text-xs font-medium mt-1">
                  {index + 1}
                </span>
                
                {isEditing ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateActionItem(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter action item..."
                    />
                    <button
                      onClick={() => removeActionItem(index)}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <p className="flex-1 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    {item || 'No content'}
                  </p>
                )}
              </div>
            ))}
            
            {(!currentAgenda.actionItems || currentAgenda.actionItems.length === 0) && !isEditing && (
              <p className="text-gray-500 dark:text-gray-400 italic">No action items added</p>
            )}
          </div>
        </div>

        {/* Closing Notes */}
        <div>
          <div className="flex items-center mb-3">
            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Closing Notes</h4>
          </div>
          
          {isEditing ? (
            <textarea
              value={currentAgenda.closingNotes}
              onChange={(e) => updateField('closingNotes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows="2"
              placeholder="Enter closing notes..."
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {currentAgenda.closingNotes || 'No closing notes provided'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendaPanel;