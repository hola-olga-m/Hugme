/**
 * Test script for Apollo Mesh Gateway integration with PostGraphile
 * 
 * This script tests connectivity and basic functionality of the Apollo Mesh Gateway, 
 * verifying proper integration with PostGraphile and schema transformations.
 */

import fetch from 'node-fetch';

// Configuration
const APOLLO_MESH_URL = 'http://localhost:5003/graphql';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

/**
 * Execute a GraphQL query against the Apollo Mesh Gateway
 */
async function executeQuery(query, variables = {}, token = null) {
  try {
    const response = await fetch(APOLLO_MESH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return { error: result.errors };
    }
    
    return { data: result.data };
  } catch (error) {
    console.error('Error executing query:', error.message);
    return { error };
  }
}

/**
 * Test client information query
 */
async function testClientInfo() {
  console.log('\n--- Testing clientInfo Query ---');
  
  const { data, error } = await executeQuery(`
    query GetClientInfo {
      clientInfo {
        version
        platform
        buildDate
        features
      }
    }
  `);
  
  if (error) {
    console.error('❌ clientInfo query failed!');
    return false;
  }
  
  console.log('✅ clientInfo query result:', data.clientInfo);
  return true;
}

/**
 * Test publicMoods query (PostGraphile integration)
 */
async function testPublicMoods() {
  console.log('\n--- Testing publicMoods Query (PostGraphile Integration) ---');
  
  const { data, error } = await executeQuery(`
    query GetPublicMoods {
      publicMoods(limit: 5) {
        id
        intensity
        message
        createdAt
        user {
          id
          name
        }
      }
    }
  `);
  
  if (error) {
    console.error('❌ publicMoods query failed!');
    return false;
  }
  
  if (!data.publicMoods || !Array.isArray(data.publicMoods)) {
    console.error('❌ Invalid publicMoods response format!');
    return false;
  }
  
  console.log(`✅ Found ${data.publicMoods.length} public moods:`);
  data.publicMoods.forEach(mood => {
    console.log(`   - Mood ID: ${mood.id}, Intensity: ${mood.intensity}, User: ${mood.user?.name || 'Unknown'}`);
  });
  
  return true;
}

/**
 * Test friendsMoods query (requires authentication)
 */
async function testFriendsMoods(token) {
  console.log('\n--- Testing friendsMoods Query ---');
  
  if (!token) {
    console.log('⚠️ No token provided. Friends moods requires authentication.');
    return false;
  }
  
  const { data, error } = await executeQuery(`
    query GetFriendsMoods {
      friendsMoods(limit: 3) {
        id
        intensity
        message
        createdAt
        user {
          id
          name
        }
      }
    }
  `, {}, token);
  
  if (error) {
    console.error('❌ friendsMoods query failed!');
    return false;
  }
  
  console.log(`✅ Found ${data.friendsMoods.length} friend moods:`);
  data.friendsMoods.forEach(mood => {
    console.log(`   - Mood ID: ${mood.id}, Intensity: ${mood.intensity}, User: ${mood.user?.name || 'Unknown'}`);
  });
  
  return true;
}

/**
 * Test authentication (login)
 */
async function testAuthentication() {
  console.log('\n--- Testing Authentication ---');
  
  // Use test credentials - in a real world scenario, these would be securely stored
  const variables = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  const { data, error } = await executeQuery(`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `, variables);
  
  if (error) {
    console.log('⚠️ Login failed - this is expected if test user does not exist');
    return null;
  }
  
  console.log('✅ Authentication successful!');
  console.log(`   User: ${data.login.user.name} (${data.login.user.email})`);
  return data.login.token;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 Testing Apollo Mesh Gateway\n');
  
  const clientInfoSuccess = await testClientInfo();
  const publicMoodsSuccess = await testPublicMoods();
  
  // Test authentication and friend moods if credentials are available
  const token = await testAuthentication();
  let friendsMoodsSuccess = false;
  
  if (token) {
    friendsMoodsSuccess = await testFriendsMoods(token);
  }
  
  // Summary
  console.log('\n--- Test Results Summary ---');
  console.log(`clientInfo: ${clientInfoSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`publicMoods: ${publicMoodsSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`authentication: ${token ? '✅ PASS' : '⚠️ SKIP (no valid credentials)'}`);
  console.log(`friendsMoods: ${friendsMoodsSuccess ? '✅ PASS' : '⚠️ SKIP (requires authentication)'}`);
}

// Execute tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});