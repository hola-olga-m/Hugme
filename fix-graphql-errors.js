
// Comprehensive GraphQL Error Fixing Script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Starting comprehensive GraphQL error fixing...');

// Step 1: Extract errors from localStorage dumps or error.log
function collectErrors() {
  console.log('📋 Collecting GraphQL errors...');
  
  let errorMessages = [];
  
  // Try to read from error.log if it exists
  try {
    if (fs.existsSync('./hugmenow/web/src/graphql/error.log')) {
      const logContents = fs.readFileSync('./hugmenow/web/src/graphql/error.log', 'utf8');
      errorMessages = logContents.split('\n').filter(line => line.trim().length > 0);
      console.log(`✅ Found ${errorMessages.length} errors in error.log`);
    }
  } catch (error) {
    console.log('⚠️ Could not read error.log:', error.message);
  }
  
  // If no errors found yet, add common schema errors
  if (errorMessages.length === 0) {
    console.log('⚠️ No errors found in logs, using default error patterns');
    errorMessages = [
      '[GraphQL error]: Message: Unknown argument "limit" on field "Query.publicMoods".',
      '[GraphQL error]: Message: Unknown argument "offset" on field "Query.publicMoods".',
      '[GraphQL error]: Message: Unknown argument "limit" on field "Query.receivedHugs".',
      '[GraphQL error]: Message: Unknown argument "offset" on field "Query.receivedHugs".',
      '[GraphQL error]: Message: Unknown argument "search" on field "Query.users".',
      '[GraphQL error]: Message: Unknown argument "limit" on field "Query.users".',
      '[GraphQL error]: Message: Unknown argument "offset" on field "Query.users".',
      '[GraphQL error]: Message: Unknown argument "limit" on field "Query.friendsMoods".',
      '[GraphQL error]: Message: Unknown argument "offset" on field "Query.friendsMoods".',
      '[GraphQL error]: Message: Variable "$limit" of type "Int" used in position expecting type "Float".'
    ];
  }
  
  return errorMessages.join('\n');
}

// Step 2: Run fix-schema-mismatches with collected errors
function fixSchemaMismatches(errorString) {
  console.log('🔧 Fixing schema mismatches...');
  
  try {
    // Fix schema using the collected errors
    require('./fix-schema-mismatches').fixSchemaMismatches(errorString);
  } catch (error) {
    console.error('❌ Error fixing schema mismatches:', error);
    console.log('⚠️ Attempting direct schema fix...');
    
    // If the function import fails, ensure schema-updates.graphql exists with proper content
    const schemaUpdates = `# Schema extensions to fix the GraphQL errors

type Query {
  # Add pagination to publicMoods query
  publicMoods(limit: Int, offset: Int): [Mood!]!

  # Add pagination to receivedHugs query
  receivedHugs(limit: Int, offset: Int): [Hug!]!

  # Add search and pagination to users query
  users(search: String, limit: Int, offset: Int): [User!]!

  # Add pagination to friendsMoods query
  friendsMoods(limit: Int, offset: Int): [Mood!]!
  
  # Add friendship check
  checkFriendship(userId: ID!): Boolean!
  
  # Add community hug requests
  communityHugRequests: [HugRequest!]!
  
  # Add single hug query
  hug(id: ID!): Hug!
  
  # Add hug request query
  hugRequest(id: ID!): HugRequest!
  
  # Add user profile query
  me: User!
  
  # Add single mood query
  mood(id: ID!): Mood!
  
  # Add mood following query
  moodFollowing: [Friendship!]!
  
  # Add mood streak query
  moodStreak: Int!
  
  # Add friends list query
  myFriends: [Friendship!]!
  
  # Add personal hug requests query
  myHugRequests: [HugRequest!]!
  
  # Add pending friend requests query
  pendingFriendRequests: [Friendship!]!
  
  # Add pending hug requests query
  pendingHugRequests: [HugRequest!]!
  
  # Add sent friend requests query
  sentFriendRequests: [Friendship!]!
  
  # Add sent hugs query with pagination
  sentHugs(limit: Int, offset: Int): [Hug!]!
  
  # Add user query by ID
  user(id: ID!): User!
  
  # Add user moods query
  userMoods: [Mood!]!
}

# Fix type mismatch for limit parameter
input MoodsPaginationInput {
  limit: Int
  offset: Int
}

input UsersPaginationInput {
  limit: Int
  offset: Int
}

input HugsPaginationInput {
  limit: Int
  offset: Int
}

# Add Friendship type if missing
type Friendship {
  id: ID!
  status: String!
  requesterId: ID!
  requester: User
  addresseeId: ID!
  addressee: User
  createdAt: DateTime
  updatedAt: DateTime
}

# Add HugRequest type if missing
type HugRequest {
  id: ID!
  senderId: ID!
  sender: User
  message: String
  status: String!
  isPublic: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}

# Define DateTime scalar if missing
scalar DateTime
`;
    
    fs.writeFileSync('./schema-updates.graphql', schemaUpdates);
    console.log('✅ Created schema-updates.graphql directly');
  }
}

