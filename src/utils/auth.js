const API_BASE_URL = 'http://localhost:5001/api';

// Token management
export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userApprovalStatus');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Role normalization - convert backend format to frontend format
const normalizeRole = (backendRole) => {
  const roleMap = {
    'superadmin': 'Super Admin',
    'admin': 'Admin',
    'team': 'Team Member',
    'customer': 'Customer'
  };
  return roleMap[backendRole] || backendRole;
};

// User role and approval management
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const setUserRole = (role) => {
  // Normalize the role before storing
  const normalizedRole = normalizeRole(role);
  localStorage.setItem('userRole', normalizedRole);
};

export const getUserApprovalStatus = () => {
  return localStorage.getItem('userApprovalStatus') === 'true';
};

export const setUserApprovalStatus = (isApproved) => {
  localStorage.setItem('userApprovalStatus', isApproved.toString());
};

// Role-based access control (enhanced for hierarchical roles)
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  const roleHierarchy = {
    'Super Admin': 4,
    'Admin': 3,
    'Team Member': 2,
    'Customer': 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Check specific permission (granular permissions)
export const hasPermission = async (permission) => {
  try {
    const response = await apiCall('/roles/check-permission', {
      method: 'POST',
      body: JSON.stringify({ permission }),
    });
    
    return response.success && response.data.hasPermission;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};

// Get user's permissions
export const getUserPermissions = async () => {
  try {
    const response = await apiCall('/roles/me');
    return response.success ? response.data.permissions : [];
  } catch (error) {
    console.error('Failed to get user permissions:', error);
    return [];
  }
};

// Check if user can manage another user
export const canManageUser = (targetUserId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  // Super Admin can manage everyone
  if (currentUser.role === 'Super Admin') return true;
  
  // Admin can manage team members
  if (currentUser.role === 'Admin') {
    // This would need to be checked against the actual user data
    // For now, we'll return true for admins
    return true;
  }
  
  // Users can only manage themselves
  return currentUser.id === targetUserId;
};

// Get user's role information
export const getUserRoleInfo = async () => {
  try {
    const response = await apiCall('/roles/me');
    return response.success ? response.data : null;
  } catch (error) {
    console.error('Failed to get user role info:', error);
    return null;
  }
};

export const isApprovedCustomer = () => {
  const role = getUserRole();
  const isApproved = getUserApprovalStatus();
  return role === 'Customer' && isApproved;
};

export const canAccessAdminFeatures = () => {
  const userRole = getUserRole();
  return userRole === 'Admin' || userRole === 'Super Admin';
};

export const canAccessSuperAdminFeatures = () => {
  return hasRole('Super Admin');
};

// Get current user information
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: getUserRole(),
      name: payload.username // Using username as name for now
    };
  } catch (error) {
    return null;
  }
};

// Permission system for specific actions (legacy - keeping for backward compatibility)
export const hasLegacyPermission = (userRole, action) => {
  const permissions = {
    'super_admin': ['create_deals', 'edit_all_deals', 'delete_deals', 'view_all_deals', 'view_reports'],
    'admin': ['create_deals', 'edit_business_deals', 'view_business_deals', 'view_reports'],
    'team_member': ['view_assigned_deals', 'edit_assigned_deals'],
    'customer': []
  };
  
  const roleKey = userRole?.toLowerCase().replace(' ', '_');
  return permissions[roleKey]?.includes(action) || false;
};

// API call helper
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    method: 'GET', // Default method
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

// Authentication API functions
export const registerUser = async (userData) => {
  try {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      setToken(response.data.token);
      
      // Store user role and approval status
      if (response.data.user) {
        setUserRole(response.data.user.role);
        setUserApprovalStatus(response.data.user.approval_status === 'approved');
      }
    }
    
    return response;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};

