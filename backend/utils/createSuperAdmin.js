const bcrypt = require('bcryptjs');
const { query, insert } = require('../config/database');
require('dotenv').config();

/**
 * Create Super Admin User
 * This utility creates a super admin user for the application
 */
async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const existingAdmin = await query(
      'SELECT * FROM users WHERE role = ? OR email = ?',
      ['superadmin', process.env.SUPER_ADMIN_EMAIL]
    );

    if (existingAdmin.length > 0) {
      console.log('Super admin already exists!');
      console.log('Email:', existingAdmin[0].email);
      console.log('Role:', existingAdmin[0].role);
      return existingAdmin[0];
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, saltRounds);

    // Create super admin user
    const superAdminData = {
      name: process.env.SUPER_ADMIN_NAME || 'Super Administrator',
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: 'superadmin',
      approval_status: 'approved',
      is_active: 1,
      email_verified: 1,
      phone: process.env.SUPER_ADMIN_PHONE || null,
      company: process.env.SUPER_ADMIN_COMPANY || 'System',
      position: 'Super Administrator',
      preferences: JSON.stringify({
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        dashboard: {
          layout: 'default',
          widgets: ['stats', 'recent_activity', 'notifications']
        }
      })
    };

    const insertQuery = `
      INSERT INTO users (
        name, email, password, role, approval_status, is_active, email_verified,
        phone, company, position, preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      superAdminData.name,
      superAdminData.email.toLowerCase(),
      superAdminData.password,
      superAdminData.role,
      superAdminData.approval_status,
      superAdminData.is_active,
      superAdminData.email_verified,
      superAdminData.phone,
      superAdminData.company,
      superAdminData.position,
      superAdminData.preferences
    ];

    const result = await insert(insertQuery, values);
    
    // Get the created user
    const newSuperAdmin = await query('SELECT * FROM users WHERE id = ?', [result.id]);

    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email:', newSuperAdmin[0].email);
    console.log('👤 Name:', newSuperAdmin[0].name);
    console.log('🔑 Role:', newSuperAdmin[0].role);
    console.log('📅 Created:', newSuperAdmin[0].created_at);
    console.log('🆔 ID:', newSuperAdmin[0].id);
    
    return newSuperAdmin[0];

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    throw error;
  }
}

/**
 * Update Super Admin Password
 */
async function updateSuperAdminPassword(newPassword) {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const result = await query(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE role = ? RETURNING email',
      [hashedPassword, 'superadmin']
    );

    if (result.length === 0) {
      throw new Error('Super admin not found');
    }

    console.log('✅ Super admin password updated successfully!');
    return result[0];

  } catch (error) {
    console.error('❌ Error updating super admin password:', error.message);
    throw error;
  }
}

/**
 * Get Super Admin Info
 */
async function getSuperAdminInfo() {
  try {
    const result = await query(
      'SELECT id, name, email, role, is_active, created_at, last_login FROM users WHERE role = ?',
      ['superadmin']
    );

    if (result.length === 0) {
      console.log('❌ No super admin found');
      return null;
    }

    const admin = result[0];
    console.log('📋 Super Admin Information:');
    console.log('🆔 ID:', admin.id);
    console.log('👤 Name:', admin.name);
    console.log('📧 Email:', admin.email);
    console.log('🔑 Role:', admin.role);
    console.log('✅ Active:', admin.is_active);
    console.log('📅 Created:', admin.created_at);
    console.log('🕐 Last Login:', admin.last_login || 'Never');

    return admin;

  } catch (error) {
    console.error('❌ Error getting super admin info:', error.message);
    throw error;
  }
}

// Command line interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      createSuperAdmin()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'info':
      getSuperAdminInfo()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'update-password':
      const newPassword = process.argv[3];
      if (!newPassword) {
        console.error('❌ Please provide a new password');
        console.log('Usage: node createSuperAdmin.js update-password <new-password>');
        process.exit(1);
      }
      updateSuperAdminPassword(newPassword)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    default:
      console.log('🔧 Super Admin Management Utility');
      console.log('');
      console.log('Available commands:');
      console.log('  create           - Create a new super admin user');
      console.log('  info             - Display super admin information');
      console.log('  update-password  - Update super admin password');
      console.log('');
      console.log('Usage examples:');
      console.log('  node utils/createSuperAdmin.js create');
      console.log('  node utils/createSuperAdmin.js info');
      console.log('  node utils/createSuperAdmin.js update-password newpassword123');
      console.log('');
      console.log('Environment variables required:');
      console.log('  SUPER_ADMIN_EMAIL    - Super admin email address');
      console.log('  SUPER_ADMIN_PASSWORD - Super admin password');
      console.log('  SUPER_ADMIN_NAME     - Super admin name (optional)');
      console.log('  SUPER_ADMIN_PHONE    - Super admin phone (optional)');
      console.log('  SUPER_ADMIN_COMPANY  - Super admin company (optional)');
      break;
  }
}

module.exports = {
  createSuperAdmin,
  updateSuperAdminPassword,
  getSuperAdminInfo
};