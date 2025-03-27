import fetch from 'node-fetch';

// Connect via the proxy server which forwards to the backend
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

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
  
  // Based on our schema analysis, we should use 'userMoods' query
  const query = `
    query {
      userMoods {
        id
        score
        note
        createdAt
        isPublic
        userId
      }
    }
  `;
  
  const result = await executeGraphQL(query, {}, token);
  
  if (result.errors) {
    console.log('❌ Fetching user moods failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Fetching user moods successful');
    console.log(`Found ${result.data.userMoods.length} mood entries`);
    return result.data.userMoods;
  }
}

// Test getting mood streak
async function testGetMoodStreak(token, userId) {
  console.log('\n========== TESTING GET MOOD STREAK ==========');
  
  // Based on our schema analysis, moodStreak returns a Float value
  const query = `
    query {
      moodStreak
    }
  `;
  
  const result = await executeGraphQL(query, {}, token);
  
  if (result.errors) {
    console.log('❌ Fetching mood streak failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    return null;
  } else {
    console.log('✅ Fetching mood streak successful');
    console.log(`Mood streak: ${result.data.moodStreak}`);
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
  
  // We need to create a friendship first because the API requires users to be friends
  console.log('Creating friendship with target user...');
  
  const sendFriendRequestQuery = `
    mutation SendFriendRequest($input: CreateFriendshipInput!) {
      sendFriendRequest(createFriendshipInput: $input) {
        id
        status
        requesterId
        recipientId
        requester {
          id
          username
        }
        recipient {
          id
          username
        }
      }
    }
  `;
  
  const friendshipVariables = {
    input: {
      recipientId: toUser.id,
      followMood: true
    }
  };
  
  const friendshipResult = await executeGraphQL(sendFriendRequestQuery, friendshipVariables, token);
  
  if (friendshipResult.errors) {
    console.log('❌ Creating friendship failed:');
    console.log(JSON.stringify(friendshipResult.errors, null, 2));
    console.log('Attempting to send hug without friendship...');
  } else {
    console.log('✅ Friendship request created successfully');
    
    // Automatically accept the friendship request to create a valid friendship
    const acceptFriendshipQuery = `
      mutation RespondToFriendRequest($input: UpdateFriendshipInput!) {
        respondToFriendRequest(updateFriendshipInput: $input) {
          id
          status
        }
      }
    `;
    
    const acceptVariables = {
      input: {
        friendshipId: friendshipResult.data.sendFriendRequest.id,
        status: "ACCEPTED"
      }
    };
    
    const acceptResult = await executeGraphQL(acceptFriendshipQuery, acceptVariables, token);
    
    if (acceptResult.errors) {
      console.log('❌ Accepting friendship failed:');
      console.log(JSON.stringify(acceptResult.errors, null, 2));
    } else {
      console.log('✅ Friendship accepted successfully');
    }
  }
  
  // Now try sending a hug
  console.log('Attempting to send hug...');
  
  // Based on our schema analysis, SendHugInput requires: 
  // - type: HugType! (enum)
  // - recipientId: String (optional)
  // - message: String (optional)
  // - externalRecipient: ExternalRecipientInput (optional)
  const query = `
    mutation SendHug($input: SendHugInput!) {
      sendHug(sendHugInput: $input) {
        id
        message
        createdAt
        isRead
        sender {
          id
          username
        }
        recipient {
          id
          username
        }
        type
      }
    }
  `;
  
  const variables = {
    input: {
      recipientId: toUser.id,
      message: "Sending you a test hug!",
      type: "StandardHug" // Using StandardHug as discovered in schema introspection
    }
  };
  
  const result = await executeGraphQL(query, variables, token);
  
  if (result.errors) {
    console.log('❌ Sending hug failed:');
    console.log(JSON.stringify(result.errors, null, 2));
    
    // Try with different HugType values we found in our schema introspection
    const hugTypes = [
      "FriendlyHug", "ComfortingHug", "EnthusiasticHug", "FamilyHug", 
      "GroupHug", "GentleHug", "SupportiveHug", "SmilingHug", "VirtualHug", 
      "WelcomeHug", "RelaxingHug", "CELEBRATORY", "COMFORTING", "ENCOURAGING", 
      "QUICK", "SUPPORTIVE", "WARM"
    ];
    
    for (const type of hugTypes) {
      console.log(`Trying with type: ${type}`);
      variables.input.type = type;
      const retryResult = await executeGraphQL(query, variables, token);
      
      if (!retryResult.errors) {
        console.log(`✅ Sending hug successful with type: ${type}`);
        console.log(`Sent hug to: ${toUser.username} (${toUser.id})`);
        return retryResult.data.sendHug;
      }
    }
    
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