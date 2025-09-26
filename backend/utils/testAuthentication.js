const axios = require('axios');
const colors = require('colors');

/**
 * Authentication Testing Utility
 * Tests login functionality and role-based access control
 */

const BASE_URL = 'http://localhost:5001/api';

// Test credentials
const testCredentials = [
  {
    name: 'Super Admin',
    email: 'admin@bd-saas.com',
    password: 'SuperAdmin123!',
    role: 'superadmin',
    color: 'red'
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin',
    color: 'yellow'
  },
  {
    name: 'Team Member',
    email: 'team@test.com',
    password: 'Team123!',
    role: 'team',
    color: 'cyan'
  },
  {
    name: 'Customer User 1',
    email: 'user@test.com',
    password: 'User123!',
    role: 'customer',
    color: 'green'
  },
  {
    name: 'Customer User 2',
    email: 'customer@test.com',
    password: 'Customer123!',
    role: 'customer',
    color: 'blue'
  }
];

/**
 * Test login functionality
 */
async function testLogin(credentials) {
  try {
    console.log(`\n🔐 Testing login for ${credentials.name}...`);
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });

    // The response structure is { success, message, data: { user, token } }
    const responseData = response.data.data || response.data;
    const token = responseData.token;
    const user = responseData.user;

    if (response.status === 200 && token) {
      console.log(`✅ Login successful for ${credentials.name}`.green);
      console.log(`   Token: ${token.substring(0, 20)}...`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Name: ${user.name}`);
      
      return {
        success: true,
        token: token,
        user: user
      };
    } else {
      console.log(`❌ Login failed for ${credentials.name}`.red);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ Login error for ${credentials.name}: ${error.response?.data?.message || error.message}`.red);
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

/**
 * Test protected routes with different roles
 */
async function testProtectedRoutes(token, userInfo) {
  const routes = [
    { path: '/auth/profile', method: 'GET', description: 'Get user profile' },
    { path: '/users', method: 'GET', description: 'List all users (admin only)' },
    { path: '/contacts', method: 'GET', description: 'List contacts' },
    { path: '/leads', method: 'GET', description: 'List leads' },
    { path: '/activities', method: 'GET', description: 'List activities' },
    { path: '/companies', method: 'GET', description: 'List companies' }
  ];

  console.log(`\n🛡️  Testing protected routes for ${userInfo.name} (${userInfo.role})...`);

  for (const route of routes) {
    try {
      const config = {
        method: route.method,
        url: `${BASE_URL}${route.path}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios(config);
      
      if (response.status === 200) {
        console.log(`   ✅ ${route.description}: Access granted`);
      } else {
        console.log(`   ⚠️  ${route.description}: Unexpected response (${response.status})`);
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      if (status === 401) {
        console.log(`   🔒 ${route.description}: Unauthorized (401) - Token invalid`);
      } else if (status === 403) {
        console.log(`   🚫 ${route.description}: Forbidden (403) - Insufficient permissions`);
      } else if (status === 404) {
        console.log(`   ❓ ${route.description}: Not found (404) - Route may not exist`);
      } else {
        console.log(`   ❌ ${route.description}: Error (${status}) - ${message}`);
      }
    }
  }
}

/**
 * Test token validation
 */
async function testTokenValidation(token, userInfo) {
  try {
    console.log(`\n🔍 Testing token validation for ${userInfo.name}...`);
    
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      console.log(`   ✅ Token is valid`);
      console.log(`   📋 Profile data retrieved successfully`);
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Token validation failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

/**
 * Test invalid credentials
 */
async function testInvalidCredentials() {
  console.log('\n🚨 Testing invalid credentials...'.red);
  
  const invalidTests = [
    { email: 'admin@bd-saas.com', password: 'wrongpassword', description: 'Wrong password' },
    { email: 'nonexistent@test.com', password: 'password123', description: 'Non-existent user' },
    { email: 'admin@bd-saas.com', password: '', description: 'Empty password' },
    { email: '', password: 'SuperAdmin123!', description: 'Empty email' }
  ];

  for (const test of invalidTests) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: test.email,
        password: test.password
      });
      
      console.log(`   ❌ ${test.description}: Should have failed but got status ${response.status}`);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        console.log(`   ✅ ${test.description}: Correctly rejected (${error.response.status})`);
      } else {
        console.log(`   ⚠️  ${test.description}: Unexpected error (${error.response?.status})`);
      }
    }
  }
}

/**
 * Main testing function
 */
async function runAuthenticationTests() {
  console.log('🚀 Starting Authentication and Authorization Tests\n'.rainbow);
  console.log('=' .repeat(60));

  // Test server connectivity
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running and accessible'.green);
  } catch (error) {
    console.log('❌ Server is not accessible. Make sure the backend is running on port 5001'.red);
    return;
  }

  const loginResults = [];

  // Test login for each user role
  for (const credentials of testCredentials) {
    const result = await testLogin(credentials);
    if (result.success) {
      loginResults.push({ ...result, credentials });
    }
  }

  // Test protected routes for each successfully logged in user
  for (const result of loginResults) {
    await testProtectedRoutes(result.token, result.user);
    await testTokenValidation(result.token, result.user);
  }

  // Test invalid credentials
  await testInvalidCredentials();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY'.rainbow);
  console.log('='.repeat(60));
  
  console.log(`\n✅ Successful logins: ${loginResults.length}/${testCredentials.length}`.green);
  
  if (loginResults.length === testCredentials.length) {
    console.log('🎉 All authentication tests passed!'.green);
  } else {
    console.log('⚠️  Some authentication tests failed. Check the logs above.'.yellow);
  }

  console.log('\n🔐 VERIFIED LOGIN CREDENTIALS:'.cyan);
  for (const result of loginResults) {
    console.log(`   ${result.user.role.toUpperCase()}: ${result.credentials.email} / ${result.credentials.password}`);
  }
}

// Run tests if called directly
if (require.main === module) {
  runAuthenticationTests()
    .then(() => {
      console.log('\n✨ Authentication testing completed!'.green);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Testing failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  runAuthenticationTests,
  testLogin,
  testProtectedRoutes,
  testTokenValidation,
  testInvalidCredentials
};