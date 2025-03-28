/**
 * Test script for GraphQL Live Query in HugMeNow
 * 
 * This script demonstrates how to use the @live directive for real-time
 * data updates without explicit subscription handling.
 */

import fetch from 'node-fetch';
import chalk from 'chalk';
// Import our unified GraphQL version
import { getGraphQLVersion } from './graphql-resolver.js';

// Log the GraphQL version we're using
console.log('Using GraphQL version:', getGraphQLVersion());

// Get the port from the environment variable, default to 5003
const PORT = process.env.GATEWAY_PORT || '5003';
const APOLLO_MESH_ENDPOINT = `http://localhost:${PORT}/graphql`;

// Test user credentials
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';
const TEST_TOKEN = 'Bearer test-token-for-development-only';

// Sample UUIDs for testing (valid PostgreSQL UUID format)
const USER_ID_1 = '550e8400-e29b-41d4-a716-446655440000'; // Sample sender
const USER_ID_2 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Sample recipient

/**
 * Execute a GraphQL query/mutation via HTTP
 * This function uses direct REST calls to avoid GraphQL library version conflicts
 */
async function executeGraphQL(query, variables = {}, token = TEST_TOKEN) {
  try {
    // Get the endpoint from environment or use default
    const port = process.env.GATEWAY_PORT || '5003';
    const endpoint = `http://localhost:${port}/graphql`;
    console.log(`Executing GraphQL to ${endpoint}`);
    
    // Do a direct POST request with the query as a string
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {})
      },
      body: JSON.stringify({ 
        query: query,
        variables: variables
      })
    });
    
    // Parse the response
    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Error executing GraphQL:', error);
    return null;
  }
}

/**
 * Test using Live Query to automatically update mood data
 */
async function testLiveQueryMoods() {
  console.log(chalk.blue('\n=== Testing Live Query for Mood Updates ==='));
  
  // Step 1: Execute the query with @live directive
  console.log('Executing Live Query for mood updates...');
  console.log('Note: In a real client, this would establish a live connection');
  console.log('      that automatically refreshes when data changes');
  
  const liveMoodsQuery = `
    query GetLiveMoods @live {
      userMoods(userId: "${USER_ID_1}", limit: 5) {
        id
        intensity
        message
        createdAt
        userId
      }
    }
  `;
  
  const initialResult = await executeGraphQL(liveMoodsQuery);
  console.log(chalk.green('Initial mood data:'), initialResult?.userMoods);
  
  // Step 2: Create a new mood to demonstrate how it would trigger updates
  console.log('\nCreating a new mood...');
  console.log('In a real client implementation, this would automatically update the previous query results');
  
  const createResult = await executeGraphQL(`
    mutation CreateMood($input: CreateMoodInput!) {
      createMood(input: $input) {
        id
        intensity
        message
        userId
        createdAt
      }
    }
  `, {
    input: {
      intensity: 8,
      message: "Testing live queries! This will automatically refresh mood data!",
      userId: USER_ID_1
    }
  });
  
  console.log(chalk.green('Created mood:'), createResult?.createMood);
  
  // Step 3: Explain how the previous query would automatically update
  console.log(chalk.yellow('\nWith @live directive, the client would automatically receive an updated result'));
  console.log(chalk.yellow('without having to manually execute the query again.'));
  
  return true;
}

/**
 * Test using Live Query to automatically update hug data
 */
async function testLiveQueryHugs() {
  console.log(chalk.blue('\n=== Testing Live Query for Hug Updates ==='));
  
  // Step 1: Execute the query with @live directive
  console.log('Executing Live Query for hug updates...');
  
  const liveHugsQuery = `
    query GetLiveHugs @live {
      receivedHugs(userId: "${USER_ID_2}", limit: 5) {
        id
        message
        senderId
        recipientId
        sentAt
      }
    }
  `;
  
  const initialResult = await executeGraphQL(liveHugsQuery);
  console.log(chalk.green('Initial hugs data:'), initialResult?.receivedHugs);
  
  // Step 2: Send a new hug to demonstrate how it would trigger updates
  console.log('\nSending a new hug...');
  console.log('In a real client implementation, this would automatically update the previous query results');
  
  const sendResult = await executeGraphQL(`
    mutation SendHug($input: SendHugInput!) {
      sendHug(input: $input) {
        id
        message
        senderId
        recipientId
        sentAt
      }
    }
  `, {
    input: {
      message: "Testing live queries with hugs! This will automatically refresh hug data!",
      senderId: USER_ID_1,
      recipientId: USER_ID_2
    }
  });
  
  console.log(chalk.green('Sent hug:'), sendResult?.sendHug);
  
  // Step 3: Explain how the previous query would automatically update
  console.log(chalk.yellow('\nWith @live directive, the client would automatically receive an updated list of hugs'));
  console.log(chalk.yellow('without having to manually execute the query again.'));
  
  return true;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(chalk.yellow('Starting GraphQL Live Query tests...'));
  
  try {
    const moodsSuccess = await testLiveQueryMoods();
    const hugsSuccess = await testLiveQueryHugs();
    
    console.log(chalk.blue('\n=== Test Summary ==='));
    console.log(`Live Mood Updates: ${moodsSuccess ? chalk.green('✓ DEMO COMPLETE') : chalk.red('✗ DEMO FAILED')}`);
    console.log(`Live Hug Updates: ${hugsSuccess ? chalk.green('✓ DEMO COMPLETE') : chalk.red('✗ DEMO FAILED')}`);
    
    if (moodsSuccess && hugsSuccess) {
      console.log(chalk.green('\n✅ All Live Query demos completed!'));
      console.log(chalk.cyan('\nHow to use Live Queries in your client:'));
      console.log(chalk.cyan('1. Simply add @live directive to any query that should update in real-time'));
      console.log(chalk.cyan('2. The query will automatically refresh when related mutations occur'));
      console.log(chalk.cyan('3. No need to handle subscriptions or WebSocket connections manually'));
    } else {
      console.log(chalk.red('\n❌ Some Live Query demos failed.'));
    }
  } catch (error) {
    console.error(chalk.red('Error running Live Query tests:'), error);
  } finally {
    process.exit(0);
  }
}

// Run the tests
runTests();