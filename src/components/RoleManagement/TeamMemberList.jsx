import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Shield, User, Mail, Phone, Building, UserCheck } from 'lucide-react';
import { getTeamMembers, deleteTeamMember, getTeamMemberPermissions } from '../../utils/auth';
import TeamMemberForm from './TeamMemberForm';
import PermissionEditor from './PermissionEditor';

const TeamMemberList = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPermissionEditor, setShowPermissionEditor] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const members = await getTeamMembers();
      setTeamMembers(members);
      setError('');
    } catch (error) {
      setError('Failed to load team members');
      console.error('Error loading team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await deleteTeamMember(memberId);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      setDeleteConfirm(null);
    } catch (error) {
      setError('Failed to delete team member');
      console.error('Error deleting team member:', error);
    }
  };

  const handleEditPermissions = async (member) => {
    try {
      const permissions = await getTeamMemberPermissions(member.id);
      setSelectedMember({ ...member, permissions });
      setShowPermissionEditor(true);
    } catch (error) {
      setError('Failed to load member permissions');
      console.error('Error loading permissions:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-600 mt-1">Manage your team members and their permissions</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <User className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Team Members Grid */}
      {teamMembers.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first team member</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {/* Member Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.position || 'Team Member'}</p>
                  </div>
                </div>
                {getStatusBadge(member.status || 'active')}
              </div>

              {/* Member Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{member.email}</span>
                </div>
                
                {member.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{member.phone}</span>
                  </div>
                )}
                
                {member.department && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{member.department}</span>
                  </div>
                )}
              </div>

              {/* Member Stats */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium">{formatDate(member.created_at)}</span>
                </div>
                {member.last_login && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Last Login</span>
                    <span className="font-medium">{formatDate(member.last_login)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditPermissions(member)}
                  className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1 text-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span>Permissions</span>
                </button>
                
                <button
                  onClick={() => setDeleteConfirm(member.id)}
                  className="bg-red-50 text-red-700 px-3 py-2 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Team Member Form */}
      <TeamMemberForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={loadTeamMembers}
      />

      {/* Permission Editor */}
      {selectedMember && (
        <PermissionEditor
          isOpen={showPermissionEditor}
          member={selectedMember}
          onClose={() => {
            setShowPermissionEditor(false);
            setSelectedMember(null);
          }}
          onSuccess={loadTeamMembers}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Team Member</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this team member? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberList;