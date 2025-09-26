import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Calendar, Camera, Lock, CreditCard, Shield, Edit3, Save, X, Eye, EyeOff } from 'lucide-react';
import { getCurrentUser, getUserRole, hasPermission } from '../utils/auth';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // Dummy user data
  useEffect(() => {
    const currentUser = getCurrentUser();
    const userRole = getUserRole();
    
    // Simulate user data based on current user
    const userData = {
      id: "user_123",
      name: currentUser?.name || "John Doe",
      email: currentUser?.email || "john.doe@company.com",
      role: userRole || "Admin",
      phone: "+1 (555) 123-4567",
      company: "Tech Solutions Inc.",
      joinedDate: "2023-01-15",
      avatar: null,
      subscription: {
        planName: "Professional Plan",
        price: "$29.99/month",
        status: "Active",
        renewalDate: "2024-02-15"
      }
    };
    
    setUser(userData);
    setEditForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      company: userData.company
    });
  }, []);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({ ...prev, avatar: e.target.result }));
        showNotification('Avatar updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate edit form
  const validateEditForm = () => {
    const errors = {};
    
    if (!editForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!editForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!editForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    if (!validateEditForm()) {
      return;
    }
    
    // Simulate API call
    setUser(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      company: editForm.company
    }));
    
    setIsEditModalOpen(false);
    showNotification('Profile updated successfully!');
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    // Simulate API call
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    showNotification('Password changed successfully!');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="mt-2 text-gray-300">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-8">
          {/* User Information Section */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <User className="mr-2 h-5 w-5" />
                User Information
              </h2>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </button>
            </div>

            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gray-600 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Full Name</label>
                  <p className="mt-1 text-sm text-white">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <p className="mt-1 text-sm text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Role</label>
                  <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                    {user.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  <p className="mt-1 text-sm text-white">{user.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Company</label>
                  <p className="mt-1 text-sm text-white">{user.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Joined Date</label>
                  <p className="mt-1 text-sm text-white">{new Date(user.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center mb-6">
              <Shield className="mr-2 h-5 w-5" />
              Security
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Subscription Section - Only for Customer role */}
          {user.role === 'Customer' && (
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white flex items-center mb-6">
                <CreditCard className="mr-2 h-5 w-5" />
                Subscription
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Current Plan</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Plan Name</label>
                      <p className="mt-1 text-sm text-white">{user.subscription.planName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Price</label>
                      <p className="mt-1 text-sm text-white">{user.subscription.price}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Status</label>
                      <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                        {user.subscription.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Next Renewal</label>
                      <p className="mt-1 text-sm text-white">{new Date(user.subscription.renewalDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-600 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                  <Camera className="h-4 w-4 inline mr-2" />
                  Change Avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label htmlFor="editName" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="editName"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400 ${
                    editErrors.name ? 'border-red-500' : ''
                  }`}
                  required
                />
                {editErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="editEmail" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="editEmail"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className={`mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400 ${
                    editErrors.email ? 'border-red-500' : ''
                  }`}
                  required
                />
                {editErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="editPhone" className="block text-sm font-medium text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  id="editPhone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className={`mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400 ${
                    editErrors.phone ? 'border-red-500' : ''
                  }`}
                  required
                />
                {editErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{editErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="editCompany" className="block text-sm font-medium text-gray-300">
                  Company
                </label>
                <input
                  type="text"
                  id="editCompany"
                  value={editForm.company}
                  onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;