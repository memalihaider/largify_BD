const { query, insert } = require('../config/database');
const bcrypt = require('bcryptjs');
const Permission = require('./Permission');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'customer';
    this.approval_status = userData.approval_status || 'pending';
    this.is_active = userData.is_active !== undefined ? userData.is_active : true;
    this.avatar = userData.avatar || null;
    this.phone = userData.phone || null;
    this.company = userData.company || null;
    this.position = userData.position || null;
    this.last_login = userData.last_login || null;
    this.login_attempts = userData.login_attempts || 0;
    this.lock_until = userData.lock_until || null;
    this.password_reset_token = userData.password_reset_token || null;
    this.password_reset_expires = userData.password_reset_expires || null;
    this.email_verification_token = userData.email_verification_token || null;
    this.is_email_verified = userData.is_email_verified || false;
    this.preferences = userData.preferences || {
      notifications: { email: true, push: true, sms: false },
      theme: 'light',
      language: 'en'
    };
    this.source = userData.source || 'website';
    this.created_by = userData.created_by || null;
    this.approved_by = userData.approved_by || null;
    this.approved_at = userData.approved_at || null;
    // New hierarchical fields
    this.parent_user_id = userData.parent_user_id || null;
    this.organization_id = userData.organization_id || null;
    this.subscription_id = userData.subscription_id || null;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const insertQuery = `
        INSERT INTO users (
          name, email, password, role, approval_status, is_active, avatar, phone, 
          company, position, preferences, parent_user_id, organization_id, 
          subscription_id, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userData.name,
        userData.email.toLowerCase(),
        hashedPassword,
        userData.role || 'customer',
        userData.approval_status || 'pending',
        userData.is_active !== undefined ? userData.is_active : true,
        userData.avatar || null,
        userData.phone || null,
        userData.company || null,
        userData.position || null,
        JSON.stringify(userData.preferences || {
          notifications: { email: true, push: true, sms: false },
          theme: 'light',
          language: 'en'
        }),
        userData.parent_user_id || null,
        userData.organization_id || null,
        userData.subscription_id || null,
        userData.created_by || null
      ];

      const result = await insert(insertQuery, values);
      
      // Get the created user
      const createdUser = await query('SELECT * FROM users WHERE id = ?', [result.id]);
      return new User(createdUser[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await query('SELECT * FROM users WHERE id = ?', [id]);
      return result[0] ? new User(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
      return result[0] ? new User(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find all users with pagination
  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        filters = {},
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      let queryStr = 'SELECT * FROM users WHERE 1=1';
      const values = [];

      // Apply search filter
      if (search) {
        queryStr += ' AND (name LIKE ? OR email LIKE ?)';
        const searchTerm = `%${search}%`;
        values.push(searchTerm, searchTerm);
      }

      // Apply filters
      if (filters.role) {
        queryStr += ' AND role = ?';
        values.push(filters.role);
      }

      if (filters.approval_status) {
        queryStr += ' AND approval_status = ?';
        values.push(filters.approval_status);
      }

      if (filters.is_active !== undefined) {
        queryStr += ' AND is_active = ?';
        values.push(filters.is_active ? 1 : 0);
      }

      // Add sorting
      const validSortColumns = ['created_at', 'name', 'email', 'role'];
      const validSortOrders = ['asc', 'desc'];
      
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
      const sortDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';
      
      queryStr += ` ORDER BY ${sortColumn} ${sortDirection}`;

      // Add pagination
      const offset = (page - 1) * limit;
      queryStr += ' LIMIT ? OFFSET ?';
      values.push(parseInt(limit), parseInt(offset));

      const result = await query(queryStr, values);
      return result.map(row => new User(row));
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    try {
      const fields = [];
      const values = [];

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (fields.length === 0) return this;

      // Add updated_at timestamp
      fields.push('updated_at = CURRENT_TIMESTAMP');

      // Add ID for WHERE clause
      values.push(this.id);

      const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      await query(updateQuery, values);
      
      // Get updated user
      const updatedUser = await query('SELECT * FROM users WHERE id = ?', [this.id]);
      if (updatedUser[0]) {
        Object.assign(this, updatedUser[0]);
      }
      
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async delete() {
    try {
      await query('DELETE FROM users WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async matchPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Handle failed login attempt
  async handleFailedLoginAttempt() {
    try {
      const newAttempts = (this.login_attempts || 0) + 1;
      let lockUntil = null;

      // Lock account after 5 failed attempts for 2 hours
      if (newAttempts >= 5) {
        lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      }

      await query(
        'UPDATE users SET login_attempts = ?, locked_until = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newAttempts, lockUntil, this.id]
      );

      this.login_attempts = newAttempts;
      this.locked_until = lockUntil;
    } catch (error) {
      throw error;
    }
  }

  // Reset failed login attempts
  async resetFailedLoginAttempts() {
    try {
      await query(
        'UPDATE users SET login_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [this.id]
      );
      this.login_attempts = 0;
      this.locked_until = null;
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  async updateLastLogin() {
    try {
      const now = new Date().toISOString();
      await query(
        'UPDATE users SET last_login = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [now, this.id]
      );
      this.last_login = now;
    } catch (error) {
      throw error;
    }
  }

  // Check if account is locked
  isLocked() {
    return !!(this.locked_until && new Date(this.locked_until) > new Date());
  }

  // Check if user has permission (enhanced with granular permissions)
  async hasPermission(requiredPermission) {
    // If it's a role-based check (legacy support)
    if (['customer', 'team', 'admin', 'superadmin'].includes(requiredPermission)) {
      const roleHierarchy = {
        'customer': 1,
        'team': 2,
        'admin': 3,
        'superadmin': 4
      };
      
      return roleHierarchy[this.role] >= roleHierarchy[requiredPermission];
    }

    // Check granular permission
    return await Permission.userHasPermission(this.id, requiredPermission);
  }

  // Get all permissions for this user
  async getPermissions() {
    return await Permission.getByUserId(this.id);
  }

  // Check if user can manage another user (hierarchical check)
  canManageUser(targetUser) {
    // Super Admin can manage everyone
    if (this.role === 'superadmin') return true;

    // Admin can manage team members in their organization
    if (this.role === 'admin') {
      if (targetUser.role === 'team' && targetUser.parent_user_id === this.id) {
        return true;
      }
      if (targetUser.organization_id && targetUser.organization_id === this.organization_id) {
        return targetUser.role !== 'admin' && targetUser.role !== 'superadmin';
      }
    }

    // Team members can only manage themselves
    if (this.role === 'team') {
      return targetUser.id === this.id;
    }

    // Customers can only manage themselves
    return targetUser.id === this.id;
  }

  // Get child users (for Admin managing Team Members)
  async getChildUsers() {
    try {
      const result = await query(
        'SELECT * FROM users WHERE parent_user_id = ? ORDER BY created_at DESC',
        [this.id]
      );
      return result.map(user => new User(user));
    } catch (error) {
      throw error;
    }
  }

  // Get organization users (for Admin)
  async getOrganizationUsers() {
    try {
      if (!this.organization_id) return [];
      
      const result = await query(
        'SELECT * FROM users WHERE organization_id = ? AND id != ? ORDER BY role, created_at DESC',
        [this.organization_id, this.id]
      );
      return result.map(user => new User(user));
    } catch (error) {
      throw error;
    }
  }

  // Create team member under this admin
  async createTeamMember(teamMemberData) {
    try {
      if (this.role !== 'admin') {
        throw new Error('Only admins can create team members');
      }

      const userData = {
        ...teamMemberData,
        role: 'team',
        parent_user_id: this.id,
        organization_id: this.organization_id,
        subscription_id: this.subscription_id,
        created_by: this.id,
        approval_status: 'approved' // Team members created by admin are auto-approved
      };

      return await User.create(userData);
    } catch (error) {
      throw error;
    }
  }

  // Set permissions for team member (Admin only)
  async setTeamMemberPermissions(teamMemberId, permissions) {
    try {
      if (this.role !== 'admin') {
        throw new Error('Only admins can set team member permissions');
      }

      // Verify the team member belongs to this admin
      const teamMember = await User.findById(teamMemberId);
      if (!teamMember || teamMember.parent_user_id !== this.id) {
        throw new Error('Team member not found or not under your management');
      }

      return await Permission.setTeamMemberPermissions(teamMemberId, this.id, permissions);
    } catch (error) {
      throw error;
    }
  }

  // Get team member permissions (Admin only)
  async getTeamMemberPermissions(teamMemberId) {
    try {
      if (this.role !== 'admin') {
        throw new Error('Only admins can view team member permissions');
      }

      // Verify the team member belongs to this admin
      const teamMember = await User.findById(teamMemberId);
      if (!teamMember || teamMember.parent_user_id !== this.id) {
        throw new Error('Team member not found or not under your management');
      }

      return await Permission.getTeamMemberPermissions(teamMemberId, this.id);
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  static async getStats() {
    try {
      const stats = {};

      // Total users count
      const totalUsersResult = await query('SELECT COUNT(*) as count FROM users');
      stats.totalUsers = totalUsersResult[0].count;

      // Active users count
      const activeUsersResult = await query('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
      stats.activeUsers = activeUsersResult[0].count;

      // Users by role
      const roleStatsResult = await query(`
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
      `);
      stats.usersByRole = roleStatsResult.reduce((acc, row) => {
        acc[row.role] = row.count;
        return acc;
      }, {});

      // Users by approval status
      const approvalStatsResult = await query(`
        SELECT approval_status, COUNT(*) as count 
        FROM users 
        GROUP BY approval_status
      `);
      stats.usersByApprovalStatus = approvalStatsResult.reduce((acc, row) => {
        acc[row.approval_status] = row.count;
        return acc;
      }, {});

      // Recent registrations (last 30 days)
      const recentRegistrationsResult = await query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at >= datetime('now', '-30 days')
      `);
      stats.recentRegistrations = recentRegistrationsResult[0].count;

      // Users with recent login (last 7 days)
      const recentLoginsResult = await query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE last_login >= datetime('now', '-7 days')
      `);
      stats.recentLogins = recentLoginsResult[0].count;

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Convert to JSON (exclude sensitive fields)
  toJSON() {
    const userObj = { ...this };
    delete userObj.password;
    delete userObj.password_reset_token;
    delete userObj.email_verification_token;
    return userObj;
  }
}

module.exports = User;