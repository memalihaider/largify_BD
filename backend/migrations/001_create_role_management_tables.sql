-- Migration: Create Role Management Tables
-- This migration adds support for hierarchical role management and granular permissions

-- 1. Add new columns to users table for hierarchical relationships
ALTER TABLE users ADD COLUMN parent_user_id INTEGER;
ALTER TABLE users ADD COLUMN organization_id INTEGER;
ALTER TABLE users ADD COLUMN subscription_id INTEGER;
ALTER TABLE users ADD COLUMN created_by INTEGER;
ALTER TABLE users ADD COLUMN approved_by INTEGER;
ALTER TABLE users ADD COLUMN approved_at DATETIME;

-- Add foreign key constraints
-- Note: SQLite doesn't support adding foreign keys to existing tables directly
-- We'll handle this in the application logic for now

-- 2. Create organizations table (for Super Admin to manage multiple clients)
CREATE TABLE IF NOT EXISTS organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo VARCHAR(500),
  website VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'suspended', 'cancelled', 'trial')),
  subscription_plan VARCHAR(100),
  subscription_expires_at DATETIME,
  max_team_members INTEGER DEFAULT 10,
  settings TEXT, -- JSON field for organization-specific settings
  created_by INTEGER, -- Super Admin who created this organization
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100), -- e.g., 'dashboard', 'crm', 'reports', 'settings'
  resource VARCHAR(100), -- e.g., 'leads', 'contacts', 'users', 'reports'
  action VARCHAR(100), -- e.g., 'create', 'read', 'update', 'delete', 'manage'
  is_system BOOLEAN DEFAULT 0, -- System permissions cannot be deleted
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create role_permissions table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS role_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role VARCHAR(50) NOT NULL,
  permission_id INTEGER NOT NULL,
  granted_by INTEGER, -- User who granted this permission
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  FOREIGN KEY (granted_by) REFERENCES users(id),
  UNIQUE(role, permission_id)
);

-- 5. Create user_permissions table (for individual user overrides)
CREATE TABLE IF NOT EXISTS user_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  granted BOOLEAN DEFAULT 1, -- 1 = granted, 0 = explicitly denied
  granted_by INTEGER, -- Admin who granted/denied this permission
  expires_at DATETIME, -- Optional expiration
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  FOREIGN KEY (granted_by) REFERENCES users(id),
  UNIQUE(user_id, permission_id)
);

-- 6. Create team_member_permissions table (for Admin to control Team Member access)
CREATE TABLE IF NOT EXISTS team_member_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_member_id INTEGER NOT NULL,
  admin_id INTEGER NOT NULL, -- Admin who manages this team member
  permission_id INTEGER NOT NULL,
  granted BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_member_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE(team_member_id, permission_id)
);

-- 7. Insert default permissions
INSERT OR IGNORE INTO permissions (name, slug, description, category, resource, action, is_system) VALUES
-- Dashboard permissions
('View Dashboard', 'view_dashboard', 'Access to main dashboard', 'dashboard', 'dashboard', 'read', 1),
('View Analytics', 'view_analytics', 'Access to analytics and reports', 'dashboard', 'analytics', 'read', 1),

-- CRM permissions
('Manage Leads', 'manage_leads', 'Full access to lead management', 'crm', 'leads', 'manage', 1),
('View Leads', 'view_leads', 'View leads only', 'crm', 'leads', 'read', 1),
('Create Leads', 'create_leads', 'Create new leads', 'crm', 'leads', 'create', 1),
('Edit Leads', 'edit_leads', 'Edit existing leads', 'crm', 'leads', 'update', 1),
('Delete Leads', 'delete_leads', 'Delete leads', 'crm', 'leads', 'delete', 1),

