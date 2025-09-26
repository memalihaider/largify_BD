const User = require('../models/User');
const Permission = require('../models/Permission');
const Organization = require('../models/Organization');
const { query } = require('../config/database');

class RoleService {
  // Create a new admin/client account (Super Admin only)
  static async createAdminAccount(superAdminId, adminData) {
    try {
      const superAdmin = await User.findById(superAdminId);
      if (!superAdmin || superAdmin.role !== 'superadmin') {
        throw new Error('Only super admins can create admin accounts');
      }

      // Create organization first
      const organization = await Organization.create({
        name: adminData.organizationName,
        subscription_plan: adminData.subscriptionPlan || 'basic',
        subscription_status: 'active',
        created_by: superAdminId
      });

      // Create admin user
      const userData = {
        ...adminData,
        role: 'admin',
        organization_id: organization.id,
        subscription_id: organization.id, // Using organization ID as subscription reference
        created_by: superAdminId,
        approval_status: 'approved'
      };

      const admin = await User.create(userData);

      // Set default admin permissions
      await Permission.setRolePermissions('admin', [
        'dashboard.view',
        'contacts.view', 'contacts.create', 'contacts.edit', 'contacts.delete',
        'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
        'team.view', 'team.create', 'team.edit', 'team.delete',
        'reports.view', 'reports.export',
        'settings.view', 'settings.edit'
      ]);

      return { admin, organization };
    } catch (error) {
      throw error;
    }
  }

  // Create team member (Admin only)
  static async createTeamMember(adminId, teamMemberData, permissions = []) {
    try {
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Only admins can create team members');
      }

      const teamMember = await admin.createTeamMember(teamMemberData);

      // Set custom permissions for team member
      if (permissions.length > 0) {
        await admin.setTeamMemberPermissions(teamMember.id, permissions);
      }

      return teamMember;
    } catch (error) {
      throw error;
    }
  }

  // Update team member permissions (Admin only)
  static async updateTeamMemberPermissions(adminId, teamMemberId, permissions) {
    try {
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Only admins can update team member permissions');
      }

      return await admin.setTeamMemberPermissions(teamMemberId, permissions);
    } catch (error) {
      throw error;
    }
  }

  // Get team member permissions (Admin only)
  static async getTeamMemberPermissions(adminId, teamMemberId) {
    try {
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Only admins can view team member permissions');
      }

      return await admin.getTeamMemberPermissions(teamMemberId);
    } catch (error) {
      throw error;
    }
  }

  // Get all team members for an admin
  static async getTeamMembers(adminId) {
    try {
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Only admins can view team members');
      }

      return await admin.getChildUsers();
    } catch (error) {
      throw error;
    }
  }

  // Get organization users (Super Admin or Admin)
  static async getOrganizationUsers(userId, organizationId = null) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.role === 'superadmin') {
        // Super admin can view any organization
        if (organizationId) {
          const result = await query(
            'SELECT * FROM users WHERE organization_id = ? ORDER BY role, created_at DESC',
            [organizationId]
          );
          return result.map(userData => new User(userData));
        } else {
          // Return all users if no organization specified
          return await User.findAll();
        }
      } else if (user.role === 'admin') {
        // Admin can only view their organization
        return await user.getOrganizationUsers();
      } else {
        throw new Error('Insufficient permissions to view organization users');
      }
    } catch (error) {
      throw error;
    }
  }

  // Check if user has specific permission
  static async checkPermission(userId, permission) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return await user.hasPermission(permission);
    } catch (error) {
      throw error;
    }
  }

  // Get user's role hierarchy info
  static async getUserRoleInfo(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const roleInfo = {
        user: user.toJSON(),
        permissions: await user.getPermissions(),
        canManage: []
      };

      // Get manageable users based on role
      if (user.role === 'superadmin') {
        roleInfo.canManage = await User.findAll();
      } else if (user.role === 'admin') {
        roleInfo.canManage = await user.getChildUsers();
        roleInfo.organizationUsers = await user.getOrganizationUsers();
      }

      return roleInfo;
    } catch (error) {
      throw error;
    }
  }

  // Validate role transition
  static validateRoleTransition(currentRole, newRole, requestingUserRole) {
    const roleHierarchy = {
      'customer': 1,
      'team': 2,
      'admin': 3,
      'superadmin': 4
    };

    // Only super admin can change roles to admin or superadmin
    if (['admin', 'superadmin'].includes(newRole) && requestingUserRole !== 'superadmin') {
      return false;
    }

    // Admin can only change team member roles
    if (requestingUserRole === 'admin' && newRole !== 'team') {
      return false;
    }

    // Can't promote to higher role than requesting user
    if (roleHierarchy[newRole] >= roleHierarchy[requestingUserRole]) {
      return false;
    }

    return true;
  }

  // Get available permissions for role assignment
  static getAvailablePermissions() {
    return [
      // Dashboard permissions
      { category: 'Dashboard', permissions: ['dashboard.view'] },
      
      // Contact management permissions
      { 
        category: 'Contacts', 
        permissions: ['contacts.view', 'contacts.create', 'contacts.edit', 'contacts.delete'] 
      },
      
      // Lead management permissions
      { 
        category: 'Leads', 
        permissions: ['leads.view', 'leads.create', 'leads.edit', 'leads.delete'] 
      },
      
      // Team management permissions
      { 
        category: 'Team Management', 
        permissions: ['team.view', 'team.create', 'team.edit', 'team.delete'] 
      },
      
      // Reports permissions
      { 
        category: 'Reports', 
        permissions: ['reports.view', 'reports.export'] 
      },
      
      // Settings permissions
      { 
        category: 'Settings', 
        permissions: ['settings.view', 'settings.edit'] 
      }
    ];
  }
}

module.exports = RoleService;