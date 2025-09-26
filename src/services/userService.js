import { getToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5001/api';

// API call helper with authentication
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network connection failed. Please check if the server is running.');
    }
    throw error;
  }
};

// User Service Functions
export const userService = {
  // Get all users with optional query parameters
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    return await apiCall(endpoint);
  },

  // Get user by ID
  async getUserById(userId) {
    return await apiCall(`/users/${userId}`);
  },

  // Create new user
  async createUser(userData) {
    return await apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user
  async updateUser(userId, userData) {
    return await apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  async deleteUser(userId) {
    return await apiCall(`/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Get user statistics
  async getUserStats() {
    return await apiCall('/users/stats');
  },

  // Bulk update users
  async bulkUpdateUsers(updates) {
    return await apiCall('/users/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  },

  // Approve user
  async approveUser(userId) {
    return await apiCall(`/users/${userId}/approve`, {
      method: 'PUT',
    });
  },

  // Reject user
  async rejectUser(userId, reason = '') {
    return await apiCall(`/users/${userId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  // Change user password (admin only)
  async changeUserPassword(userId, newPassword) {
    return await apiCall(`/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ password: newPassword }),
    });
  },

  // Export users data
  async exportUsers(format = 'csv') {
    return await apiCall(`/users/export?format=${format}`);
  },

  // Search users
  async searchUsers(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return await this.getUsers(params);
  },
};

// Named exports for individual functions
export const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  bulkUpdateUsers,
  approveUser,
  rejectUser,
  changeUserPassword,
  exportUsers,
  searchUsers,
} = userService;

export default userService;