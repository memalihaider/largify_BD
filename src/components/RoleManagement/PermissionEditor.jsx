import React, { useState, useEffect } from 'react';
import { X, Shield, Check, Save, User } from 'lucide-react';
import { updateTeamMemberPermissions, getAvailablePermissions } from '../../utils/auth';

const PermissionEditor = ({ isOpen, member, onClose, onSuccess }) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen && member) {
      loadAvailablePermissions();
      setSelectedPermissions(member.permissions || []);
    }
  }, [isOpen, member]);

  useEffect(() => {
    if (member && member.permissions) {
      const originalPermissions = member.permissions.sort();
      const currentPermissions = selectedPermissions.sort();
      setHasChanges(JSON.stringify(originalPermissions) !== JSON.stringify(currentPermissions));
    }
  }, [selectedPermissions, member]);

  const loadAvailablePermissions = async () => {
    try {
      const permissions = await getAvailablePermissions();
      setAvailablePermissions(permissions);
    } catch (error) {
      console.error('Failed to load permissions:', error);
      setError('Failed to load available permissions');
    }
  };

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleCategoryToggle = (category) => {
    const categoryPermissions = category.permissions;
    const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      // Remove all category permissions
      setSelectedPermissions(prev => 
        prev.filter(p => !categoryPermissions.includes(p))
      );
    } else {
      // Add all category permissions
      setSelectedPermissions(prev => {
        const newPermissions = [...prev];
        categoryPermissions.forEach(p => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p);
          }
        });
        return newPermissions;
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await updateTeamMemberPermissions(member.id, selectedPermissions);
      onSuccess?.();
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to update permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedPermissions(member.permissions || []);
  };

  const getPermissionCount = () => {
    return selectedPermissions.length;
  };

  const getCategoryStats = (category) => {
    const total = category.permissions.length;
    const selected = category.permissions.filter(p => selectedPermissions.includes(p)).length;
    return { selected, total };
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Permissions</h2>
              <p className="text-sm text-gray-600">{member.name} • {member.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Permission Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {getPermissionCount()} permissions selected
                </span>
              </div>
              {hasChanges && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-700">Unsaved changes</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          {/* Permission Categories */}
          <div className="space-y-6">
            {availablePermissions.map((category) => {
              const stats = getCategoryStats(category);
              const allSelected = stats.selected === stats.total;
              const someSelected = stats.selected > 0 && stats.selected < stats.total;
              
              return (
                <div key={category.category} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          allSelected
                            ? 'bg-blue-100 text-blue-800'
                            : someSelected
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                          allSelected
                            ? 'bg-blue-600 border-blue-600'
                            : someSelected
                            ? 'bg-yellow-500 border-yellow-500'
                            : 'border-gray-300'
                        }`}>
                          {allSelected && <Check className="w-3 h-3 text-white" />}
                          {someSelected && !allSelected && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span>{category.category}</span>
                      </button>
                      
                      <span className="text-sm text-gray-500">
                        {stats.selected}/{stats.total} selected
                      </span>
                    </div>
                    
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-2 ml-10">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Category Permissions */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.permissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission)}
                            onChange={() => handlePermissionToggle(permission)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">
                              {permission.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <p className="text-xs text-gray-500">
                              {getPermissionDescription(permission)}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Reset to original
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get permission descriptions
const getPermissionDescription = (permission) => {
  const descriptions = {
    'dashboard.view': 'View dashboard and analytics',
    'dashboard.manage': 'Manage dashboard settings',
    'users.view': 'View user information',
    'users.create': 'Create new users',
    'users.edit': 'Edit user information',
    'users.delete': 'Delete users',
    'contacts.view': 'View contact information',
    'contacts.create': 'Create new contacts',
    'contacts.edit': 'Edit contact information',
    'contacts.delete': 'Delete contacts',
    'reports.view': 'View reports',
    'reports.create': 'Create new reports',
    'reports.export': 'Export reports',
    'settings.view': 'View system settings',
    'settings.manage': 'Manage system settings',
    'billing.view': 'View billing information',
    'billing.manage': 'Manage billing and payments'
  };
  
  return descriptions[permission] || 'Access to this feature';
};

export default PermissionEditor;