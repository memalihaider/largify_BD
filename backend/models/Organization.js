const { query, insert, update, delete: deleteRecord } = require('../config/database');

class Organization {
  constructor(orgData) {
    this.id = orgData.id;
    this.name = orgData.name;
    this.slug = orgData.slug;
    this.description = orgData.description;
    this.logo = orgData.logo;
    this.website = orgData.website;
    this.phone = orgData.phone;
    this.email = orgData.email;
    this.address = orgData.address;
    this.subscription_status = orgData.subscription_status || 'trial';
    this.subscription_plan = orgData.subscription_plan;
    this.subscription_expires_at = orgData.subscription_expires_at;
    this.max_team_members = orgData.max_team_members || 10;
    this.settings = typeof orgData.settings === 'string' ? 
      JSON.parse(orgData.settings) : (orgData.settings || {});
    this.created_by = orgData.created_by;
    this.created_at = orgData.created_at;
    this.updated_at = orgData.updated_at;
  }

  // Create a new organization
  static async create(orgData) {
    try {
      // Generate slug from name if not provided
      const slug = orgData.slug || orgData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const insertQuery = `
        INSERT INTO organizations (
          name, slug, description, logo, website, phone, email, address,
          subscription_status, subscription_plan, subscription_expires_at,
          max_team_members, settings, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        orgData.name,
        slug,
        orgData.description || null,
        orgData.logo || null,
        orgData.website || null,
        orgData.phone || null,
        orgData.email || null,
        orgData.address || null,
        orgData.subscription_status || 'trial',
        orgData.subscription_plan || null,
        orgData.subscription_expires_at || null,
        orgData.max_team_members || 10,
        JSON.stringify(orgData.settings || {}),
        orgData.created_by
      ];

      const result = await insert(insertQuery, values);
      const createdOrg = await query('SELECT * FROM organizations WHERE id = ?', [result.id]);
      return new Organization(createdOrg[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find organization by ID
  static async findById(id) {
    try {
      const result = await query('SELECT * FROM organizations WHERE id = ?', [id]);
      return result[0] ? new Organization(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find organization by slug
  static async findBySlug(slug) {
    try {
      const result = await query('SELECT * FROM organizations WHERE slug = ?', [slug]);
      return result[0] ? new Organization(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find all organizations with pagination and filtering
  static async findAll(options = {}) {
    try {
      let queryStr = 'SELECT * FROM organizations';
      const conditions = [];
      const values = [];

      if (options.subscription_status) {
        conditions.push('subscription_status = ?');
        values.push(options.subscription_status);
      }

      if (options.created_by) {
        conditions.push('created_by = ?');
        values.push(options.created_by);
      }

      if (options.search) {
        conditions.push('(name LIKE ? OR email LIKE ? OR website LIKE ?)');
        const searchTerm = `%${options.search}%`;
        values.push(searchTerm, searchTerm, searchTerm);
      }

      if (conditions.length > 0) {
        queryStr += ' WHERE ' + conditions.join(' AND ');
      }

      // Sorting
      const sortBy = options.sort_by || 'created_at';
      const sortOrder = options.sort_order || 'desc';
      queryStr += ` ORDER BY ${sortBy} ${sortOrder}`;

      // Pagination
      if (options.limit) {
        queryStr += ' LIMIT ?';
        values.push(parseInt(options.limit));

        if (options.offset) {
          queryStr += ' OFFSET ?';
          values.push(parseInt(options.offset));
        }
      }

      const result = await query(queryStr, values);
      return result.map(org => new Organization(org));
    } catch (error) {
      throw error;
    }
  }

  // Get organization with user count
  static async findWithStats(id) {
    try {
      const orgQuery = 'SELECT * FROM organizations WHERE id = ?';
      const orgResult = await query(orgQuery, [id]);
      
      if (!orgResult[0]) return null;

      const org = new Organization(orgResult[0]);

      // Get user statistics
      const statsQuery = `
        SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
          SUM(CASE WHEN role = 'team' THEN 1 ELSE 0 END) as team_count,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users
        FROM users 
        WHERE organization_id = ?
      `;
      
      const statsResult = await query(statsQuery, [id]);
      org.stats = statsResult[0];

      return org;
    } catch (error) {
      throw error;
    }
  }

  // Get all users in organization
  async getUsers(options = {}) {
    try {
      let queryStr = 'SELECT * FROM users WHERE organization_id = ?';
      const values = [this.id];

      if (options.role) {
        queryStr += ' AND role = ?';
        values.push(options.role);
      }

      if (options.is_active !== undefined) {
        queryStr += ' AND is_active = ?';
        values.push(options.is_active);
      }

      queryStr += ' ORDER BY created_at DESC';

      const result = await query(queryStr, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Update organization
  async update(updateData) {
    try {
      const fields = [];
      const values = [];

      const allowedFields = [
        'name', 'description', 'logo', 'website', 'phone', 'email', 'address',
        'subscription_status', 'subscription_plan', 'subscription_expires_at',
        'max_team_members', 'settings'
      ];

      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          if (field === 'settings') {
            fields.push(`${field} = ?`);
            values.push(JSON.stringify(updateData[field]));
          } else {
            fields.push(`${field} = ?`);
            values.push(updateData[field]);
          }
        }
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(this.id);

      const updateQuery = `UPDATE organizations SET ${fields.join(', ')} WHERE id = ?`;
      await update(updateQuery, values);

      // Refresh the instance
      const updated = await Organization.findById(this.id);
      Object.assign(this, updated);
      
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete organization (and all associated users)
  async delete() {
    try {
      // First, delete all users in this organization
      await deleteRecord('DELETE FROM users WHERE organization_id = ?', [this.id]);
      
      // Then delete the organization
      await deleteRecord('DELETE FROM organizations WHERE id = ?', [this.id]);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Check if organization can add more team members
  canAddTeamMember() {
    return this.stats ? this.stats.team_count < this.max_team_members : true;
  }

  // Check if subscription is active
  isSubscriptionActive() {
    if (this.subscription_status === 'cancelled' || this.subscription_status === 'suspended') {
      return false;
    }

    if (this.subscription_expires_at) {
      return new Date(this.subscription_expires_at) > new Date();
    }

    return this.subscription_status === 'active';
  }

  // Get subscription days remaining
  getSubscriptionDaysRemaining() {
    if (!this.subscription_expires_at) return null;

    const expiryDate = new Date(this.subscription_expires_at);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  // Suspend organization
  async suspend(reason = null) {
    try {
      await this.update({
        subscription_status: 'suspended',
        settings: {
          ...this.settings,
          suspension_reason: reason,
          suspended_at: new Date().toISOString()
        }
      });

      // Deactivate all users in organization
      await update(
        'UPDATE users SET is_active = 0 WHERE organization_id = ?',
        [this.id]
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Reactivate organization
  async reactivate() {
    try {
      const newSettings = { ...this.settings };
      delete newSettings.suspension_reason;
      delete newSettings.suspended_at;

      await this.update({
        subscription_status: 'active',
        settings: newSettings
      });

      // Reactivate all users in organization
      await update(
        'UPDATE users SET is_active = 1 WHERE organization_id = ?',
        [this.id]
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get organization statistics
  static async getStats() {
    try {
      const stats = {};

      // Total organizations
      const totalResult = await query('SELECT COUNT(*) as count FROM organizations');
      stats.total = totalResult[0].count;

      // Organizations by subscription status
      const statusResult = await query(`
        SELECT subscription_status, COUNT(*) as count 
        FROM organizations 
        GROUP BY subscription_status
      `);
      stats.byStatus = statusResult.reduce((acc, row) => {
        acc[row.subscription_status] = row.count;
        return acc;
      }, {});

      // Organizations by plan
      const planResult = await query(`
        SELECT subscription_plan, COUNT(*) as count 
        FROM organizations 
        WHERE subscription_plan IS NOT NULL
        GROUP BY subscription_plan
      `);
      stats.byPlan = planResult.reduce((acc, row) => {
        acc[row.subscription_plan] = row.count;
        return acc;
      }, {});

      // Expiring subscriptions (next 30 days)
      const expiringResult = await query(`
        SELECT COUNT(*) as count 
        FROM organizations 
        WHERE subscription_expires_at BETWEEN datetime('now') AND datetime('now', '+30 days')
        AND subscription_status = 'active'
      `);
      stats.expiringSoon = expiringResult[0].count;

      // Total users across all organizations
      const usersResult = await query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE organization_id IS NOT NULL
      `);
      stats.totalUsers = usersResult[0].count;

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Convert to JSON (exclude sensitive settings)
  toJSON() {
    const orgObj = { ...this };
    
    // Filter sensitive settings if needed
    if (orgObj.settings && orgObj.settings.api_keys) {
      orgObj.settings = { ...orgObj.settings };
      delete orgObj.settings.api_keys;
    }
    
    return orgObj;
  }
}

module.exports = Organization;