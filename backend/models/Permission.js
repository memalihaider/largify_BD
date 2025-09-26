const { query, insert, update, delete: deleteRecord } = require('../config/database');

class Permission {
  constructor(permissionData) {
    this.id = permissionData.id;
    this.name = permissionData.name;
    this.slug = permissionData.slug;
    this.description = permissionData.description;
    this.category = permissionData.category;
    this.resource = permissionData.resource;
    this.action = permissionData.action;
    this.is_system = permissionData.is_system || false;
    this.created_at = permissionData.created_at;
    this.updated_at = permissionData.updated_at;
  }

  // Create a new permission
  static async create(permissionData) {
    try {
      const insertQuery = `
        INSERT INTO permissions (name, slug, description, category, resource, action, is_system)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        permissionData.name,
        permissionData.slug,
        permissionData.description || null,
        permissionData.category || null,
        permissionData.resource || null,
        permissionData.action || null,
        permissionData.is_system || false
      ];

      const result = await insert(insertQuery, values);
      const createdPermission = await query('SELECT * FROM permissions WHERE id = ?', [result.id]);
      return new Permission(createdPermission[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find permission by ID
  static async findById(id) {
    try {
      const result = await query('SELECT * FROM permissions WHERE id = ?', [id]);
      return result[0] ? new Permission(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find permission by slug
  static async findBySlug(slug) {
    try {
      const result = await query('SELECT * FROM permissions WHERE slug = ?', [slug]);
      return result[0] ? new Permission(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find all permissions with optional filtering
  static async findAll(options = {}) {
    try {
      let queryStr = 'SELECT * FROM permissions';
      const conditions = [];
      const values = [];

      if (options.category) {
        conditions.push('category = ?');
        values.push(options.category);
      }

      if (options.resource) {
        conditions.push('resource = ?');
        values.push(options.resource);
      }

      if (options.is_system !== undefined) {
        conditions.push('is_system = ?');
        values.push(options.is_system);
      }

      if (conditions.length > 0) {
        queryStr += ' WHERE ' + conditions.join(' AND ');
      }

      queryStr += ' ORDER BY category, name';

      const result = await query(queryStr, values);
      return result.map(permission => new Permission(permission));
    } catch (error) {
      throw error;
    }
  }

  // Get permissions by role
  static async getByRole(role) {
    try {
      const queryStr = `
        SELECT p.* FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role = ?
        ORDER BY p.category, p.name
      `;
      
      const result = await query(queryStr, [role]);
      return result.map(permission => new Permission(permission));
    } catch (error) {
      throw error;
    }
  }

  // Get permissions by user ID (includes role permissions and individual overrides)
  static async getByUserId(userId) {
    try {
      const queryStr = `
        SELECT DISTINCT p.*, 
               CASE WHEN up.granted IS NOT NULL THEN up.granted ELSE 1 END as granted,
               up.expires_at
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        INNER JOIN users u ON u.role = rp.role
        LEFT JOIN user_permissions up ON p.id = up.permission_id AND up.user_id = ?
        WHERE u.id = ? AND (up.granted IS NULL OR up.granted = 1)
        AND (up.expires_at IS NULL OR up.expires_at > datetime('now'))
        ORDER BY p.category, p.name
      `;
      
      const result = await query(queryStr, [userId, userId]);
      return result.map(permission => new Permission(permission));
    } catch (error) {
      throw error;
    }
  }

  // Get team member permissions (for Admin to manage)
  static async getTeamMemberPermissions(teamMemberId, adminId) {
    try {
      const queryStr = `
        SELECT p.*, tmp.granted, tmp.admin_id
        FROM permissions p
        LEFT JOIN team_member_permissions tmp ON p.id = tmp.permission_id 
          AND tmp.team_member_id = ? AND tmp.admin_id = ?
        ORDER BY p.category, p.name
      `;
      
      const result = await query(queryStr, [teamMemberId, adminId]);
      return result.map(row => ({
        ...new Permission(row),
        granted: row.granted || false,
        admin_id: row.admin_id
      }));
    } catch (error) {
      throw error;
    }
  }

  // Assign permission to role
  static async assignToRole(role, permissionId, grantedBy = null) {
    try {
      const insertQuery = `
        INSERT OR REPLACE INTO role_permissions (role, permission_id, granted_by)
        VALUES (?, ?, ?)
      `;
      
      await insert(insertQuery, [role, permissionId, grantedBy]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Remove permission from role
  static async removeFromRole(role, permissionId) {
    try {
      const deleteQuery = 'DELETE FROM role_permissions WHERE role = ? AND permission_id = ?';
      await deleteRecord(deleteQuery, [role, permissionId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Grant permission to specific user
  static async grantToUser(userId, permissionId, grantedBy, expiresAt = null) {
    try {
      const insertQuery = `
        INSERT OR REPLACE INTO user_permissions (user_id, permission_id, granted, granted_by, expires_at)
        VALUES (?, ?, 1, ?, ?)
      `;
      
      await insert(insertQuery, [userId, permissionId, grantedBy, expiresAt]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Deny permission to specific user
  static async denyToUser(userId, permissionId, grantedBy) {
    try {
      const insertQuery = `
        INSERT OR REPLACE INTO user_permissions (user_id, permission_id, granted, granted_by)
        VALUES (?, ?, 0, ?)
      `;
      
      await insert(insertQuery, [userId, permissionId, grantedBy]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Remove user permission override
  static async removeFromUser(userId, permissionId) {
    try {
      const deleteQuery = 'DELETE FROM user_permissions WHERE user_id = ? AND permission_id = ?';
      await deleteRecord(deleteQuery, [userId, permissionId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Set team member permissions (Admin managing Team Member)
  static async setTeamMemberPermissions(teamMemberId, adminId, permissions) {
    try {
      // First, remove all existing permissions for this team member from this admin
      await deleteRecord(
        'DELETE FROM team_member_permissions WHERE team_member_id = ? AND admin_id = ?',
        [teamMemberId, adminId]
      );

      // Then add the new permissions
      for (const permission of permissions) {
        if (permission.granted) {
          const insertQuery = `
            INSERT INTO team_member_permissions (team_member_id, admin_id, permission_id, granted)
            VALUES (?, ?, ?, 1)
          `;
          await insert(insertQuery, [teamMemberId, adminId, permission.id]);
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Check if user has specific permission
  static async userHasPermission(userId, permissionSlug) {
    try {
      const queryStr = `
        SELECT COUNT(*) as count FROM (
          -- Check role permissions
          SELECT 1 FROM permissions p
          INNER JOIN role_permissions rp ON p.id = rp.permission_id
          INNER JOIN users u ON u.role = rp.role
          WHERE u.id = ? AND p.slug = ?
          
          UNION
          
          -- Check individual user permissions (granted)
          SELECT 1 FROM permissions p
          INNER JOIN user_permissions up ON p.id = up.permission_id
          WHERE up.user_id = ? AND p.slug = ? AND up.granted = 1
          AND (up.expires_at IS NULL OR up.expires_at > datetime('now'))
          
          UNION
          
          -- Check team member permissions (if user is team member)
          SELECT 1 FROM permissions p
          INNER JOIN team_member_permissions tmp ON p.id = tmp.permission_id
          WHERE tmp.team_member_id = ? AND p.slug = ? AND tmp.granted = 1
        ) 
        -- Exclude explicitly denied permissions
        AND NOT EXISTS (
          SELECT 1 FROM permissions p2
          INNER JOIN user_permissions up2 ON p2.id = up2.permission_id
          WHERE up2.user_id = ? AND p2.slug = ? AND up2.granted = 0
        )
      `;
      
      const result = await query(queryStr, [userId, permissionSlug, userId, permissionSlug, userId, permissionSlug, userId, permissionSlug]);
      return result[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update permission
  async update(updateData) {
    try {
      const fields = [];
      const values = [];

      if (updateData.name !== undefined) {
        fields.push('name = ?');
        values.push(updateData.name);
      }

      if (updateData.description !== undefined) {
        fields.push('description = ?');
        values.push(updateData.description);
      }

      if (updateData.category !== undefined) {
        fields.push('category = ?');
        values.push(updateData.category);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(this.id);

      const updateQuery = `UPDATE permissions SET ${fields.join(', ')} WHERE id = ?`;
      await update(updateQuery, values);

      // Refresh the instance
      const updated = await Permission.findById(this.id);
      Object.assign(this, updated);
      
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete permission (only non-system permissions)
  async delete() {
    try {
      if (this.is_system) {
        throw new Error('Cannot delete system permissions');
      }

      await deleteRecord('DELETE FROM permissions WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get permission statistics
  static async getStats() {
    try {
      const stats = {};

      // Total permissions
      const totalResult = await query('SELECT COUNT(*) as count FROM permissions');
      stats.total = totalResult[0].count;

      // System vs custom permissions
      const systemResult = await query('SELECT is_system, COUNT(*) as count FROM permissions GROUP BY is_system');
      stats.system = systemResult.find(r => r.is_system === 1)?.count || 0;
      stats.custom = systemResult.find(r => r.is_system === 0)?.count || 0;

      // Permissions by category
      const categoryResult = await query('SELECT category, COUNT(*) as count FROM permissions GROUP BY category');
      stats.byCategory = categoryResult.reduce((acc, row) => {
        acc[row.category || 'uncategorized'] = row.count;
        return acc;
      }, {});

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Convert to JSON
  toJSON() {
    return { ...this };
  }
}

module.exports = Permission;