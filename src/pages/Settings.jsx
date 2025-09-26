import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun,
  Bell,
  Key,
  CreditCard,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package
} from 'lucide-react';

const Settings = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Notification states
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    realTime: false
  });

  // API Configuration states
  const [apiKeys, setApiKeys] = useState({
    chatbot: '',
    payment: ''
  });
  const [showApiKeys, setShowApiKeys] = useState({
    chatbot: false,
    payment: false
  });

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // User role (this would come from auth context in real app)
  const [userRole, setUserRole] = useState('super_admin'); // super_admin, admin, team_member, customer

  // Dummy data
  const paymentMethods = [
    { id: 1, type: 'Bank Transfer', details: '**** 1234', status: 'Active' },
    { id: 2, type: 'Stripe', details: '**** 5678', status: 'Active' },
    { id: 3, type: 'PayPal', details: 'user@example.com', status: 'Inactive' }
  ];

  const subscriptionPlans = [
    { id: 1, name: 'Basic', price: '$9.99', description: 'Basic features for small teams', status: 'Active' },
    { id: 2, name: 'Pro', price: '$19.99', description: 'Advanced features for growing businesses', status: 'Active' },
    { id: 3, name: 'Enterprise', price: '$49.99', description: 'Full features for large organizations', status: 'Active' }
  ];

  // Persist dark mode to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // In a real app, you'd apply the theme to the document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Role-based access control
  const hasAccess = (section) => {
    const permissions = {
      super_admin: ['theme', 'notifications', 'api', 'payment', 'subscription', 'security'],
      admin: ['theme', 'notifications', 'api', 'payment', 'security'],
      team_member: ['theme', 'notifications'],
      customer: ['theme', 'notifications', 'payment']
    };
    return permissions[userRole]?.includes(section) || false;
  };

  // Toggle component
  const Toggle = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // API Key validation
  const validateApiKey = (key) => {
    return key.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(key);
  };

  const handleSaveApiKeys = () => {
    if (apiKeys.chatbot && !validateApiKey(apiKeys.chatbot)) {
      alert('Invalid Chatbot API Key format');
      return;
    }
    if (apiKeys.payment && !validateApiKey(apiKeys.payment)) {
      alert('Invalid Payment API Key format');
      return;
    }
    // Save API keys functionality would be implemented here
    alert('API Keys saved successfully!');
  };

  // Modal components
  const EditModal = () => (
    showEditModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-96">
          <h3 className="text-lg font-semibold text-white mb-4">Edit {selectedItem?.type}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter details"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Editing:', selectedItem);
                  setShowEditModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const DeleteConfirmModal = () => (
    showDeleteConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-96">
          <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
          <p className="text-gray-300 mb-6">Are you sure you want to delete this item?</p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log('Deleting:', selectedItem);
                setShowDeleteConfirm(false);
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );

  const AddPlanModal = () => (
    showAddPlanModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-96">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Plan</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Plan Name"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Price (e.g., $9.99)"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <textarea
              placeholder="Description"
              rows="3"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddPlanModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Adding new plan');
                  setShowAddPlanModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Add Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-gray-400 mt-2">Manage your account preferences and configurations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme & Display */}
          {hasAccess('theme') && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                {darkMode ? <Moon className="h-6 w-6 text-blue-500" /> : <Sun className="h-6 w-6 text-yellow-500" />}
                <h2 className="text-xl font-semibold">Theme & Display</h2>
              </div>
              <div className="space-y-4">
                <Toggle
                  enabled={darkMode}
                  onChange={setDarkMode}
                  label="Dark Mode"
                />
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                  <span>Current theme: {darkMode ? 'Dark' : 'Light'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {hasAccess('notifications') && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <div className="space-y-4">
                <Toggle
                  enabled={notifications.email}
                  onChange={(value) => setNotifications(prev => ({ ...prev, email: value }))}
                  label="Email Notifications"
                />
                <Toggle
                  enabled={notifications.inApp}
                  onChange={(value) => setNotifications(prev => ({ ...prev, inApp: value }))}
                  label="In-App Notifications"
                />
                <Toggle
                  enabled={notifications.realTime}
                  onChange={(value) => setNotifications(prev => ({ ...prev, realTime: value }))}
                  label="Real-time Alerts"
                />
              </div>
            </div>
          )}

          {/* API Configurations */}
          {hasAccess('api') && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Key className="h-6 w-6 text-purple-500" />
                <h2 className="text-xl font-semibold">API Configurations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    AI Chatbot API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeys.chatbot ? 'text' : 'password'}
                      value={apiKeys.chatbot}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, chatbot: e.target.value }))}
                      placeholder="Enter your chatbot API key"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white pr-10"
                    />
                    <button
                      onClick={() => setShowApiKeys(prev => ({ ...prev, chatbot: !prev.chatbot }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showApiKeys.chatbot ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Gateway API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeys.payment ? 'text' : 'password'}
                      value={apiKeys.payment}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, payment: e.target.value }))}
                      placeholder="Enter your payment API key"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white pr-10"
                    />
                    <button
                      onClick={() => setShowApiKeys(prev => ({ ...prev, payment: !prev.payment }))}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showApiKeys.payment ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveApiKeys}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Save API Keys
              </button>
            </div>
          )}

          {/* Payment Methods */}
          {hasAccess('payment') && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-green-500" />
                  <h2 className="text-xl font-semibold">Payment Methods</h2>
                </div>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white">{method.type}</h3>
                      <p className="text-sm text-gray-400">{method.details}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        method.status === 'Active' ? 'bg-green-900 text-green-200' : 'bg-gray-600 text-gray-300'
                      }`}>
                        {method.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(method);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(method);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {userRole === 'super_admin' && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-white mb-2">Super Admin Controls</h3>
                  <p className="text-sm text-gray-400 mb-3">Manage global payment settings and bank account details</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors">
                    Manage Bank Details
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Subscription Plans (Super Admin only) */}
          {hasAccess('subscription') && userRole === 'super_admin' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-xl font-semibold">Subscription Plans</h2>
                </div>
                <button
                  onClick={() => setShowAddPlanModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Plan</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300">Plan Name</th>
                      <th className="text-left py-3 px-4 text-gray-300">Price</th>
                      <th className="text-left py-3 px-4 text-gray-300">Description</th>
                      <th className="text-left py-3 px-4 text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionPlans.map((plan) => (
                      <tr key={plan.id} className="border-b border-gray-700">
                        <td className="py-3 px-4 text-white">{plan.name}</td>
                        <td className="py-3 px-4 text-white">{plan.price}</td>
                        <td className="py-3 px-4 text-gray-300">{plan.description}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            plan.status === 'Active' ? 'bg-green-900 text-green-200' : 'bg-gray-600 text-gray-300'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedItem(plan);
                                setShowEditModal(true);
                              }}
                              className="p-1 text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(plan);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {hasAccess('security') && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-red-500" />
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                </div>
              <div className="space-y-4">
                <Toggle
                  enabled={twoFactorEnabled}
                  onChange={setTwoFactorEnabled}
                  label="Two-Factor Authentication (2FA)"
                />
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className={`w-3 h-3 rounded-full ${twoFactorEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>2FA Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                {twoFactorEnabled && (
                  <div className="mt-4 p-3 bg-green-900 bg-opacity-20 border border-green-700 rounded-lg">
                    <p className="text-sm text-green-300">
                      Two-factor authentication is active. Your account has an extra layer of security.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Role Selector (for demo purposes) */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Demo: User Role</h2>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="team_member">Team Member</option>
              <option value="customer">Customer</option>
            </select>
            <p className="text-sm text-gray-400 mt-2">
              Change role to see different access levels
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditModal />
      <DeleteConfirmModal />
      <AddPlanModal />
    </div>
  );
};

export default Settings;