// Role-specific registration functions
export const registerCustomer = async (customerData) => {
  try {
    const response = await apiCall('/auth/register/customer', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    
    if (response.success && response.data.token) {
      setToken(response.data.token);
      
      // Store user role and approval status
      if (response.data.user) {
        setUserRole(response.data.user.role);
        setUserApprovalStatus(response.data.user.approval_status === 'approved');
      }
    }
    
    return response;
  } catch (error) {
    throw new Error(error.message || 'Customer registration failed');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiCall('/auth/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    return response;
  } catch (error) {
    throw new Error(error.message || 'User creation failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      setToken(response.data.token);
      
      // Store user role and approval status
      if (response.data.user) {
        setUserRole(response.data.user.role);
        setUserApprovalStatus(response.data.user.approval_status === 'approved');
      }
    }
    
    return response;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    await apiCall('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    removeToken();
  }
};

// Role management API functions
export const createAdminAccount = async (adminData) => {
  try {
    const response = await apiCall('/roles/admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
    
    return response;
  } catch (error) {
    throw new Error(error.message || 'Admin account creation failed');
  }
};

export const createTeamMember = async (teamMemberData, permissions = []) => {
  try {
    const response = await apiCall('/roles/team-member', {
      method: 'POST',
      body: JSON.stringify({ ...teamMemberData, permissions }),
    });
    
    return response;
  } catch (error) {
    throw new Error(error.message || 'Team member creation failed');
  }
};

export const getTeamMembers = async () => {
  try {
    const response = await apiCall('/roles/team-members');
    return response.success ? response.data : [];
  } catch (error) {
    console.error('Failed to get team members:', error);
    return [];
  }
};

export const updateTeamMemberPermissions = async (userId, permissions) => {
  try {
    const response = await apiCall(`/roles/team-member/${userId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
    
    return response;
  } catch (error) {
    throw new Error(error.message || 'Permission update failed');
  }
};

export const getTeamMemberPermissions = async (userId) => {
  try {
    const response = await apiCall(`/roles/team-member/${userId}/permissions`);
    return response.success ? response.data : [];
  } catch (error) {
    console.error('Failed to get team member permissions:', error);
    return [];
  }
};

export const getAvailablePermissions = async () => {
  try {
    const response = await apiCall('/roles/permissions');
    return response.success ? response.data : [];
  } catch (error) {
    console.error('Failed to get available permissions:', error);
    return [];
  }
};

export const getOrganizationUsers = async (organizationId) => {
  try {
    const response = await apiCall(`/roles/organization/${organizationId}/users`);
    return response.success ? response.data : [];
  } catch (error) {
    console.error('Failed to get organization users:', error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiCall('/roles/users');
    return response.success ? response.data : [];
  } catch (error) {
    console.error('Failed to get all users:', error);
    return [];
  }
};

export const deleteTeamMember = async (userId) => {
  try {
    const response = await apiCall(`/roles/team-member/${userId}`, {
      method: 'DELETE',
    });
    
    return response;
  } catch (error) {
    throw new Error(error.message || 'Team member deletion failed');
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiCall('/auth/profile');
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to get user profile');
  }
};

// Form validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: minLength && hasLowerCase && hasUpperCase && hasNumber,
    errors: {
      minLength: !minLength ? 'Password must be at least 6 characters long' : null,
      hasLowerCase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      hasUpperCase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      hasNumber: !hasNumber ? 'Password must contain at least one number' : null,
    }
  };
};

export const validateUsername = (username) => {
  const minLength = username.length >= 3;
  const maxLength = username.length <= 50;
  const validChars = /^[a-zA-Z0-9_]+$/.test(username);
  
  return {
    isValid: minLength && maxLength && validChars,
    errors: {
      minLength: !minLength ? 'Username must be at least 3 characters long' : null,
      maxLength: !maxLength ? 'Username must be no more than 50 characters long' : null,
      validChars: !validChars ? 'Username can only contain letters, numbers, and underscores' : null,
    }
  };
};