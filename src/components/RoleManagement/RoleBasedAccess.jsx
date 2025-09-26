import React from 'react';
import { hasRole, hasPermission, canManageUser } from '../../utils/auth';

const RoleBasedAccess = ({ 
  children, 
  roles = [], 
  permissions = [], 
  requireAll = false,
  fallback = null,
  userId = null,
  showFallback = true
}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Check role-based access
  const hasRequiredRole = () => {
    if (roles.length === 0) return true;
    
    if (requireAll) {
      return roles.every(role => hasRole(role));
    } else {
      return roles.some(role => hasRole(role));
    }
  };

  // Check permission-based access
  const hasRequiredPermission = () => {
    if (permissions.length === 0) return true;
    
    if (requireAll) {
      return permissions.every(permission => hasPermission(permission));
    } else {
      return permissions.some(permission => hasPermission(permission));
    }
  };

  // Check user management access
  const hasUserManagementAccess = () => {
    if (!userId) return true;
    return canManageUser(userId);
  };

  // Determine if user has access
  const hasAccess = hasRequiredRole() && hasRequiredPermission() && hasUserManagementAccess();

  if (!hasAccess) {
    if (showFallback && fallback) {
      return fallback;
    }
    return null;
  }

  return children;
};

// Higher-order component for role-based access
export const withRoleAccess = (WrappedComponent, accessConfig = {}) => {
  return function RoleAccessComponent(props) {
    return (
      <RoleBasedAccess {...accessConfig}>
        <WrappedComponent {...props} />
      </RoleBasedAccess>
    );
  };
};

// Specific access control components
export const SuperAdminOnly = ({ children, fallback = null }) => (
  <RoleBasedAccess roles={['super_admin']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const AdminOnly = ({ children, fallback = null }) => (
  <RoleBasedAccess roles={['admin', 'super_admin']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const TeamMemberOnly = ({ children, fallback = null }) => (
  <RoleBasedAccess roles={['team_member']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const AdminOrSuperAdmin = ({ children, fallback = null }) => (
  <RoleBasedAccess roles={['admin', 'super_admin']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

// Permission-based components
export const RequirePermission = ({ permission, children, fallback = null }) => (
  <RoleBasedAccess permissions={[permission]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const RequirePermissions = ({ permissions, requireAll = false, children, fallback = null }) => (
  <RoleBasedAccess permissions={permissions} requireAll={requireAll} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

// User management access
export const CanManageUser = ({ userId, children, fallback = null }) => (
  <RoleBasedAccess userId={userId} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

// Unauthorized access fallback component
export const UnauthorizedFallback = ({ message = "You don't have permission to access this feature." }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a4 4 0 00-8 0v2m0 0V9a4 4 0 018 0v2m-8 0h8m-8 0V9a4 4 0 018 0v2" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

// Hook for checking access in components
export const useRoleAccess = (roles = [], permissions = [], requireAll = false) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const hasRequiredRole = () => {
    if (roles.length === 0) return true;
    
    if (requireAll) {
      return roles.every(role => hasRole(role));
    } else {
      return roles.some(role => hasRole(role));
    }
  };

  const hasRequiredPermission = () => {
    if (permissions.length === 0) return true;
    
    if (requireAll) {
      return permissions.every(permission => hasPermission(permission));
    } else {
      return permissions.some(permission => hasPermission(permission));
    }
  };

  return {
    hasAccess: hasRequiredRole() && hasRequiredPermission(),
    hasRole: (role) => hasRole(role),
    hasPermission: (permission) => hasPermission(permission),
    canManageUser: (userId) => canManageUser(userId),
    user
  };
};

export default RoleBasedAccess;