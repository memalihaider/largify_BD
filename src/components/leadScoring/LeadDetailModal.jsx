import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  DollarSign,
  Clock,
  Activity,
  Brain,
  Save,
  Edit3,
  MapPin,
  Globe,
  Users
} from 'lucide-react';


const LeadDetailModal = ({ lead, isOpen, onClose, onSave, canEdit = false, canAssign = false, teamMembers = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);

  if (!isOpen || !lead) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'hot':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'warm':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'cold':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = () => {
    if (onSave && (canEdit || canAssign)) {
      onSave(editedLead);
    }
    setIsEditing(false);
  };

  const ScoreFactorBar = ({ label, score, color }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-blue-600">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
              <p className="text-gray-600">{lead.position} at {lead.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Lead Score and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-gray-700">Lead Score</span>
              </div>
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-lg font-bold border ${getScoreColor(lead.leadScore)}`}>
                {lead.leadScore}/100
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700">Status</span>
              </div>
              {isEditing ? (
                <select
                  value={editedLead.status}
                  onChange={(e) => setEditedLead({...editedLead, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              ) : (
                <span className={`inline-flex px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-700">Assigned To</span>
              </div>
              {isEditing && canAssign ? (
                <select
                  value={editedLead.assignedToId}
                  onChange={(e) => {
                    const selectedMember = teamMembers.find(m => m.id === parseInt(e.target.value));
                    setEditedLead({
                      ...editedLead, 
                      assignedToId: parseInt(e.target.value),
                      assignedTo: selectedMember.name
                    });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              ) : (
                <span className="text-gray-900 font-medium">{lead.assignedTo}</span>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Email</span>
                    <p className="font-medium text-gray-900">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Phone</span>
                    <p className="font-medium text-gray-900">{lead.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Company</span>
                    <p className="font-medium text-gray-900">{lead.company}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Industry</span>
                    <p className="font-medium text-gray-900">{lead.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Company Size</span>
                    <p className="font-medium text-gray-900">{lead.companySize} employees</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Budget</span>
                    <p className="font-medium text-gray-900">{lead.budget}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Scoring Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Scoring Breakdown</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ScoreFactorBar 
                  label="Engagement Score" 
                  score={lead.scoringFactors.engagement} 
                  color="bg-blue-500" 
                />
                <ScoreFactorBar 
                  label="Demographics" 
                  score={lead.scoringFactors.demographics} 
                  color="bg-green-500" 
                />
              </div>
              <div className="space-y-4">
                <ScoreFactorBar 
                  label="Behavior Score" 
                  score={lead.scoringFactors.behavior} 
                  color="bg-purple-500" 
                />
                <ScoreFactorBar 
                  label="Firmographics" 
                  score={lead.scoringFactors.firmographics} 
                  color="bg-orange-500" 
                />
              </div>
            </div>
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">AI Explanation</h4>
              <p className="text-sm text-purple-800">
                This lead shows {lead.leadScore >= 80 ? 'excellent' : lead.leadScore >= 60 ? 'good' : 'moderate'} potential based on their engagement patterns, 
                company profile, and behavioral indicators. Key factors include their {lead.position.toLowerCase()} role, 
                company size ({lead.companySize}), and recent activities. 
                {lead.leadScore >= 80 && ' Recommend immediate follow-up and personalized outreach.'}
                {lead.leadScore >= 60 && lead.leadScore < 80 && ' Consider nurturing with targeted content and regular touchpoints.'}
                {lead.leadScore < 60 && ' Focus on building engagement through educational content and value-driven interactions.'}
              </p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {lead.activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{formatDate(activity.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Source</span>
                <p className="font-medium text-gray-900">{lead.source}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Timeline</span>
                <p className="font-medium text-gray-900">{lead.timeline}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Created</span>
                <p className="font-medium text-gray-900">{formatDate(lead.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Role-based visibility */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {!isEditing && (canEdit || canAssign) && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
            
            {isEditing && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedLead(lead);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;