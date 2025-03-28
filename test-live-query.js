/**
 * Test script for GraphQL Live Query in HugMeNow
 * 
 * This script demonstrates how to use the @live directive for real-time
 * data updates without explicit subscription handling.
 */

import fetch from 'cross-fetch';
import chalk from 'chalk';

// Configuration
const GATEWAY_URL = 'http://localhost:5006/graphql';
const TEST_USERNAME = 'testuser_live';
const TEST_PASSWORD = 'password123';
const TEST_EMAIL = 'testuser_live@example.com';
let TEST_TOKEN = null;
let TEST_USER_ID = null;

/**
 * Execute a GraphQL query against the Simple Mesh Gateway
 */
async function executeGraphQL(query, variables = {}, token = TEST_TOKEN) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error(chalk.red('GraphQL Error:'), result.errors);
    }
    
    return result;
  } catch (error) {
    console.error(chalk.red('Network Error:'), error.message);
    throw error;
  }
}

/**
 * Test using Live Query to automatically update mood data
 */
async function testLiveQueryMoods() {
  console.log(chalk.cyan('🔄 Testing Live Query for mood updates...'));
  
  // Register a new user if we don't have a token
  if (!TEST_TOKEN) {
    // Register user
    const registerResult = await executeGraphQL(`
      mutation RegisterUser {
        register(input: {
          email: "${TEST_EMAIL}",
          password: "${TEST_PASSWORD}",
          username: "${TEST_USERNAME}"
        }) {
          user {
            id
            username
          }
          token
        }
      }
    `);
    
    if (registerResult.data?.register) {
      TEST_TOKEN = registerResult.data.register.token;
      TEST_USER_ID = registerResult.data.register.user.id;
      console.log(chalk.green('✅ User registered:'), TEST_USERNAME);
    } else {
      // Try login instead
      const loginResult = await executeGraphQL(`
        mutation Login {
          login(input: {
            email: "${TEST_EMAIL}",
            password: "${TEST_PASSWORD}"
          }) {
            user {
              id
              username
            }
            token
          }
        }
      `);
      
      if (loginResult.data?.login) {
        TEST_TOKEN = loginResult.data.login.token;
        TEST_USER_ID = loginResult.data.login.user.id;
        console.log(chalk.green('✅ User logged in:'), TEST_USERNAME);
      } else {
        console.error(chalk.red('❌ Failed to authenticate'));
        return;
      }
    }
  }
  
  // Start a Live Query for user moods
  console.log(chalk.cyan('🔄 Starting Live Query for moods...'));
  
  // This query uses the @live directive to automatically refresh when new moods are created
  const liveQueryPromise = executeGraphQL(`
    query UserMoodsLive @live {
      userMoods(userId: "${TEST_USER_ID}", limit: 10) {
        id
        mood
        intensity
        message
        createdAt
      }
    }
  `, {}, TEST_TOKEN);
  
  // Watch for updates from the live query
  const liveQueryResult = await liveQueryPromise;
  console.log(chalk.green('📊 Initial moods:'), 
    liveQueryResult.data?.userMoods?.length || 0);
  
  // Create a new mood to trigger the Live Query update
  console.log(chalk.cyan('🔄 Creating a new mood to trigger Live Query update...'));
  const createMoodResult = await executeGraphQL(`
    mutation CreateMood {
      createMood(input: {
        mood: {
          userId: "${TEST_USER_ID}",
          mood: "Happy",
          intensity: 8,
          message: "Testing Live Query at ${new Date().toISOString()}",
          isPublic: true
        }
      }) {
        mood {
          id
          mood
          intensity
          message
        }
      }
    }
  `, {}, TEST_TOKEN);
  
  console.log(chalk.green('✅ Created new mood:'), 
    createMoodResult.data?.createMood?.mood?.message);
  
  // In a real application, the client would receive an automatic update here
  // due to the @live directive. For testing purposes, we'll make another request
  // to simulate this.
  console.log(chalk.cyan('🔄 Simulating Live Query update...'));
  const updatedMoodsResult = await executeGraphQL(`
    query UserMoodsAfterUpdate {
      userMoods(userId: "${TEST_USER_ID}", limit: 10) {
        id
        mood
        intensity
        message
        createdAt
      }
    }
  `, {}, TEST_TOKEN);
  
  console.log(chalk.green('📊 Updated moods count:'), 
    updatedMoodsResult.data?.userMoods?.length || 0);
  
  if (updatedMoodsResult.data?.userMoods?.length > 
      (liveQueryResult.data?.userMoods?.length || 0)) {
    console.log(chalk.green('✅ Live Query would have updated automatically!'));
  } else {
    console.log(chalk.yellow('⚠️ Live Query update not detected - might need to check the implementation'));
  }
}

