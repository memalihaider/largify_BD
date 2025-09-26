import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Settings, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getTeamMembers, getOrganizationUsers, getUserRoleInfo } from '../../utils/auth';
import TeamMemberList from './TeamMemberList';
import TeamMemberForm from './TeamMemberForm';
import { AdminOnly, RequirePermission } from './RoleBasedAccess';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [teamMembers, userInfo] = await Promise.all([
        getTeamMembers(),
        getUserRoleInfo()
      ]);

      const activeMembers = teamMembers.filter(member => member.status === 'active').length;
      const pendingMembers = teamMembers.filter(member => member.status === 'pending').length;

      setStats({
        totalMembers: teamMembers.length,
        activeMembers,
        pendingMembers,
        recentActivity: teamMembers
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value} {trend.label}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ member, type = 'joined' }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        {type === 'joined' ? (
          <UserPlus className="w-4 h-4 text-blue-600" />
        ) : (
          <CheckCircle className="w-4 h-4 text-green-600" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{member.name}</p>
        <p className="text-xs text-gray-500">
          {type === 'joined' ? 'Joined the team' : 'Updated permissions'} • 
          {new Date(member.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminOnly fallback={
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need admin privileges to access this dashboard.</p>
      </div>
    }>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your team and permissions</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Members"
                  value={stats.totalMembers}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Active Members"
                  value={stats.activeMembers}
                  icon={CheckCircle}
                  color="green"
                />
                <StatCard
                  title="Pending Members"
                  value={stats.pendingMembers}
                  icon={Clock}
                  color="yellow"
                />
                <StatCard
                  title="Permission Groups"
                  value="4"
                  icon={Shield}
                  color="purple"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((member) => (
                        <ActivityItem key={member.id} member={member} />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                    >
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Add Team Member</p>
                        <p className="text-sm text-gray-600">Invite a new member to your team</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('permissions')}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                    >
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Manage Permissions</p>
                        <p className="text-sm text-gray-600">Configure team member access</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                    >
                      <Settings className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Team Settings</p>
                        <p className="text-sm text-gray-600">Configure team preferences</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <TeamMemberList />
          )}

          {activeTab === 'permissions' && (
            <RequirePermission permission="users.manage" fallback={
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Permission Required</h3>
                <p className="text-gray-600">You need user management permissions to access this section.</p>
              </div>
            }>
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Management</h3>
                <p className="text-gray-600">
                  Permission management features are integrated into the team member management interface. 
                  Use the "Permissions" button on each team member card to manage their access rights.
                </p>
                <button
                  onClick={() => setActiveTab('members')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Team Members
                </button>
              </div>
            </RequirePermission>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Permissions for New Members
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Basic Access</option>
                    <option>Standard Access</option>
                    <option>Advanced Access</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter team name"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoApprove"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="autoApprove" className="ml-2 text-sm text-gray-700">
                    Auto-approve new team member requests
                  </label>
                </div>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Team Member Form */}
        <TeamMemberForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={loadDashboardData}
        />
      </div>
    </AdminOnly>
  );
};

export default AdminDashboard;