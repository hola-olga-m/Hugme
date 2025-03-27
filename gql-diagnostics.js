import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = 'http://localhost:3002/graphql';

// Function to make GraphQL requests
async function executeGraphQL(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('GraphQL request error:', error);
    return { errors: [{ message: error.message }] };
  }
}

// Test schema introspection
async function testSchemaIntrospection() {
  console.log('\n========== TESTING SCHEMA INTROSPECTION ==========');
  const query = `
    query {
      __schema {
        queryType {
          name
        }
        types {
          name
          kind
        }
      }
    }
  `;
  
  const result = await executeGraphQL(query);
  
  if (result.errors) {
    console.log('❌ Schema introspection failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Schema introspection successful');
    const types = result.data.__schema.types.filter(t => !t.name.startsWith('__'));
    console.log(`Found ${types.length} types in schema`);
    console.log('Top-level types:');
    types.filter(t => ['OBJECT', 'INTERFACE'].includes(t.kind) && !t.name.includes('Connection') && !t.name.includes('Edge')).slice(0, 10).forEach(t => {
      console.log(`- ${t.name} (${t.kind})`);
    });
    return result.data.__schema;
  }
}

// Register a test user
async function registerTestUser() {
  console.log('\n========== REGISTERING TEST USER ==========');
  const username = `testuser_${Date.now().toString().slice(-6)}`;
  const email = `${username}@example.com`;
  const password = 'Password123';
  const name = 'Test User';
  
  const query = `
    mutation Register($input: RegisterInput!) {
      register(registerInput: $input) {
        accessToken
        user {
          id
          username
          name
          email
        }
      }
    }
  `;
  
  const variables = {
    input: {
      username,
      email,
      password,
      name
    }
  };
  
  const result = await executeGraphQL(query, variables);
  
  if (result.errors) {
    console.log('❌ Registration failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Registration successful');
    console.log(`Created user: ${result.data.register.user.username} (${result.data.register.user.id})`);
    return {
      user: result.data.register.user,
      token: result.data.register.accessToken
    };
  }
}

// Login as an existing user
async function loginUser(email, password) {
  console.log('\n========== LOGGING IN USER ==========');
  
  const query = `
    mutation Login($input: LoginInput!) {
      login(loginInput: $input) {
        accessToken
        user {
          id
          username
          name
          email
        }
      }
    }
  `;
  
  const variables = {
    input: {
      email,
      password
    }
  };
  
  const result = await executeGraphQL(query, variables);
  
  if (result.errors) {
    console.log('❌ Login failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Login successful');
    console.log(`Logged in as: ${result.data.login.user.username} (${result.data.login.user.id})`);
    return {
      user: result.data.login.user,
      token: result.data.login.accessToken
    };
  }
}

// Test fetching users (authenticated)
async function testGetUsers(token) {
  console.log('\n========== TESTING GET USERS (AUTHENTICATED) ==========');
  
  const query = `
    query {
      users {
        id
        username
        name
      }
    }
  `;
  
  const result = await executeGraphQL(query, {}, token);
  
  if (result.errors) {
    console.log('❌ Fetching users failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Fetching users successful');
    console.log(`Found ${result.data.users.length} users`);
    return result.data.users;
  }
}

// Test creating a mood entry
async function testCreateMood(token) {
  console.log('\n========== TESTING CREATE MOOD ==========');
  
  const query = `
    mutation CreateMood($input: CreateMoodInput!) {
      createMood(createMoodInput: $input) {
        id
        score
        note
        createdAt
        isPublic
      }
    }
  `;
  
  const variables = {
    input: {
      score: 8,
      note: "Feeling good for testing!",
      isPublic: true
    }
  };
  
  const result = await executeGraphQL(query, variables, token);
  
  if (result.errors) {
    console.log('❌ Creating mood failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Creating mood successful');
    console.log(`Created mood with ID: ${result.data.createMood.id}`);
    return result.data.createMood;
  }
}