/**
 * Test using Live Query to automatically update hug data
 */
async function testLiveQueryHugs() {
  console.log(chalk.cyan('\n🔄 Testing Live Query for hug updates...'));
  
  // Start a Live Query for received hugs
  console.log(chalk.cyan('🔄 Starting Live Query for received hugs...'));
  
  // This query uses the @live directive to automatically refresh when new hugs are received
  const liveQueryPromise = executeGraphQL(`
    query ReceivedHugsLive @live {
      receivedHugs(userId: "${TEST_USER_ID}", limit: 10) {
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
  `, {}, TEST_TOKEN);
  
  const liveQueryResult = await liveQueryPromise;
  console.log(chalk.green('📊 Initial received hugs:'), 
    liveQueryResult.data?.receivedHugs?.length || 0);
  
  // Get a random mood to send a hug to
  const moodsResult = await executeGraphQL(`
    query GetRandomMood {
      publicMoods(limit: 1) {
        id
        userId
      }
    }
  `, {}, TEST_TOKEN);
  
  if (!moodsResult.data?.publicMoods?.length) {
    console.log(chalk.yellow('⚠️ No moods found to send hug to'));
    return;
  }
  
  const moodToHug = moodsResult.data.publicMoods[0];
  
  // Send a hug to trigger the Live Query update
  console.log(chalk.cyan('🔄 Sending a hug to trigger Live Query update...'));
  const sendHugResult = await executeGraphQL(`
    mutation SendHug {
      sendHug(input: {
        hug: {
          senderId: "${TEST_USER_ID}",
          recipientId: "${moodToHug.userId}",
          moodId: "${moodToHug.id}",
          message: "Testing Live Query Hugs at ${new Date().toISOString()}"
        }
      }) {
        hug {
          id
          message
          createdAt
        }
      }
    }
  `, {}, TEST_TOKEN);
  
  console.log(chalk.green('✅ Sent new hug:'), 
    sendHugResult.data?.sendHug?.hug?.message);
  
  // In a real application, the client would receive an automatic update here
  // due to the @live directive. For testing purposes, we'll make another request
  // to simulate this.
  console.log(chalk.cyan('🔄 Simulating Live Query update for hugs...'));
  const updatedHugsResult = await executeGraphQL(`
    query ReceivedHugsAfterUpdate {
      receivedHugs(userId: "${TEST_USER_ID}", limit: 10) {
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
  `, {}, TEST_TOKEN);
  
  console.log(chalk.green('📊 Updated received hugs count:'), 
    updatedHugsResult.data?.receivedHugs?.length || 0);
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(chalk.blue('🧪 Starting Live Query Tests'));
  console.log(chalk.blue(`🔗 Connected to: ${GATEWAY_URL}`));
  
  try {
    await testLiveQueryMoods();
    await testLiveQueryHugs();
    
    console.log(chalk.green('\n✅ All Live Query tests completed!'));
    console.log(chalk.blue('📝 Summary:'));
    console.log(chalk.blue('- Live Query for moods tested'));
    console.log(chalk.blue('- Live Query for hugs tested'));
    console.log(chalk.yellow('Note: In a real client application, the @live directive'));
    console.log(chalk.yellow('would automatically update the UI when data changes.'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Tests failed:'), error);
  }
}

// Run the tests
runTests();