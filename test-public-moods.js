#!/usr/bin/env node

/**
 * Test script for FriendMoodsWidget GraphQL queries
 */

import fetch from 'node-fetch';
import chalk from 'chalk';

const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

// Define the query to test
const PUBLIC_MOODS_QUERY = `
  query GetPublicMoods {
    publicMoods(limit: 10) {
      id
      mood
      intensity
      note
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

// Define the mutation to test
const SEND_HUG_MUTATION = `
  mutation SendHug($hugInput: SendHugInput!) {
    sendHug(hugInput: $hugInput) {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        username
        name
      }
      recipient {
        id
        username
        name
      }
    }
  }
`;

/**
 * Execute a GraphQL query
 */
async function executeGraphQL(query, variables = {}, token = null) {
  try {
    console.log(chalk.blue('Executing GraphQL query...'));
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    
    const data = await response.json();
    
    if (data.errors) {
      console.error(chalk.red('GraphQL errors:'), data.errors);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error(chalk.red('Error executing GraphQL query:'), error.message);
    return null;
  }
}

/**
 * Login to get an authentication token
 */
async function login() {
  console.log(chalk.blue('Logging in...'));
  
  const loginMutation = `
    mutation Login($loginInput: LoginInput!) {
      login(loginInput: $loginInput) {
        accessToken
        user {
          id
          username
          name
        }
      }
    }
  `;
  
  const variables = {
    loginInput: {
      email: 'test@example.com',
      password: 'password123',
    },
  };
  
  const result = await executeGraphQL(loginMutation, variables);
  
  if (result?.login?.accessToken) {
    console.log(chalk.green('Login successful!'));
    return result.login.accessToken;
  } else {
    console.log(chalk.yellow('Login failed, attempting anonymous login...'));
    
    // Try anonymous login as fallback
    const anonymousLoginMutation = `
      mutation AnonymousLogin($anonymousLoginInput: AnonymousLoginInput!) {
        anonymousLogin(anonymousLoginInput: $anonymousLoginInput) {
          accessToken
          user {
            id
            username
            isAnonymous
          }
        }
      }
    `;
    
    const anonymousVariables = {
      anonymousLoginInput: {
        deviceId: `test-device-${Date.now()}`,
      },
    };
    
    const anonymousResult = await executeGraphQL(anonymousLoginMutation, anonymousVariables);
    
    if (anonymousResult?.anonymousLogin?.accessToken) {
      console.log(chalk.green('Anonymous login successful!'));
      return anonymousResult.anonymousLogin.accessToken;
    }
  }
  
  console.log(chalk.red('All login attempts failed. Continuing without authentication.'));
  return null;
}

/**
 * Test the PublicMoods query
 */
async function testPublicMoods(token) {
  console.log(chalk.blue('\nTesting PublicMoods query...'));
  
  const result = await executeGraphQL(PUBLIC_MOODS_QUERY, {}, token);
  
  if (result && result.publicMoods) {
    console.log(chalk.green('PublicMoods query successful!'));
    console.log(chalk.green(`Found ${result.publicMoods.length} public moods`));
    
    console.log(chalk.blue('\nMood data:'));
    result.publicMoods.slice(0, 3).forEach((mood, index) => {
      console.log(chalk.cyan(`\nMood ${index + 1}:`));
      console.log(`  User: ${mood.user.name || mood.user.username}`);
      console.log(`  Mood: ${mood.mood} (${mood.intensity}/10)`);
      console.log(`  Note: ${mood.note || 'No note'}`);
      console.log(`  Posted: ${mood.createdAt}`);
    });
    
    if (result.publicMoods.length > 3) {
      console.log(chalk.gray(`\n... and ${result.publicMoods.length - 3} more moods`));
    }
    
    return result.publicMoods;
  } else {
    console.log(chalk.red('PublicMoods query failed!'));
    return null;
  }
}

/**
 * Test sending a hug
 */
async function testSendHug(token, publicMoods) {
  if (!publicMoods || publicMoods.length === 0 || !token) {
    console.log(chalk.yellow('Cannot test sending hug: missing token or no public moods'));
    return;
  }
  
  console.log(chalk.blue('\nTesting SendHug mutation...'));
  
  // Pick a random recipient from the public moods
  const randomMood = publicMoods[Math.floor(Math.random() * publicMoods.length)];
  const recipientId = randomMood.user.id;
  
  const variables = {
    hugInput: {
      recipientId,
      type: randomMood.intensity <= 4 ? 'ComfortingHug' : 'StandardHug',
      message: randomMood.intensity <= 4 
        ? `I noticed you're not feeling great. Sending you a comforting hug!` 
        : `Hey! Just sending a friendly hug your way!`,
    }
  };
  
  const result = await executeGraphQL(SEND_HUG_MUTATION, variables, token);
  
  if (result && result.sendHug) {
    console.log(chalk.green('SendHug mutation successful!'));
    console.log(chalk.blue('\nHug details:'));
    console.log(`  ID: ${result.sendHug.id}`);
    console.log(`  Type: ${result.sendHug.type}`);
    console.log(`  Message: ${result.sendHug.message}`);
    console.log(`  From: ${result.sendHug.sender.name || result.sendHug.sender.username}`);
    console.log(`  To: ${result.sendHug.recipient.name || result.sendHug.recipient.username}`);
  } else {
    console.log(chalk.red('SendHug mutation failed!'));
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(chalk.green.bold('=== PublicMoodsWidget Component Tests ===\n'));
  
  try {
    const token = await login();
    const publicMoods = await testPublicMoods(token);
    await testSendHug(token, publicMoods);
    
    console.log(chalk.green.bold('\n=== All tests completed ==='));
  } catch (error) {
    console.error(chalk.red.bold('\nTest suite failed:'), error);
  }
}

// Run the tests
runTests();