// Step 3: Sync schema to both API and web
function syncSchema() {
  console.log('🔄 Syncing schema...');
  
  try {
    require('./sync-schema').syncSchema();
  } catch (error) {
    console.error('❌ Error syncing schema:', error);
    console.log('⚠️ Attempting direct schema synchronization...');
    
    // If the function import fails, manually copy schema-updates.graphql to destinations
    try {
      const schemaUpdates = fs.readFileSync('./schema-updates.graphql', 'utf8');
      
      const apiSchemaPath = './hugmenow/api/src/graphql/schema.graphql';
      const clientSchemaPath = './hugmenow/web/src/graphql/schema.graphql';
      
      // Ensure directories exist
      if (!fs.existsSync(path.dirname(apiSchemaPath))) {
        fs.mkdirSync(path.dirname(apiSchemaPath), { recursive: true });
      }
      
      if (!fs.existsSync(path.dirname(clientSchemaPath))) {
        fs.mkdirSync(path.dirname(clientSchemaPath), { recursive: true });
      }
      
      // Write to API schema
      if (fs.existsSync(apiSchemaPath)) {
        const apiSchema = fs.readFileSync(apiSchemaPath, 'utf8');
        fs.writeFileSync(apiSchemaPath, apiSchema + '\n\n' + schemaUpdates);
        console.log('✅ Updated API schema');
      } else {
        fs.writeFileSync(apiSchemaPath, schemaUpdates);
        console.log('✅ Created API schema');
      }
      
      // Write to client schema
      if (fs.existsSync(clientSchemaPath)) {
        const clientSchema = fs.readFileSync(clientSchemaPath, 'utf8');
        fs.writeFileSync(clientSchemaPath, clientSchema + '\n\n' + schemaUpdates);
        console.log('✅ Updated client schema');
      } else {
        fs.writeFileSync(clientSchemaPath, schemaUpdates);
        console.log('✅ Created client schema');
      }
    } catch (innerError) {
      console.error('❌ Error during direct schema synchronization:', innerError);
    }
  }
}

// Step 4: Clear caches
function clearCaches() {
  console.log('🧹 Clearing caches...');
  
  try {
    require('./cache-clear');
  } catch (error) {
    console.error('❌ Error clearing caches:', error);
    console.log('⚠️ Attempting direct cache clearing...');
    
    const cachePaths = [
      './hugmenow/web/.cache',
      './hugmenow/web/dist/.cache',
      './hugmenow/api/dist',
      './node_modules/.cache'
    ];
    
    cachePaths.forEach(cachePath => {
      if (fs.existsSync(cachePath)) {
        try {
          execSync(`rm -rf ${cachePath}`);
          console.log(`✅ Cleared ${cachePath}`);
        } catch (error) {
          console.error(`❌ Failed to clear ${cachePath}:`, error.message);
        }
      }
    });
  }
}

// Step 5: Restart the application
function restartApp() {
  console.log('🔄 Restarting application...');
  
  try {
    require('./restart-app');
  } catch (error) {
    console.error('❌ Error restarting application:', error);
    console.log('⚠️ Attempting direct application restart...');
    
    try {
      // Kill existing processes
      try {
        execSync('pkill -f "node index.js"');
        console.log('✅ Stopped running processes');
      } catch (killError) {
        console.log('No running processes to kill');
      }
      
      // Restart application
      execSync('node index.js &', { stdio: 'inherit' });
      console.log('✅ Application restart initiated');
    } catch (restartError) {
      console.error('❌ Failed to restart application:', restartError.message);
    }
  }
}

// Run the process
const errorString = collectErrors();
fixSchemaMismatches(errorString);
syncSchema();
clearCaches();
restartApp();

console.log('✅ GraphQL error fixing process completed');
