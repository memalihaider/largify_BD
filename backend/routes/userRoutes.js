const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware.cjs');
const {
  validateUserCreation,
  validateUserUpdate,
  validateUserId,
  validateUserQuery,
  validateBulkUpdate,
  sanitizeUserInput
} = require('../middleware/validationMiddleware');
const {
  securityLogger,
  userActivityLogger,
  errorLogger,
  performanceLogger
} = require('../middleware/loggingMiddleware');

const router = express.Router();

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin/Superadmin)
router.post('/', protect, authorize('admin', 'superadmin'), (req, res, next) => {
  console.log('POST /api/users route reached, body:', req.body);
  console.log('Using validateUserCreation middleware');
  next();
}, sanitizeUserInput, (req, res, next) => {
  console.log('After sanitization, body:', req.body);
  next();
}, validateUserCreation, (req, res, next) => {
  console.log('After validation, proceeding to handler');
  next();
}, async (req, res) => {
  try {
    const { email, password, first_name, last_name, role = 'customer' } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Only superadmin can create superadmin users
    if (role === 'superadmin' && req.user.role !== 'superadmin') {
      securityLogger.unauthorizedAccess(
        req.user.id,
        req.user.email,
        'create_superadmin_user',
        req.ip,
        req.get('User-Agent')
      );
      
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can create superadmin users'
      });
    }

    const userData = {
      name: `${first_name} ${last_name}`.trim(),
      email,
      password,
      role,
      approval_status: 'approved', // Admin-created users are auto-approved
      is_active: true,
      metadata_created_by: req.user.id
    };

    const user = await User.create(userData);

    // Log user creation
    securityLogger.userCreated(
      user.id,
      user.email,
      req.user.id,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          approval_status: user.approval_status,
          is_active: user.is_active,
          created_at: user.created_at
        }
      }
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'create_user' });
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating user'
    });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Team/Admin/Superadmin)
router.get('/', protect, authorize('team', 'admin', 'superadmin'), validateUserQuery, async (req, res) => {
  try {
    const startTime = Date.now();
    
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      approval_status = '',
      is_active = '',
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (approval_status) filters.approval_status = approval_status;
    if (is_active !== '') filters.is_active = is_active === 'true';

    const users = await User.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      filters,
      sortBy: sort_by,
      sortOrder: sort_order
    });

    // Log user list access
    userActivityLogger.userListAccessed(req.user.id, req.ip);

    // Log performance
    performanceLogger.logPerformance(
      'get_users',
      Date.now() - startTime,
      req.user.id
    );

    res.json({
      success: true,
      data: {
        users: users.data,
        pagination: users.pagination,
        filters: {
          search,
          role,
          approval_status,
          is_active,
          sort_by,
          sort_order
        }
      }
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'get_users' });
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private (Team/Admin/Superadmin)
router.get('/stats/overview', protect, authorize('team', 'admin', 'superadmin'), async (req, res) => {
  try {
    const stats = await User.getStats();

    // Log stats access
    userActivityLogger.userStatsAccessed(req.user.id, req.ip);

    res.json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'get_user_stats' });
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user statistics'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Team/Admin/Superadmin)
router.get('/:id', protect, authorize('team', 'admin', 'superadmin'), validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has permission to view this user
    if (req.user.role === 'team' && user.role !== 'customer') {
      securityLogger.unauthorizedAccess(
        req.user.id,
        req.user.email,
        `view_user_${id}`,
        req.ip,
        req.get('User-Agent')
      );
      
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to view this user'
      });
    }

    // Log user profile view
    userActivityLogger.userViewed(
      parseInt(id),
      req.user.id,
      req.ip
    );

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'get_user_by_id', userId: req.params.id });
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user'
    });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin/Team)
