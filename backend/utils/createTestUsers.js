const bcrypt = require('bcryptjs');
const { query, insert } = require('../config/database');
require('dotenv').config();

/**
 * Create Test Users for Different Roles
 * This utility creates test users for admin, user, and customer roles
 */

const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin',
    approval_status: 'approved',
    is_active: 1,
    email_verified: 1,
    phone: '+1-555-0101',
    company: 'BD SaaS Inc',
    position: 'System Administrator'
  },
  {
    name: 'Team Member',
    email: 'team@test.com',
    password: 'Team123!',
    role: 'team',
    approval_status: 'approved',
    is_active: 1,
    email_verified: 1,
    phone: '+1-555-0102',
    company: 'BD SaaS Inc',
    position: 'Sales Representative'
  },
  {
    name: 'Regular User',
    email: 'user@test.com',
    password: 'User123!',
    role: 'customer',
    approval_status: 'approved',
    is_active: 1,
    email_verified: 1,
    phone: '+1-555-0103',
    company: 'Test Company',
    position: 'Manager'
  },
  {
    name: 'Customer User',
    email: 'customer@test.com',
    password: 'Customer123!',
    role: 'customer',
    approval_status: 'approved',
    is_active: 1,
    email_verified: 1,
    phone: '+1-555-0104',
    company: 'Customer Corp',
    position: 'Business Owner'
  }
];

async function createTestUsers() {
  try {
    console.log('🚀 Creating test users...\n');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await query(
        'SELECT * FROM users WHERE email = ?',
        [userData.email]
      );

      if (existingUser.length > 0) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const insertQuery = `
        INSERT INTO users (
          name, email, password, role, approval_status, is_active, email_verified,
          phone, company, position, preferences
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const preferences = JSON.stringify({
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      });

      const values = [
        userData.name,
        userData.email.toLowerCase(),
        hashedPassword,
        userData.role,
        userData.approval_status,
        userData.is_active,
        userData.email_verified,
        userData.phone,
        userData.company,
        userData.position,
        preferences
      ];

      const result = await insert(insertQuery, values);
      
      console.log(`✅ Created user: ${userData.name}`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   🔑 Role: ${userData.role}`);
      console.log(`   🆔 ID: ${result.id}\n`);
    }

    console.log('🎉 All test users created successfully!\n');
    
    // Display all users
    const allUsers = await query('SELECT id, name, email, role, approval_status, is_active FROM users ORDER BY id');
    console.log('📋 Current Users in Database:');
    console.table(allUsers);

  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
    throw error;
  }
}

/**
 * Display Login Credentials
 */
function displayLoginCredentials() {
  console.log('\n🔐 LOGIN CREDENTIALS FOR TESTING:\n');
  
  console.log('🔴 SUPER ADMIN:');
  console.log('   Email: admin@bd-saas.com');
  console.log('   Password: SuperAdmin123!');
  console.log('   Role: superadmin\n');
  
  console.log('🟠 ADMIN:');
  console.log('   Email: admin@test.com');
  console.log('   Password: Admin123!');
  console.log('   Role: admin\n');
  
  console.log('🟡 TEAM MEMBER:');
  console.log('   Email: team@test.com');
  console.log('   Password: Team123!');
  console.log('   Role: team\n');
  
  console.log('🟢 CUSTOMER (User 1):');
  console.log('   Email: user@test.com');
  console.log('   Password: User123!');
  console.log('   Role: customer\n');
  
  console.log('🔵 CUSTOMER (User 2):');
  console.log('   Email: customer@test.com');
  console.log('   Password: Customer123!');
  console.log('   Role: customer\n');
  
  console.log('📝 Note: All passwords follow strong security requirements:');
  console.log('   - Minimum 8 characters');
  console.log('   - Contains uppercase and lowercase letters');
  console.log('   - Contains numbers and special characters');
  console.log('   - Stored as bcrypt hashes with salt rounds = 12\n');
}

// Command line interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      createTestUsers()
        .then(() => {
          displayLoginCredentials();
          process.exit(0);
        })
        .catch(() => process.exit(1));
      break;
      
    case 'credentials':
      displayLoginCredentials();
      process.exit(0);
      break;
      
    default:
      console.log('Usage:');
      console.log('  node createTestUsers.js create      - Create test users');
      console.log('  node createTestUsers.js credentials - Display login credentials');
      process.exit(0);
  }
}

module.exports = {
  createTestUsers,
  displayLoginCredentials,
  testUsers
};