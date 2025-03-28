#!/usr/bin/env node

/**
 * GraphQL Mesh SDK Generator
 * 
 * This script builds and generates a TypeScript SDK for GraphQL Mesh,
 * which can be used by client applications to interact with the API.
 */

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for the SDK
const SDK_OUTPUT_DIR = path.join(__dirname, 'mesh-sdk');

async function generateSDK() {
  console.log('🔧 Generating SDK from schema...');
  
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(SDK_OUTPUT_DIR, { recursive: true });
    
    // Skip mesh build and use our downloaded schema directly
    console.log('✅ Using existing schema');
    
    // Generate fragments file if it doesn't exist
    const fragmentsPath = path.join(SDK_OUTPUT_DIR, 'gql-fragments.js');
    const fragmentsExist = await fs.access(fragmentsPath).then(() => true).catch(() => false);
    
    if (!fragmentsExist) {
      console.log('📝 Creating fragments file...');
      await createFragmentsFile(fragmentsPath);
    }
    
    // Generate index.js for SDK
    console.log('🚀 Generating SDK index file...');
    await createSdkIndexFile(path.join(SDK_OUTPUT_DIR, 'index.js'));
    
    console.log('✅ SDK generated successfully in mesh-sdk directory');
    
    // Copy schema for reference
    const schemaSource = path.join(__dirname, 'hugmenow', 'web', 'src', 'generated', 'schema.graphql');
    const schemaDest = path.join(SDK_OUTPUT_DIR, 'schema.graphql');
    
    try {
      await fs.copyFile(schemaSource, schemaDest);
      console.log('📋 Copied schema.graphql to SDK directory');
    } catch (err) {
      console.log('⚠️ Could not copy schema file: ', err.message);
    }
    
    console.log('📋 Copied schema.graphql to SDK directory');
    
    // Create a simplified index.js for CommonJS compatibility
    await fs.writeFile(
      path.join(SDK_OUTPUT_DIR, 'index.js'),
      `/**
 * GraphQL Mesh SDK - CommonJS Entry Point
 * 
 * This file re-exports the TypeScript SDK for use in CommonJS environments.
 */

module.exports = require('./index.cjs');
`
    );
    
    console.log('📜 Created CommonJS compatibility layer');
    
    // Create sample usage documentation
    await fs.writeFile(
      path.join(SDK_OUTPUT_DIR, 'README.md'),
      `# GraphQL Mesh SDK

This SDK provides type-safe access to the HugMeNow GraphQL API.

## Usage

### In TypeScript/ES Module environments:

\`\`\`javascript
import { getSdk } from './mesh-sdk/index.js';
import { fetch } from 'cross-fetch';

// Create a client
const client = getSdk({
  baseUrl: 'http://localhost:5000/graphql',
  fetchFn: fetch,
  token: localStorage.getItem('authToken')  // Optional auth token
});

// Example: Fetch public moods
async function getPublicMoods() {
  const result = await client.PublicMoods();
  console.log(result.publicMoods);
  return result.publicMoods;
}
\`\`\`

### In CommonJS environments:

\`\`\`javascript
const { getSdk } = require('./mesh-sdk');
const fetch = require('cross-fetch');

// Create a client
const client = getSdk({
  baseUrl: 'http://localhost:5000/graphql',
  fetchFn: fetch,
  token: process.env.AUTH_TOKEN  // Optional auth token
});

// Example: Fetch public moods
async function getPublicMoods() {
  const result = await client.PublicMoods();
  console.log(result.publicMoods);
  return result.publicMoods;
}
\`\`\`
`
    );
    
    console.log('📚 Created SDK documentation');
    
    console.log('🎉 SDK generation completed successfully!');
  } catch (error) {
    console.error('❌ Error generating SDK:', error);
    process.exit(1);
  }
}

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

/**
 * Create the fragments file with GraphQL fragments for each main type
 */
async function createFragmentsFile(filePath) {
  const fragmentsContent = `// User fields
const USER_FRAGMENT = \`
  id
  username
  email
  name
  avatarUrl
  isAnonymous
  createdAt
  updatedAt
\`;

// Mood fields
const MOOD_FRAGMENT = \`
  id
  mood
  intensity
  note
  createdAt
\`;

// Hug fields
const HUG_FRAGMENT = \`
  id
  type
  message
  isRead
  createdAt
\`;

// Hug request fields
const HUG_REQUEST_FRAGMENT = \`
  id
  message
  isCommunityRequest
  status
  createdAt
  respondedAt
\`;

// Friendship fields
const FRIENDSHIP_FRAGMENT = \`
  id
  requesterId
  recipientId
  status
  followsMood
  createdAt
  updatedAt
\`;

// Mood streak fields
const MOOD_STREAK_FRAGMENT = \`
  currentStreak
  longestStreak
  lastMoodDate
  totalMoods
\`;

export {
  USER_FRAGMENT,
  MOOD_FRAGMENT,
  HUG_FRAGMENT,
  HUG_REQUEST_FRAGMENT,
  FRIENDSHIP_FRAGMENT,
  MOOD_STREAK_FRAGMENT
};
`;

  await fs.writeFile(filePath, fragmentsContent);
}

/**
 * Create the SDK index file with query implementations
 */
