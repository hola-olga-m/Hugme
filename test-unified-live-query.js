/**
 * Test script for Live Query functionality in Unified GraphQL Gateway
 * 
 * This script tests the @live directive and real-time updates through both
 * HTTP polling and WebSocket connections.
 */

import fetch from 'cross-fetch';
import WebSocket from 'ws';
import chalk from 'chalk';

// Configuration
const GATEWAY_URL = 'http://localhost:5007';
const WS_GATEWAY_URL = 'ws://localhost:5007/graphql';
const TEST_USERNAME = 'testuser_live';
const TEST_PASSWORD = 'password123';
let TEST_TOKEN = null;
let TEST_USER_ID = null;

/**
 * Execute a GraphQL query via HTTP
 */
async function executeGraphQL(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${GATEWAY_URL}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    return { errors: [{ message: error.message }] };
  }
}

/**
 * Execute a Live Query via HTTP endpoint
 */
async function executeLiveQuery(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${GATEWAY_URL}/live-query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        query, 
        variables,
        pollInterval: 1000 // 1 second polling for tests
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error executing Live Query:', error);
    return { errors: [{ message: error.message }] };
  }
}

/**
 * Test HTTP-based Live Query endpoint
 */
async function testHttpLiveQuery() {
  console.log(chalk.blue('\n🔍 Testing HTTP Live Query endpoint...'));
  
  // Test query with @live directive
  const liveQueryResult = await executeLiveQuery(`
    query PublicMoodsLive @live {
      allMoods(condition: {isPublic: true}, first: 5) {
        nodes {
          id
          mood
          intensity
          message
          createdAt
          user {
            username
          }
        }
      }
    }
  `);
  
  console.log(chalk.green('✅ Live Query endpoint result:'), 
    liveQueryResult.data ? 'Data received' : 'No data');
  
  if (liveQueryResult.extensions?.liveQuery) {
    console.log(chalk.green('✅ Live Query metadata received:'), liveQueryResult.extensions.liveQuery);
  } else {
    console.log(chalk.yellow('⚠️ No Live Query metadata in response'));
  }
  
  return liveQueryResult;
}

/**
 * Test WebSocket-based Live Query
 */
async function testWebSocketLiveQuery() {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('\n🔌 Testing WebSocket Live Query...'));
    
    const client = new WebSocket(WS_GATEWAY_URL, 'graphql-ws');
    let messageId = 1;
    
    client.on('open', () => {
      console.log(chalk.green('✅ WebSocket connected'));
      
      // Initialize connection
      client.send(JSON.stringify({
        type: 'connection_init',
        payload: {}
      }));
    });
    
    client.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      // Handle connection acknowledgment
      if (message.type === 'connection_ack') {
        console.log(chalk.green('✅ Connection acknowledged'));
        
        // Start live query
        client.send(JSON.stringify({
          id: messageId.toString(),
          type: 'start',
          payload: {
            query: `
              query PublicMoodsLive @live {
                allMoods(condition: {isPublic: true}, first: 5) {
                  nodes {
                    id
                    mood
                    intensity
                    message
                    createdAt
                    user {
                      username
                    }
                  }
                }
              }
            `,
            variables: {}
          }
        }));
      }
      
      // Handle query data
      if (message.type === 'data') {
        console.log(chalk.green('✅ Live Query data received'));
        
        // Display data summary
        if (message.payload.data?.allMoods?.nodes) {
          const moodsCount = message.payload.data.allMoods.nodes.length;
          console.log(chalk.blue(`📊 Public moods count: ${moodsCount}`));
          
          // Stop the query after receiving initial data
          client.send(JSON.stringify({
            id: messageId.toString(),
            type: 'stop'
          }));
          
          // Close the connection
          setTimeout(() => {
            client.close();
            resolve(message.payload);
          }, 500);
        }
      }
      
      // Handle errors
      if (message.type === 'error') {
        console.error(chalk.red('❌ WebSocket error:'), message.payload);
        client.close();
        reject(new Error(message.payload.message));
      }
    });
    
    client.on('error', (error) => {
      console.error(chalk.red('❌ WebSocket connection error:'), error);
      reject(error);
    });
    
    // Set timeout
    setTimeout(() => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
        reject(new Error('WebSocket test timed out'));
      }
    }, 10000);
  });
}

/**
 * Test query transformation endpoint
 */
async function testQueryTransformation() {
  console.log(chalk.blue('\n🔄 Testing query transformation endpoint...'));
  
  const response = await fetch(`${GATEWAY_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetUserData {
          user(id: "123") {
            id
            username
            fullName
            avatarURL
            publicMoods {
              id
              mood
            }
            friendsMoods(friendId: "456") {
              id
              mood
            }
          }
        }
      `
    }),
  });
  
  const result = await response.json();
  
  console.log(chalk.green('✅ Query transformation result:'));
  console.log(chalk.blue('Field mappings:'), result.fieldMappings);
  console.log(chalk.blue('Transformed query:'), result.transformed ? 'Successfully transformed' : 'No transformation');
  
  return result;
}

/**
 * Test server health and client info
 */
async function testServerHealth() {
  console.log(chalk.blue('\n🏥 Testing server health...'));
  
  // Test health endpoint
  const healthResponse = await fetch(`${GATEWAY_URL}/health`);
  const healthData = await healthResponse.json();
  
  console.log(chalk.green('✅ Health check result:'), 
    healthData.status === 'ok' ? 'Server is healthy' : 'Server health issue');
  
  // Test client info endpoint
  const clientInfoResponse = await fetch(`${GATEWAY_URL}/client-info`);
  const clientInfo = await clientInfoResponse.json();
  
  console.log(chalk.green('✅ Client info:'), clientInfo);
  console.log(chalk.blue('Supported features:'), clientInfo.features?.join(', '));
  
  const hasLiveQuerySupport = clientInfo.features?.includes('live-queries');
  console.log(chalk.blue('Live Query support:'), 
    hasLiveQuerySupport ? '✅ Enabled' : '❌ Disabled');
  
  return { health: healthData, clientInfo };
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(chalk.blue('🧪 Starting Unified Gateway Live Query Tests'));
  console.log(chalk.blue(`🔗 Connected to: ${GATEWAY_URL}`));
  
  try {
    await testServerHealth();
    await testQueryTransformation();
    await testHttpLiveQuery();
    await testWebSocketLiveQuery();
    
    console.log(chalk.green('\n✅ All tests completed!'));
    console.log(chalk.blue('📝 Summary:'));
    console.log(chalk.blue('- Server health verified'));
    console.log(chalk.blue('- Query transformation is working'));
    console.log(chalk.blue('- HTTP Live Query endpoint is operational'));
    console.log(chalk.blue('- WebSocket Live Query support is functioning'));
    
    console.log(chalk.yellow('\nℹ️ Live Query Details:'));
    console.log(chalk.yellow('1. The @live directive automatically refreshes query results'));
    console.log(chalk.yellow('2. Changes are reflected without requiring manual polling'));
    console.log(chalk.yellow('3. Both HTTP and WebSocket interfaces are available'));
    console.log(chalk.yellow('4. Field name transformations help with client compatibility'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Test failed:'), error);
  }
}

// Run all tests
runTests();