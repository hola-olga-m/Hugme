/**
 * Demo script for testing mock authentication with Live Queries
 * 
 * This script demonstrates how to use mock authentication
 * to test authenticated operations without real user accounts.
 */

import fetch from 'cross-fetch';
import chalk from 'chalk';

// Configuration
const GATEWAY_URL = 'http://localhost:5006/graphql';

// Mock user for testing
const MOCK_USER = {
  id: 'mock-user-123',
  username: 'mockuser',
  email: 'mock@example.com'
};

// Mock authentication token
const MOCK_TOKEN = 'mock-auth-token-for-testing';

/**
 * Execute a GraphQL query with mock authentication
 */
async function executeWithMockAuth(query, variables = {}) {
  try {
    console.log(chalk.blue('\n🔄 Executing GraphQL operation with mock authentication:'));
    console.log(chalk.blue(query));
    
    // Log variables for debugging
    if (Object.keys(variables).length > 0) {
      console.log(chalk.blue('Variables:'));
      console.dir(variables, { depth: null, colors: true });
    }
    
    console.log(chalk.magenta('📤 Sending request to:', GATEWAY_URL));
    console.log(chalk.magenta('🔑 Using auth token:', MOCK_TOKEN));
    
    const requestBody = JSON.stringify({ query, variables });
    console.log(chalk.magenta('📦 Request body:'), requestBody.substring(0, 100) + (requestBody.length > 100 ? '...' : ''));
    
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOCK_TOKEN}`
      },
      body: requestBody,
    });
    
    console.log(chalk.magenta('📥 Response status:'), response.status, response.statusText);
    console.log(chalk.magenta('📥 Response headers:'), Object.fromEntries([...response.headers.entries()]));
    
    const result = await response.json();
    
    if (result.errors) {
      console.error(chalk.red('❌ GraphQL Error:'), JSON.stringify(result.errors, null, 2));
    } else {
      console.log(chalk.green('✅ Success!'));
    }
    
    console.log(chalk.cyan('📊 Response data:'));
    console.dir(result.data, { depth: null, colors: true });
    
    console.log(chalk.cyan('📊 Full response:'));
    console.dir(result, { depth: null, colors: true });
    
    return result;
  } catch (error) {
    console.error(chalk.red('❌ Network Error:'), error.message);
    throw error;
  }
}

/**
 * Run a series of demo operations with mock authentication
 */
async function runMockAuthDemo() {
  console.log(chalk.yellow('🧪 Starting Mock Authentication Demo'));
  console.log(chalk.yellow('================================='));
  console.log(chalk.yellow('This demo shows how to use mock authentication for testing'));
  console.log(chalk.yellow('The gateway will simulate a logged-in user without requiring real auth'));
  
  // 1. Get client info (no auth required)
  await executeWithMockAuth(`
    query ClientInfo {
      clientInfo {
        version
        platform
        features
      }
    }
  `);
  
  // 2. Query user moods with mock auth
  await executeWithMockAuth(`
    query UserMoods($userId: ID!, $limit: Int!) {
      userMoods(userId: $userId, limit: $limit) {
        id
        mood
        intensity
        message
        isPublic
      }
    }
  `, {
    userId: MOCK_USER.id,
    limit: 5
  });
  
  // 3. Try creating a mood with mock auth
  await executeWithMockAuth(`
    mutation CreateMood($input: MoodInput!) {
      createMood(input: $input) {
        mood {
          id
          mood
          intensity
          message
        }
      }
    }
  `, {
    input: {
      mood: {
        userId: MOCK_USER.id,
        mood: "excited",
        intensity: 8,
        message: "Testing with mock authentication",
        isPublic: true
      }
    }
  });
  
  // 4. Query received hugs with mock auth
  await executeWithMockAuth(`
    query ReceivedHugs($userId: ID!, $limit: Int!) {
      receivedHugs(userId: $userId, limit: $limit) {
        id
        message
        createdAt
        fromUser {
          id
          username
        }
        toUser {
          id
          username
        }
      }
    }
  `, {
    userId: MOCK_USER.id,
    limit: 5
  });
  
  // 5. Demo live query (note: this won't actually wait for updates in this demo)
  // In a real application, a WebSocket connection would be maintained
  await executeWithMockAuth(`
    query LiveUserMoods($userId: ID!, $limit: Int!) @live {
      userMoods(userId: $userId, limit: $limit) {
        id
        mood
        intensity
        message
      }
    }
  `, {
    userId: MOCK_USER.id,
    limit: 5
  });
  
  console.log(chalk.yellow('\n🔎 Demo Summary'));
  console.log(chalk.yellow('============='));
  console.log(chalk.yellow('- Demonstrated using mock authentication token for testing'));
  console.log(chalk.yellow('- Showed how to query user-specific data with mock auth'));
  console.log(chalk.yellow('- Queried received hugs with mock authentication'));
  console.log(chalk.yellow('- Demonstrated mock mutations (create mood)'));
  console.log(chalk.yellow('- Showed how to use @live directive with mock authentication'));
  
  console.log(chalk.cyan('\n💡 Key Points'));
  console.log(chalk.cyan('========='));
  console.log(chalk.cyan('1. Use "Bearer mock-auth-token-for-testing" in Authorization header'));
  console.log(chalk.cyan('2. The server automatically creates a mock user context'));
  console.log(chalk.cyan('3. All user-specific operations can be tested without real users'));
  console.log(chalk.cyan('4. Great for automated testing and development'));
}

// Run the demo
runMockAuthDemo();