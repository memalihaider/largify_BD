const express = require('express');
const router = express.Router();
const RoleService = require('../services/RoleService');
const { 
  protect, 
  superAdminAccess, 
  adminAccess, 
  requirePermission,
  canManageUser,
  requireOrganizationAccess
} = require('../middleware/authMiddleware.cjs');
const { asyncHandler } = require('../middleware/errorMiddleware.cjs');

// @desc    Create admin/client account
// @route   POST /api/roles/admin
// @access  Super Admin only
router.post('/admin', protect, superAdminAccess, asyncHandler(async (req, res) => {
  const { admin, organization } = await RoleService.createAdminAccount(req.user.id, req.body);
  
  res.status(201).json({
    success: true,
    data: {
      admin: admin.toJSON(),
      organization: organization.toJSON()
    }
  });
}));

// @desc    Create team member
// @route   POST /api/roles/team-member
// @access  Admin only
router.post('/team-member', protect, adminAccess, asyncHandler(async (req, res) => {
  const { permissions = [], ...teamMemberData } = req.body;
  
  const teamMember = await RoleService.createTeamMember(req.user.id, teamMemberData, permissions);
  
  res.status(201).json({
    success: true,
    data: teamMember.toJSON()
  });
}));

// @desc    Get team members
// @route   GET /api/roles/team-members
// @access  Admin only
router.get('/team-members', protect, adminAccess, asyncHandler(async (req, res) => {
  const teamMembers = await RoleService.getTeamMembers(req.user.id);
  
  res.json({
    success: true,
    data: teamMembers.map(member => member.toJSON())
  });
}));

// @desc    Update team member permissions
// @route   PUT /api/roles/team-member/:userId/permissions
// @access  Admin only
router.put('/team-member/:userId/permissions', protect, adminAccess, canManageUser, asyncHandler(async (req, res) => {
  const { permissions } = req.body;
  
  await RoleService.updateTeamMemberPermissions(req.user.id, req.params.userId, permissions);
  
  res.json({
    success: true,
    message: 'Team member permissions updated successfully'
  });
}));

// @desc    Get team member permissions
// @route   GET /api/roles/team-member/:userId/permissions
// @access  Admin only
router.get('/team-member/:userId/permissions', protect, adminAccess, canManageUser, asyncHandler(async (req, res) => {
  const permissions = await RoleService.getTeamMemberPermissions(req.user.id, req.params.userId);
  
  res.json({
    success: true,
    data: permissions
  });
}));

// @desc    Get organization users
// @route   GET /api/roles/organization/:organizationId/users
// @access  Super Admin or Admin
router.get('/organization/:organizationId/users', protect, requireOrganizationAccess, asyncHandler(async (req, res) => {
  const users = await RoleService.getOrganizationUsers(req.user.id, req.params.organizationId);
  
  res.json({
    success: true,
    data: users.map(user => user.toJSON())
  });
}));

// @desc    Get all users (Super Admin only)
// @route   GET /api/roles/users
// @access  Super Admin only
router.get('/users', protect, superAdminAccess, asyncHandler(async (req, res) => {
  const users = await RoleService.getOrganizationUsers(req.user.id);
  
  res.json({
    success: true,
    data: users.map(user => user.toJSON())
  });
}));

// @desc    Get current user's role info
// @route   GET /api/roles/me
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const roleInfo = await RoleService.getUserRoleInfo(req.user.id);
  
  res.json({
    success: true,
    data: roleInfo
  });
}));

// @desc    Check permission
// @route   POST /api/roles/check-permission
// @access  Private
router.post('/check-permission', protect, asyncHandler(async (req, res) => {
  const { permission } = req.body;
  
  if (!permission) {
    return res.status(400).json({
      success: false,
      message: 'Permission parameter required'
    });
  }
  
  const hasPermission = await RoleService.checkPermission(req.user.id, permission);
  
  res.json({
    success: true,
    data: {
      permission,
      hasPermission
    }
  });
}));

// @desc    Get available permissions
// @route   GET /api/roles/permissions
// @access  Admin or Super Admin
router.get('/permissions', protect, adminAccess, asyncHandler(async (req, res) => {
  const permissions = RoleService.getAvailablePermissions();
  
  res.json({
    success: true,
    data: permissions
  });
}));

// @desc    Get user's permissions
// @route   GET /api/roles/user/:userId/permissions
// @access  Admin or Super Admin (can manage user)
router.get('/user/:userId/permissions', protect, canManageUser, asyncHandler(async (req, res) => {
  const permissions = await req.targetUser.getPermissions();
  
  res.json({
    success: true,
    data: permissions
  });
}));

// @desc    Delete team member
// @route   DELETE /api/roles/team-member/:userId
// @access  Admin only
router.delete('/team-member/:userId', protect, adminAccess, canManageUser, asyncHandler(async (req, res) => {
  // Verify it's a team member
  if (req.targetUser.role !== 'team') {
    return res.status(400).json({
      success: false,
      message: 'Can only delete team members'
    });
  }
  
  // Verify the team member belongs to this admin
  if (req.targetUser.parent_user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Cannot delete team member not under your management'
    });
  }
  
  await req.targetUser.delete();
  
  res.json({
    success: true,
    message: 'Team member deleted successfully'
  });
}));

// @desc    Update user role (Super Admin only)
// @route   PUT /api/roles/user/:userId/role
// @access  Super Admin only
router.put('/user/:userId/role', protect, superAdminAccess, canManageUser, asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!role || !['customer', 'team', 'admin', 'superadmin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Valid role required'
    });
  }
  
  // Validate role transition
  if (!RoleService.validateRoleTransition(req.targetUser.role, role, req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid role transition'
    });
  }
  
  await req.targetUser.update({ role });
  
  res.json({
    success: true,
    message: 'User role updated successfully'
  });
}));

module.exports = router;