// Test getting moods for current user
async function testGetUserMoods(token, userId) {
  console.log('\n========== TESTING GET USER MOODS ==========');
  
  const query = `
    query GetUserMoods($userId: ID!) {
      moodsByUserId(userId: $userId) {
        id
        score
        note
        createdAt
        isPublic
      }
    }
  `;
  
  const variables = {
    userId
  };
  
  const result = await executeGraphQL(query, variables, token);
  
  if (result.errors) {
    console.log('❌ Fetching user moods failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    
    // Try alternative field name
    console.log('Trying alternative query field name...');
    
    const altQuery = `
      query GetUserMoods($userId: ID!) {
        moods(userId: $userId) {
          id
          score
          note
          createdAt
          isPublic
        }
      }
    `;
    
    const altResult = await executeGraphQL(altQuery, variables, token);
    
    if (altResult.errors) {
      console.log('❌ Alternative query also failed:');
      console.log(JSON.stringify(altResult.errors, null, 2));
      return null;
    } else {
      console.log('✅ Alternative query successful');
      console.log(`Found ${altResult.data.moods.length} mood entries`);
      return altResult.data.moods;
    }
  } else {
    console.log('✅ Fetching user moods successful');
    console.log(`Found ${result.data.moodsByUserId.length} mood entries`);
    return result.data.moodsByUserId;
  }
}

// Test getting mood streak
async function testGetMoodStreak(token, userId) {
  console.log('\n========== TESTING GET MOOD STREAK ==========');
  
  const query = `
    query GetMoodStreak($userId: ID!) {
      moodStreak(userId: $userId) {
        currentStreak
        longestStreak
        lastMoodDate
      }
    }
  `;
  
  const variables = {
    userId
  };
  
  const result = await executeGraphQL(query, variables, token);
  
  if (result.errors) {
    console.log('❌ Fetching mood streak failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Fetching mood streak successful');
    console.log(`Current streak: ${result.data.moodStreak.currentStreak}`);
    console.log(`Longest streak: ${result.data.moodStreak.longestStreak}`);
    return result.data.moodStreak;
  }
}

// Test sending a hug
async function testSendHug(token, fromUserId) {
  console.log('\n========== TESTING SEND HUG ==========');
  
  // First, get a list of users to find someone to hug
  const users = await testGetUsers(token);
  
  if (!users || users.length < 2) {
    console.log('❌ Cannot test hugs: Not enough users available');
    return null;
  }
  
  // Find a user that's not the current user
  const toUser = users.find(user => user.id !== fromUserId);
  
  if (!toUser) {
    console.log('❌ Cannot test hugs: No other users available');
    return null;
  }
  
  const query = `
    mutation SendHug($input: SendHugInput!) {
      sendHug(sendHugInput: $input) {
        id
        message
        createdAt
        from {
          id
          username
        }
        to {
          id
          username
        }
      }
    }
  `;
  
  const variables = {
    input: {
      toUserId: toUser.id,
      message: "Sending you a test hug!"
    }
  };
  
  const result = await executeGraphQL(query, variables, token);
  
  if (result.errors) {
    console.log('❌ Sending hug failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Sending hug successful');
    console.log(`Sent hug to: ${toUser.username} (${toUser.id})`);
    return result.data.sendHug;
  }
}

// Test getting public moods
async function testGetPublicMoods(token) {
  console.log('\n========== TESTING GET PUBLIC MOODS ==========');
  
  const query = `
    query {
      publicMoods {
        id
        score
        note
        createdAt
        user {
          id
          username
        }
      }
    }
  `;
  
  const result = await executeGraphQL(query, {}, token);
  
  if (result.errors) {
    console.log('❌ Fetching public moods failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Fetching public moods successful');
    console.log(`Found ${result.data.publicMoods.length} public mood entries`);
    return result.data.publicMoods;
  }
}

// Run all the tests
async function runDiagnostics() {
  try {
    console.log('=================================================');
    console.log('STARTING GRAPHQL API DIAGNOSTICS');
    console.log('=================================================');
    
    // Test schema
    const schema = await testSchemaIntrospection();
    
    // Register a test user
    let auth = await registerTestUser();
    
    // If registration fails, try to login with existing test user
    if (!auth) {
      auth = await loginUser('testuser@example.com', 'Password123');
    }
    
    if (auth && auth.token) {
      // Test authenticated queries
      await testGetUsers(auth.token);
      const mood = await testCreateMood(auth.token);
      
      // Test mood-related queries with the user's ID
      await testGetUserMoods(auth.token, auth.user.id);
      await testGetMoodStreak(auth.token, auth.user.id);
      await testGetPublicMoods(auth.token);
      
      // Test HugRequest and Hugs
      await testSendHug(auth.token, auth.user.id);
    }
    
    console.log('\n=================================================');
    console.log('DIAGNOSTICS COMPLETE');
    console.log('=================================================');
  } catch (error) {
    console.error('Error running diagnostics:', error);
  }
}

// Execute the diagnostics
runDiagnostics();