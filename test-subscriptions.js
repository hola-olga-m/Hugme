/**
 * Test script for GraphQL Subscriptions in HugMeNow
 * 
 * This script tests real-time updates with GraphQL subscriptions
 * It tests both newMood and newHug subscriptions
 * 
 * NOTE: This script uses direct mutations to the server to trigger
 * subscription events. It doesn't validate the actual payload data,
 * only that the subscription is established and messages are flowing.
 */

import { createClient } from 'graphql-ws';
import WebSocket from 'ws';
import fetch from 'node-fetch';
import chalk from 'chalk';

// Get the port from the environment variable, default to 5003
const PORT = process.env.GATEWAY_PORT || '5003';
const APOLLO_MESH_ENDPOINT = `http://localhost:${PORT}/graphql`;
const APOLLO_MESH_WS_ENDPOINT = `ws://localhost:${PORT}/graphql`;

// Test user credentials
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';
const TEST_TOKEN = 'Bearer test-token-for-development-only';

// Sample UUIDs for testing (valid PostgreSQL UUID format)
const USER_ID_1 = '550e8400-e29b-41d4-a716-446655440000'; // Sample sender
const USER_ID_2 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Sample recipient

// Create WebSocket client for subscriptions
const wsClient = createClient({
  url: APOLLO_MESH_WS_ENDPOINT,
  webSocketImpl: WebSocket,
  connectionParams: () => {
    console.log(chalk.blue(`Setting connection parameters with token: ${TEST_TOKEN ? 'Present' : 'Not present'}`));
    return {
      authorization: TEST_TOKEN
    };
  },
  retryAttempts: 5,
  retryWait: (retries) => retries * 1000, // Exponential backoff
  shouldRetry: (error) => {
    console.log(chalk.yellow(`Checking if we should retry: ${error.message}`));
    return true; // Always retry
  },
  onNonLazyError: (error) => {
    console.error(chalk.red('Non-lazy WebSocket error:'), error);
  }
});

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
 * Subscribe to a GraphQL subscription via WebSocket
 */
function subscribe(query, variables = {}, onNext) {
  console.log(chalk.blue(`Setting up subscription: \n${query}\n`));
  console.log(chalk.blue(`Variables:`, JSON.stringify(variables, null, 2)));
  
  return new Promise((resolve) => {
    // Track if we've received the first message or error
    let firstResponseReceived = false;
    
    console.log(chalk.yellow('Connecting to WebSocket...'));
    
    // Implement a retry mechanism
    let attempts = 0;
    const maxAttempts = 3;
    let unsubscribe;
    
    const attemptSubscribe = () => {
      try {
        if (attempts > 0) {
          console.log(chalk.yellow(`Retrying subscription (attempt ${attempts} of ${maxAttempts})...`));
        }
        
        // Create the subscription
        unsubscribe = wsClient.subscribe(
          { query, variables },
          {
            next: (result) => {
              console.log(chalk.green('✓ Subscription event received:'), JSON.stringify(result, null, 2));
              if (!firstResponseReceived) {
                firstResponseReceived = true;
                resolve({ success: true, data: result });
              }
              if (onNext) onNext(result);
            },
            error: (error) => {
              console.error(chalk.red('✗ Subscription error:'), error);
              
              if (attempts < maxAttempts) {
                attempts++;
                console.log(chalk.yellow(`Waiting 1 second before retry...`));
                setTimeout(attemptSubscribe, 1000);
              } else if (!firstResponseReceived) {
                console.error(chalk.red(`Giving up after ${maxAttempts} attempts`));
                firstResponseReceived = true;
                resolve({ success: false, error });
              }
            },
            complete: () => {
              console.log(chalk.yellow('Subscription completed'));
            }
          }
        );
      } catch (error) {
        console.error(chalk.red('Exception setting up subscription:'), error);
        
        if (attempts < maxAttempts) {
          attempts++;
          console.log(chalk.yellow(`Waiting 1 second before retry...`));
          setTimeout(attemptSubscribe, 1000);
        } else if (!firstResponseReceived) {
          console.error(chalk.red(`Giving up after ${maxAttempts} attempts`));
          firstResponseReceived = true;
          resolve({ success: false, error });
        }
      }
    };
    
    // Start the first attempt
    attemptSubscribe();
    
    // Set a timeout for the initial connection
    setTimeout(() => {
      if (!firstResponseReceived) {
        console.log(chalk.yellow('Setting up initial connection timeout of 10 seconds'));
        firstResponseReceived = true;
        resolve({ success: false, error: 'Timeout waiting for subscription connection' });
      }
    }, 10000);
    
    // Return the unsubscribe function if needed later
    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (e) {
          console.error('Error unsubscribing:', e);
        }
      }
    };
  });
}

/**
 * Test subscribing to new moods
 */
