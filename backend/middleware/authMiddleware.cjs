const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./errorMiddleware.cjs');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // Add user to request object (without password)
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approval_status: user.approval_status,
        is_active: user.is_active,
        parent_user_id: user.parent_user_id,
        organization_id: user.organization_id,
        subscription_id: user.subscription_id,
        hasPermission: user.hasPermission.bind(user),
        canManageUser: user.canManageUser.bind(user),
        getPermissions: user.getPermissions.bind(user)
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user.role} is not authorized to access this route`);
    }

    next();
  };
};

// Check if user is approved (for customers)
const requireApproval = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'customer' && req.user.approval_status !== 'approved') {
    res.status(403);
    throw new Error('Account pending approval. Please contact administrator.');
  }
  next();
});

// Admin or higher access
const adminAccess = authorize('admin', 'superadmin');

// Super admin only access
const superAdminAccess = authorize('superadmin');

// Team member or higher access
const teamAccess = authorize('team', 'admin', 'superadmin');

// Customer access (approved customers only)
const customerAccess = [
  authorize('customer', 'team', 'admin', 'superadmin'),
  requireApproval
];

// Permission-based access control (granular permissions)
const requirePermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const hasPermission = await req.user.hasPermission(permission);
    if (!hasPermission) {
      res.status(403);
      throw new Error(`Permission denied: ${permission} required`);
    }

    next();
  });
};

// Check if user can manage target user (hierarchical check)
const canManageUser = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const targetUserId = req.params.userId || req.body.userId;
  if (!targetUserId) {
    res.status(400);
    throw new Error('Target user ID required');
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    res.status(404);
    throw new Error('Target user not found');
  }

  if (!req.user.canManageUser(targetUser)) {
    res.status(403);
    throw new Error('Cannot manage this user');
  }

  req.targetUser = targetUser;
  next();
});

// Organization access control
const requireOrganizationAccess = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const organizationId = req.params.organizationId || req.body.organizationId;
  
  // Super admin can access any organization
  if (req.user.role === 'superadmin') {
    return next();
  }

  // Admin can only access their own organization
  if (req.user.role === 'admin') {
    if (!organizationId || organizationId !== req.user.organization_id) {
      res.status(403);
      throw new Error('Organization access denied');
    }
    return next();
  }

  // Team members can only access their organization
  if (req.user.role === 'team') {
    if (!organizationId || organizationId !== req.user.organization_id) {
      res.status(403);
      throw new Error('Organization access denied');
    }
    return next();
  }

  res.status(403);
  throw new Error('Organization access denied');
});

module.exports = {
  protect,
  authorize,
  requireApproval,
  requirePermission,
  canManageUser,
  requireOrganizationAccess,
  adminAccess,
  superAdminAccess,
  teamAccess,
  customerAccess
};