router.put('/:id', protect, authorize('admin', 'team'), sanitizeUserInput, validateUserUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Store original values for logging
    const originalRole = user.role;
    const originalApprovalStatus = user.approval_status;

    // Role-based permission checks
    if (req.user.role === 'team') {
      // Team can only update customer users and limited fields
      if (user.role !== 'customer') {
        securityLogger.unauthorizedAccess(
          req.user.id,
          req.user.email,
          `update_non_customer_${id}`,
          req.ip,
          req.get('User-Agent')
        );
        
        return res.status(403).json({
          success: false,
          message: 'Team members can only update customer users'
        });
      }

      // Restrict fields that team can update
      const allowedFields = ['approval_status', 'is_active', 'notes'];
      const updateFields = Object.keys(updates);
      const unauthorizedFields = updateFields.filter(field => !allowedFields.includes(field));
      
      if (unauthorizedFields.length > 0) {
        return res.status(403).json({
          success: false,
          message: `Team members cannot update these fields: ${unauthorizedFields.join(', ')}`
        });
      }
    }

    // Only superadmin can assign superadmin role
    if (updates.role === 'superadmin' && req.user.role !== 'superadmin') {
      securityLogger.unauthorizedAccess(
        req.user.id,
        req.user.email,
        `assign_superadmin_role_${id}`,
        req.ip,
        req.get('User-Agent')
      );
      
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can assign superadmin role'
      });
    }

    // Prepare update data with metadata
    const updateData = {
      ...updates,
      metadata_last_modified_by: req.user.id,
      metadata_last_modified_at: new Date()
    };

    // Track what fields are being updated
    const updatedFields = Object.keys(updates);

    const updatedUser = await User.update(id, updateData);

    // Log role changes
    if (updates.role && originalRole !== updates.role) {
      securityLogger.roleChanged(
        parseInt(id),
        user.email,
        originalRole,
        updates.role,
        req.user.id,
        req.ip
      );
    }

    // Log approval status changes
    if (updates.approval_status && originalApprovalStatus !== updates.approval_status) {
      securityLogger.approvalStatusChanged(
        parseInt(id),
        user.email,
        originalApprovalStatus,
        updates.approval_status,
        req.user.id,
        req.ip
      );
    }

    // Log user update activity
    userActivityLogger.userUpdated(
      parseInt(id),
      req.user.id,
      updatedFields,
      req.ip
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser,
        updated_fields: updatedFields
      }
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'update_user', userId: req.params.id });
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin/Superadmin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deletion of superadmin by non-superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      securityLogger.unauthorizedAccess(
        req.user.id,
        req.user.email,
        `delete_superadmin_${id}`,
        req.ip,
        req.get('User-Agent')
      );
      
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can delete superadmin users'
      });
    }

    // Prevent self-deletion
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.delete();

    // Log user deletion
    securityLogger.userDeleted(
      parseInt(id),
      user.email,
      req.user.id,
      req.ip
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'delete_user', userId: req.params.id });
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
});

// @desc    Approve user
// @route   PUT /api/users/:id/approve
// @access  Private (Team/Admin/Superadmin)
router.put('/:id/approve', protect, authorize('team', 'admin', 'superadmin'), validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.approval_status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'User is already approved'
      });
    }

    const updatedUser = await User.update(id, {
      approval_status: 'approved',
      metadata_last_modified_by: req.user.id
    });

    // Log approval action
    securityLogger.userApproved(
      parseInt(id),
      user.email,
      req.user.id,
      req.ip
    );

    res.json({
      success: true,
      message: 'User approved successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'approve_user', userId: req.params.id });
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving user'
    });
  }
});

// @desc    Reject user
// @route   PUT /api/users/:id/reject
// @access  Private (Team/Admin/Superadmin)
router.put('/:id/reject', protect, authorize('team', 'admin', 'superadmin'), validateUserId, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.approval_status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'User is already rejected'
      });
    }

    const updatedUser = await User.update(id, {
      approval_status: 'rejected',
      rejection_reason: reason || 'No reason provided',
      metadata_last_modified_by: req.user.id
    });

    // Log rejection action
    securityLogger.userRejected(
      parseInt(id),
      user.email,
      req.user.id,
      reason || 'No reason provided',
      req.ip
    );

    res.json({
      success: true,
      message: 'User rejected successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'reject_user', userId: req.params.id });
    console.error('Reject user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting user'
    });
  }
});

// @desc    Bulk update users
// @route   PUT /api/users/bulk
// @access  Private (Admin/Superadmin)
router.put('/bulk', protect, authorize('admin', 'superadmin'), validateBulkUpdate, async (req, res) => {
  try {
    const { user_ids, updates } = req.body;

    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid user IDs array'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide updates to apply'
      });
    }

    // Check for superadmin role changes
    if (updates.role === 'superadmin' && req.user.role !== 'superadmin') {
      securityLogger.unauthorizedAccess(
        req.user.id,
        req.user.email,
        'bulk_assign_superadmin_role',
        req.ip,
        req.get('User-Agent')
      );
      
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can assign superadmin role'
      });
    }

    // Add metadata
    updates.metadata_last_modified_by = req.user.id;

    const result = await User.bulkUpdate(user_ids, updates);

    // Log bulk operation
    securityLogger.bulkOperation(
      'bulk_update',
      user_ids,
      req.user.id,
      req.ip
    );

    res.json({
      success: true,
      message: `Successfully updated ${result.updated_count} users`,
      data: {
        updated_count: result.updated_count,
        user_ids: user_ids
      }
    });

  } catch (error) {
    errorLogger(error, req, { operation: 'bulk_update_users', userIds: req.body.user_ids });
    console.error('Bulk update users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating users'
    });
  }
});

module.exports = router;