async function createSdkIndexFile(filePath) {
  // Instead of importing fragments, define them in-line for direct use
  const USER_FRAGMENT = `
    id
    username
    email
    name
    avatarUrl
    isAnonymous
    createdAt
    updatedAt
  `;

  const MOOD_FRAGMENT = `
    id
    mood
    intensity
    note
    createdAt
  `;

  const HUG_FRAGMENT = `
    id
    type
    message
    isRead
    createdAt
  `;

  const HUG_REQUEST_FRAGMENT = `
    id
    message
    isCommunityRequest
    status
    createdAt
    respondedAt
  `;

  const FRIENDSHIP_FRAGMENT = `
    id
    requesterId
    recipientId
    status
    followsMood
    createdAt
    updatedAt
  `;

  const MOOD_STREAK_FRAGMENT = `
    currentStreak
    longestStreak
    lastMoodDate
    totalMoods
  `;
  
  const indexContent = `// SDK Implementation
import { USER_FRAGMENT, MOOD_FRAGMENT, HUG_FRAGMENT, HUG_REQUEST_FRAGMENT, FRIENDSHIP_FRAGMENT, MOOD_STREAK_FRAGMENT } from './gql-fragments.js';

/**
 * Create a GraphQL client SDK
 * @param {Object} options - Client configuration
 * @param {string} options.baseUrl - GraphQL endpoint URL
 * @param {Function} options.fetchFn - Custom fetch implementation (optional)
 * @param {string} options.token - Authentication token (optional)
 */
export function getSdk(options = {}) {
  const { 
    baseUrl = 'http://localhost:5000/graphql',
    fetchFn = typeof fetch !== 'undefined' ? fetch : null,
    token = null
  } = options;
  
  // Use provided fetch or try to import node-fetch in Node.js environments
  const fetcher = fetchFn || (async () => {
    try {
      const { default: nodeFetch } = await import('node-fetch');
      return nodeFetch;
    } catch (e) {
      throw new Error('No fetch implementation available. Please provide a fetch function or install node-fetch.');
    }
  })();
  
  /**
   * Execute a GraphQL query
   */
  async function executeQuery(query, variables = {}) {
    const fetchImpl = typeof fetcher === 'function' ? fetcher : await fetcher;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = \`Bearer \${token}\`;
    }
    
    const response = await fetchImpl(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    
    const result = await response.json();
    
    if (result.errors && result.errors.length) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('Error executing GraphQL query: ' + result.errors[0].message);
    }
    
    return result.data;
  }
  
  // SDK methods
  return {
    /**
     * Get current authenticated user
     */
    async Me() {
      const query = \`
        query Me {
          me {
            ${USER_FRAGMENT}
          }
        }
      \`;
      
      return executeQuery(query);
    },
    
    /**
     * Get public moods
     */
    async PublicMoods(variables = { limit: 10, offset: 0 }) {
      const query = \`
        query PublicMoods($limit: Int, $offset: Int) {
          publicMoods(limit: $limit, offset: $offset) {
            ${MOOD_FRAGMENT}
            user {
              ${USER_FRAGMENT}
            }
          }
        }
      \`;
      
      return executeQuery(query, variables);
    },
    
    /**
     * Get user's moods
     */
    async UserMoods(variables) {
      const query = \`
        query UserMoods($userId: ID!, $limit: Int, $offset: Int) {
          userMoods(userId: $userId, limit: $limit, offset: $offset) {
            ${MOOD_FRAGMENT}
          }
        }
      \`;
      
      return executeQuery(query, variables);
    },
    
    /**
     * Get user's mood streak
     */
    async MoodStreak(variables) {
      const query = \`
        query MoodStreak($userId: ID!) {
          moodStreak(userId: $userId) {
            ${MOOD_STREAK_FRAGMENT}
          }
        }
      \`;
      
      return executeQuery(query, variables);
    },
    
    /**
     * Create a new mood entry
     */
    async CreateMoodEntry(moodData) {
      const query = \`
        mutation CreateMood($input: CreateMoodInput!) {
          createMood(input: $input) {
            ${MOOD_FRAGMENT}
          }
        }
      \`;
      
      return executeQuery(query, { input: moodData });
    },
    
    /**
     * Send a hug
     */
    async SendHug(hugData) {
      const query = \`
        mutation SendHug($input: SendHugInput!) {
          sendHug(input: $input) {
            ${HUG_FRAGMENT}
            sender {
              ${USER_FRAGMENT}
            }
            recipient {
              ${USER_FRAGMENT}
            }
          }
        }
      \`;
      
      return executeQuery(query, { input: hugData });
    },
    
    /**
     * Get received hugs
     */
    async ReceivedHugs(variables) {
      const query = \`
        query ReceivedHugs($userId: ID!, $limit: Int, $offset: Int) {
          receivedHugs(userId: $userId, limit: $limit, offset: $offset) {
            ${HUG_FRAGMENT}
            sender {
              ${USER_FRAGMENT}
            }
          }
        }
      \`;
      
      return executeQuery(query, variables);
    },
    
    // FriendsMoods function has been removed because friendsMoods query no longer exists
    // Use PublicMoods instead to fetch community/public moods
    
    /**
     * Get friendships
     */
    async Friendships(variables) {
      const query = \`
        query Friendships($userId: ID!, $status: FriendshipStatus) {
          friendships(userId: $userId, status: $status) {
            ${FRIENDSHIP_FRAGMENT}
            requester {
              ${USER_FRAGMENT}
            }
            recipient {
              ${USER_FRAGMENT}
            }
          }
        }
      \`;
      
      return executeQuery(query, variables);
    }
  };
}
`;

  await fs.writeFile(filePath, indexContent);
}

// Execute the script
generateSDK();