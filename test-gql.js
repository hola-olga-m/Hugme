import fetch from 'node-fetch';

async function testGraphQL() {
  try {
    // Try a simple query to verify GraphQL works
    const response = await fetch('http://localhost:3002/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            __schema {
              queryType {
                name
              }
            }
          }
        `
      })
    });

    const data = await response.json();
    console.log('GraphQL Schema Test:');
    console.log(JSON.stringify(data, null, 2));
    
    // Try login mutation
    const loginResponse = await fetch('http://localhost:3002/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            login(loginInput: {
              email: "testuser@example.com", 
              password: "Password123"
            }) {
              accessToken
              user {
                id
                username
                name
                email
              }
            }
          }
        `
      })
    });

    const loginData = await loginResponse.json();
    console.log('\nLogin Test:');
    console.log(JSON.stringify(loginData, null, 2));
    
    // If login worked, get the token and make an authenticated request
    if (loginData.data && loginData.data.login && loginData.data.login.accessToken) {
      const token = loginData.data.login.accessToken;
      
      // Try to get users list with authentication
      const authUsersResponse = await fetch('http://localhost:3002/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query {
              users {
                id
                username
                name
              }
            }
          `
        })
      });

      const authUsersData = await authUsersResponse.json();
      console.log('\nAuthenticated Users Query Test:');
      console.log(JSON.stringify(authUsersData, null, 2));
      
      // Try to create a mood entry
      const createMoodResponse = await fetch('http://localhost:3002/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation {
              createMood(createMoodInput: {
                score: 8,
                note: "Feeling pretty good today!",
                isPublic: true
              }) {
                id
                score
                note
                createdAt
                isPublic
                user {
                  id
                  username
                }
              }
            }
          `
        })
      });

      const createMoodData = await createMoodResponse.json();
      console.log('\nCreate Mood Test:');
      console.log(JSON.stringify(createMoodData, null, 2));
    }
    
  } catch (error) {
    console.error('Error testing GraphQL:', error);
  }
}

testGraphQL();