async function testNewMoodSubscription() {
  console.log(chalk.blue('\n=== Testing Mood Subscription ==='));
  
  // Set up subscription first
  const subscriptionPromise = subscribe(`
    subscription {
      newMood {
        id
        intensity
        message
        createdAt
        userId
      }
    }
  `);
  
  // Wait a moment for the subscription to be established
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a new mood to trigger the subscription
  console.log('Creating new mood to trigger subscription...');
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
      intensity: 7,
      message: "Testing subscriptions! Feeling good!",
      userId: USER_ID_1
    }
  });
  
  console.log(chalk.green('Created mood:'), createResult?.createMood);
  
  // Wait for subscription event (or timeout after 5 seconds)
  const subscriptionResult = await Promise.race([
    subscriptionPromise,
    new Promise(resolve => setTimeout(() => resolve({ success: false, error: 'Timeout waiting for subscription' }), 5000))
  ]);
  
  if (subscriptionResult.success) {
    console.log(chalk.green('✓ Successfully received newMood subscription event'));
    return true;
  } else {
    console.log(chalk.red('✗ Failed to receive newMood subscription event:', subscriptionResult.error));
    return false;
  }
}

/**
 * Test subscribing to new hugs
 */
async function testNewHugSubscription() {
  console.log(chalk.blue('\n=== Testing Hug Subscription ==='));
  
  // Set up subscription first
  const subscriptionPromise = subscribe(`
    subscription {
      newHug {
        id
        message
        senderId
        recipientId
        sentAt
      }
    }
  `);
  
  // Wait a moment for the subscription to be established
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Send a new hug to trigger the subscription
  console.log('Sending new hug to trigger subscription...');
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
      message: "Here's a supportive hug for you!",
      senderId: USER_ID_1,
      recipientId: USER_ID_2
    }
  });
  
  console.log(chalk.green('Sent hug:'), sendResult?.sendHug);
  
  // Wait for subscription event (or timeout after 5 seconds)
  const subscriptionResult = await Promise.race([
    subscriptionPromise,
    new Promise(resolve => setTimeout(() => resolve({ success: false, error: 'Timeout waiting for subscription' }), 5000))
  ]);
  
  if (subscriptionResult.success) {
    console.log(chalk.green('✓ Successfully received newHug subscription event'));
    return true;
  } else {
    console.log(chalk.red('✗ Failed to receive newHug subscription event:', subscriptionResult.error));
    return false;
  }
}

/**
 * Test subscribing to hugs received by a specific user
 */
async function testHugReceivedSubscription() {
  console.log(chalk.blue('\n=== Testing Hug Received Subscription ==='));
  
  const recipientId = USER_ID_2;
  
  // Set up subscription first
  const subscriptionPromise = subscribe(`
    subscription HugReceived($userId: ID!) {
      newHugReceived(userId: $userId) {
        id
        message
        senderId
        recipientId
        sentAt
      }
    }
  `, { userId: recipientId });
  
  // Wait a moment for the subscription to be established
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Send a new hug to trigger the subscription
  console.log(`Sending new hug to user ${recipientId} to trigger subscription...`);
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
      message: "Testing user-specific hug subscriptions!",
      senderId: USER_ID_1,
      recipientId: recipientId
    }
  });
  
  console.log(chalk.green('Sent hug:'), sendResult?.sendHug);
  
  // Wait for subscription event (or timeout after 5 seconds)
  const subscriptionResult = await Promise.race([
    subscriptionPromise,
    new Promise(resolve => setTimeout(() => resolve({ success: false, error: 'Timeout waiting for subscription' }), 5000))
  ]);
  
  if (subscriptionResult.success) {
    console.log(chalk.green(`✓ Successfully received newHugReceived subscription event for user ${recipientId}`));
    return true;
  } else {
    console.log(chalk.red(`✗ Failed to receive newHugReceived subscription event for user ${recipientId}:`, subscriptionResult.error));
    return false;
  }
}

/**
 * Run all subscription tests
 */
async function runTests() {
  console.log(chalk.yellow('Starting GraphQL Subscription tests...'));
  
  try {
    const moodSuccess = await testNewMoodSubscription();
    const hugSuccess = await testNewHugSubscription();
    const hugReceivedSuccess = await testHugReceivedSubscription();
    
    console.log(chalk.blue('\n=== Test Summary ==='));
    console.log(`New Mood Subscription: ${moodSuccess ? chalk.green('✓ PASS') : chalk.red('✗ FAIL')}`);
    console.log(`New Hug Subscription: ${hugSuccess ? chalk.green('✓ PASS') : chalk.red('✗ FAIL')}`);
    console.log(`Hug Received Subscription: ${hugReceivedSuccess ? chalk.green('✓ PASS') : chalk.red('✗ FAIL')}`);
    
    if (moodSuccess && hugSuccess && hugReceivedSuccess) {
      console.log(chalk.green('\n✅ All subscription tests passed!'));
    } else {
      console.log(chalk.red('\n❌ Some subscription tests failed.'));
    }
  } catch (error) {
    console.error(chalk.red('Error running subscription tests:'), error);
  } finally {
    // Close the WebSocket connection
    await wsClient.dispose();
    process.exit(0);
  }
}

// Run the tests
runTests();