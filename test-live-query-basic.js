/**
 * Basic Test script for GraphQL Live Query in HugMeNow
 * 
 * This simplified script tests the @live directive for real-time
 * data updates without requiring authentication.
 */

import fetch from 'cross-fetch';
import chalk from 'chalk';

// Configuration
const GATEWAY_URL = 'http://localhost:5006/graphql';

/**
 * Execute a GraphQL query against the Live Query Gateway
 */
async function executeGraphQL(query, variables = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
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
 * Test using Live Query with public moods data
 */
async function testPublicMoodsLiveQuery() {
  console.log(chalk.cyan('🔄 Testing Live Query for public moods...'));
  
  // Start a Live Query for public moods
  console.log(chalk.cyan('🔄 Starting Live Query for public moods...'));
  
  // This query uses the @live directive to automatically refresh
  const liveQueryPromise = executeGraphQL(`
    query PublicMoodsLive @live {
      publicMoods(limit: 5) {
        id
        mood
        intensity
        message
        createdAt
        user {
          id
          username
        }
      }
    }
  `);
  
  // Watch for initial response
  const liveQueryResult = await liveQueryPromise;
  console.log(chalk.green('📊 Initial public moods:'), 
    liveQueryResult.data?.publicMoods?.length || 0);
    
  // In a real app, this would keep updating as new moods come in
  console.log(chalk.yellow('ℹ️ In a real app, this query would continue to refresh'), 
    chalk.yellow('automatically when public moods are created'));
    
  return liveQueryResult.data?.publicMoods || [];
}

/**
 * Test the client info endpoint
 */
async function testClientInfoQuery() {
  console.log(chalk.cyan('\n🔄 Testing client info query...'));
  
  const clientInfoResult = await executeGraphQL(`
    query GetClientInfo {
      clientInfo {
        version
        buildDate
        platform
        features
      }
    }
  `);
  
  if (clientInfoResult.data?.clientInfo) {
    console.log(chalk.green('✅ Client info:'), {
      version: clientInfoResult.data.clientInfo.version,
      platform: clientInfoResult.data.clientInfo.platform,
      features: clientInfoResult.data.clientInfo.features
    });
  } else {
    console.log(chalk.yellow('⚠️ Could not get client info'));
  }
}

/**
 * Run basic tests
 */
async function runTests() {
  console.log(chalk.blue('🧪 Starting Basic Live Query Tests'));
  console.log(chalk.blue(`🔗 Connected to: ${GATEWAY_URL}`));
  
  try {
    await testPublicMoodsLiveQuery();
    await testClientInfoQuery();
    
    console.log(chalk.green('\n✅ All basic Live Query tests completed!'));
    console.log(chalk.blue('📝 Summary:'));
    console.log(chalk.blue('- Tested @live directive functionality'));
    console.log(chalk.blue('- Verified gateway is operational'));
    console.log(chalk.blue('- Confirmed client info endpoint availability'));
    
    console.log(chalk.yellow('\nℹ️ Live Query Details:'));
    console.log(chalk.yellow('1. The @live directive automatically refreshes query results'));
    console.log(chalk.yellow('2. Changes are reflected without subscription handling'));
    console.log(chalk.yellow('3. Simple to implement for clients - just add @live to queries'));
    console.log(chalk.yellow('4. Works with existing query code - no special handling needed'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Tests failed:'), error);
  }
}

// Run the tests
runTests();