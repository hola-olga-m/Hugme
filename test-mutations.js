/**
 * Test script for Apollo Mesh Gateway - Mutations
 * 
 * This script tests the createMood and sendHug mutations in our Apollo Mesh Gateway
 */

import fetch from 'node-fetch';

const GATEWAY_URL = 'http://localhost:5003/graphql';
// Use a fake token for testing to bypass authentication check
const TEST_TOKEN = 'Bearer fake-test-token-for-debugging';

// Helper function to execute GraphQL queries
async function executeGraphQL(query, variables = {}, token = TEST_TOKEN) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = token;
  }

  try {
    console.log('Executing query:', query);
    console.log('Variables:', JSON.stringify(variables, null, 2));
    
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
    }
    
    return result;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}

// Test the available schema
async function checkSchema() {
  console.log('\n=== Checking Schema ===');
  
  const result = await executeGraphQL(`
    query IntrospectMutations {
      __type(name: "Mutation") {
        name
        fields {
          name
          args {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  `);
  
  if (result.errors) {
    console.error('Failed to introspect schema:', result.errors);
    return;
  }
  
  console.log('Available Mutations:');
  const fields = result.data?.__type?.fields || [];
  
  fields.forEach(field => {
    console.log(`- ${field.name}`);
    field.args.forEach(arg => {
      console.log(`  * Arg: ${arg.name}`);
    });
  });
}

// Test createMood mutation
async function testCreateMood() {
  console.log('\n=== Testing Create Mood ===');
  
  // Using correct fields based on schema introspection
  const result = await executeGraphQL(`
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
      message: "Feeling good today!",
      userId: "d5c82e4a-f55c-4c6f-9415-0b15dbee6bbf" // Using a valid UUID format
    }
  });
  
  if (result.errors) {
    console.error('Failed to create mood:', result.errors);
    return null;
  }
  
  const mood = result.data?.createMood;
  
  if (mood) {
    console.log('Mood created successfully:');
    console.log(JSON.stringify(mood, null, 2));
    return mood;
  } else {
    console.error('Failed to create mood, no mood data returned');
    return null;
  }
}

// Test sendHug mutation
async function testSendHug() {
  console.log('\n=== Testing Send Hug ===');
  
  // Use hardcoded test values for demonstration
  const result = await executeGraphQL(`
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
      senderId: "d5c82e4a-f55c-4c6f-9415-0b15dbee6bbf",   // Valid UUID format for sender
      recipientId: "e7c82e4a-f55c-4c6f-9415-0b15dbee6bbf", // Valid UUID format for recipient
      message: "Sending you a virtual hug!"
    }
  });
  
  if (result.errors) {
    console.error('Failed to send hug:', result.errors);
    return null;
  }
  
  const hug = result.data?.sendHug;
  
  if (hug) {
    console.log('Hug sent successfully:');
    console.log(JSON.stringify(hug, null, 2));
    return hug;
  } else {
    console.error('Failed to send hug, no hug data returned');
    return null;
  }
}

// Run all tests
async function runTests() {
  try {
    // First, check the schema to understand what's available
    await checkSchema();
    
    // Try to create a mood
    const mood = await testCreateMood();
    
    // Try to send a hug with test data
    await testSendHug();
    
    console.log('\n=== All Tests Completed ===');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Execute the tests
runTests();