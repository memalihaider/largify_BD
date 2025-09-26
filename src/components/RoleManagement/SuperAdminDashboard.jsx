import React, { useState, useEffect } from 'react';
import { Users, Building, CreditCard, Settings, BarChart3, UserPlus, Crown, Shield, TrendingUp } from 'lucide-react';
import { getAllUsers, createAdminAccount, getUserRoleInfo } from '../../utils/auth';
import { SuperAdminOnly, UnauthorizedFallback } from './RoleBasedAccess';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalOrganizations: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    recentAdmins: []
  });
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
  const [createAdminData, setCreateAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization_name: '',
    subscription_type: 'basic',
    phone: ''
  });
  const [createAdminError, setCreateAdminError] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Get all users for super admin
      const allUsers = await getAllUsers();
      const adminUsers = allUsers.filter(user => user.role === 'admin');
      
      setAdmins(adminUsers);
      setStats({
        totalAdmins: adminUsers.length,
        totalOrganizations: new Set(adminUsers.map(admin => admin.organization_id)).size,
        activeSubscriptions: adminUsers.filter(admin => admin.subscription_status === 'active').length,
        totalRevenue: adminUsers.reduce((sum, admin) => sum + (admin.subscription_amount || 0), 0),
        recentAdmins: adminUsers
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    if (createAdminData.password !== createAdminData.confirmPassword) {
      setCreateAdminError('Passwords do not match');
      return;
    }

    setIsCreatingAdmin(true);
    setCreateAdminError('');

    try {
      const { confirmPassword, ...adminData } = createAdminData;
      await createAdminAccount(adminData);
      
      // Reset form
      setCreateAdminData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization_name: '',
        subscription_type: 'basic',
        phone: ''
      });
      
      setShowCreateAdminForm(false);
      loadDashboardData();
    } catch (error) {
      setCreateAdminError(error.message || 'Failed to create admin account');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'admins', label: 'Admin Accounts', icon: Users },
    { id: 'organizations', label: 'Organizations', icon: Building },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null, prefix = '', suffix = '' }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {trend && (
            <p className={`text-sm mt-1 flex items-center ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${trend.positive ? '' : 'rotate-180'}`} />
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

  const AdminCard = ({ admin }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{admin.name}</h3>
            <p className="text-sm text-gray-600">{admin.email}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          admin.subscription_status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {admin.subscription_status || 'Active'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Organization:</span>
          <span className="font-medium">{admin.organization_name || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span>Subscription:</span>
          <span className="font-medium capitalize">{admin.subscription_type || 'Basic'}</span>
        </div>
        <div className="flex justify-between">
          <span>Team Members:</span>
          <span className="font-medium">{admin.team_member_count || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Joined:</span>
          <span className="font-medium">{new Date(admin.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <SuperAdminOnly fallback={<UnauthorizedFallback message="You need Super Admin privileges to access this dashboard." />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Crown className="w-8 h-8 text-purple-600 mr-3" />
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">System-wide management and oversight</p>
          </div>
          <button
            onClick={() => setShowCreateAdminForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Admin Account</span>
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
                      ? 'border-purple-500 text-purple-600'
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
                  title="Total Admins"
                  value={stats.totalAdmins}
                  icon={Users}
                  color="purple"
                />
                <StatCard
                  title="Organizations"
                  value={stats.totalOrganizations}
                  icon={Building}
                  color="blue"
                />
                <StatCard
                  title="Active Subscriptions"
                  value={stats.activeSubscriptions}
                  icon={CreditCard}
                  color="green"
                />
                <StatCard
                  title="Monthly Revenue"
                  value={stats.totalRevenue}
                  icon={TrendingUp}
                  color="emerald"
                  prefix="$"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Admin Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.recentAdmins.map((admin) => (
                    <AdminCard key={admin.id} admin={admin} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Admin Accounts</h3>
                <button
                  onClick={() => setShowCreateAdminForm(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                  <AdminCard key={admin.id} admin={admin} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'organizations' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizations</h3>
              <p className="text-gray-600">Organization management features coming soon.</p>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Management</h3>
              <p className="text-gray-600">Subscription management features coming soon.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <p className="text-gray-600">System configuration options coming soon.</p>
            </div>
          )}
        </div>

        {/* Create Admin Form Modal */}
        {showCreateAdminForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Create Admin Account</h2>
                <button
                  onClick={() => setShowCreateAdminForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
                {createAdminError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {createAdminError}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={createAdminData.name}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={createAdminData.email}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={createAdminData.organization_name}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, organization_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={createAdminData.password}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={createAdminData.confirmPassword}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Type</label>
                  <select
                    value={createAdminData.subscription_type}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, subscription_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateAdminForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingAdmin}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreatingAdmin ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SuperAdminOnly>
  );
};

export default SuperAdminDashboard;