('Manage Contacts', 'manage_contacts', 'Full access to contact management', 'crm', 'contacts', 'manage', 1),
('View Contacts', 'view_contacts', 'View contacts only', 'crm', 'contacts', 'read', 1),
('Create Contacts', 'create_contacts', 'Create new contacts', 'crm', 'contacts', 'create', 1),
('Edit Contacts', 'edit_contacts', 'Edit existing contacts', 'crm', 'contacts', 'update', 1),
('Delete Contacts', 'delete_contacts', 'Delete contacts', 'crm', 'contacts', 'delete', 1),

-- User Management permissions
('Manage Users', 'manage_users', 'Full user management access', 'admin', 'users', 'manage', 1),
('View Users', 'view_users', 'View users only', 'admin', 'users', 'read', 1),
('Create Users', 'create_users', 'Create new users', 'admin', 'users', 'create', 1),
('Edit Users', 'edit_users', 'Edit user details', 'admin', 'users', 'update', 1),
('Delete Users', 'delete_users', 'Delete users', 'admin', 'users', 'delete', 1),
('Approve Users', 'approve_users', 'Approve user registrations', 'admin', 'users', 'approve', 1),

-- Team Management permissions
('Manage Team', 'manage_team', 'Full team management access', 'admin', 'team', 'manage', 1),
('View Team', 'view_team', 'View team members', 'admin', 'team', 'read', 1),
('Invite Team Members', 'invite_team_members', 'Invite new team members', 'admin', 'team', 'create', 1),
('Edit Team Permissions', 'edit_team_permissions', 'Modify team member permissions', 'admin', 'team', 'update', 1),
('Remove Team Members', 'remove_team_members', 'Remove team members', 'admin', 'team', 'delete', 1),

-- Reports permissions
('View Reports', 'view_reports', 'Access to reports section', 'reports', 'reports', 'read', 1),
('Create Reports', 'create_reports', 'Create custom reports', 'reports', 'reports', 'create', 1),
('Export Reports', 'export_reports', 'Export reports to various formats', 'reports', 'reports', 'export', 1),

-- Settings permissions
('Manage Settings', 'manage_settings', 'Full access to system settings', 'settings', 'settings', 'manage', 1),
('View Settings', 'view_settings', 'View system settings', 'settings', 'settings', 'read', 1),
('Edit Profile', 'edit_profile', 'Edit own profile', 'settings', 'profile', 'update', 1),

-- Subscription Management (Super Admin only)
('Manage Subscriptions', 'manage_subscriptions', 'Manage client subscriptions', 'admin', 'subscriptions', 'manage', 1),
('View Subscriptions', 'view_subscriptions', 'View subscription details', 'admin', 'subscriptions', 'read', 1),

-- Organization Management (Super Admin only)
('Manage Organizations', 'manage_organizations', 'Full organization management', 'admin', 'organizations', 'manage', 1),
('View Organizations', 'view_organizations', 'View organizations', 'admin', 'organizations', 'read', 1);

-- 8. Insert default role permissions
-- Super Admin gets all permissions
INSERT OR IGNORE INTO role_permissions (role, permission_id)
SELECT 'superadmin', id FROM permissions;

-- Admin gets most permissions except super admin specific ones
INSERT OR IGNORE INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions 
WHERE slug NOT IN ('manage_subscriptions', 'manage_organizations');

-- Team gets basic permissions
INSERT OR IGNORE INTO role_permissions (role, permission_id)
SELECT 'team', id FROM permissions 
WHERE slug IN (
  'view_dashboard', 'view_analytics', 'view_leads', 'create_leads', 'edit_leads',
  'view_contacts', 'create_contacts', 'edit_contacts', 'view_reports', 'edit_profile'
);

-- Customer gets minimal permissions
INSERT OR IGNORE INTO role_permissions (role, permission_id)
SELECT 'customer', id FROM permissions 
WHERE slug IN ('view_dashboard', 'edit_profile');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_parent_user_id ON users(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_team_member_permissions_team_member_id ON team_member_permissions(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_member_permissions_admin_id ON team_member_permissions(admin_id);