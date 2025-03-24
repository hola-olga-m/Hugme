const fetch = require('node-fetch');
const WebSocket = require('ws');

// Test the various services by making requests to them
async function testServices() {
  console.log('Testing HugMood Microservices Architecture');
  
  try {
    // Test API Gateway health endpoint
    console.log('\n--- Testing API Gateway ---');
    const apiGatewayResponse = await fetch('http://localhost:5000/health');
    const apiGatewayData = await apiGatewayResponse.json();
    console.log('API Gateway Health:', apiGatewayData);
    
    // Test GraphQL Gateway
    console.log('\n--- Testing GraphQL Gateway ---');
    try {
      const graphqlGatewayResponse = await fetch('http://localhost:4000/health');
      const graphqlGatewayData = await graphqlGatewayResponse.json();
      console.log('GraphQL Gateway Health:', graphqlGatewayData);
    } catch (error) {
      console.log('GraphQL Gateway not yet running');
    }
    
    // Test Auth Service
    console.log('\n--- Testing Auth Service ---');
    try {
      const authServiceQuery = {
        query: `
          query {
            me {
              id
              username
              email
            }
          }
        `
      };
      
      const authServiceResponse = await fetch('http://localhost:4001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authServiceQuery)
      });
      
      const authServiceData = await authServiceResponse.json();
      console.log('Auth Service Response:', authServiceData);
    } catch (error) {
      console.log('Auth Service not yet running');
    }
    
    // Test User Service
    console.log('\n--- Testing User Service ---');
    try {
      const userServiceQuery = {
        query: `
          query {
            userProfile(userId: "test") {
              id
              displayName
            }
          }
        `
      };
      
      const userServiceResponse = await fetch('http://localhost:4002/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userServiceQuery)
      });
      
      const userServiceData = await userServiceResponse.json();
      console.log('User Service Response:', userServiceData);
    } catch (error) {
      console.log('User Service not yet running');
    }
    
    // Test Mood Service
    console.log('\n--- Testing Mood Service ---');
    try {
      const moodServiceQuery = {
        query: `
          query {
            moodStreak(userId: "test") {
              currentStreak
              longestStreak
            }
          }
        `
      };
      
      const moodServiceResponse = await fetch('http://localhost:4003/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moodServiceQuery)
      });
      
      const moodServiceData = await moodServiceResponse.json();
      console.log('Mood Service Response:', moodServiceData);
    } catch (error) {
      console.log('Mood Service not yet running');
    }
    
    // Test Hug Service
    console.log('\n--- Testing Hug Service ---');
    try {
      const hugServiceQuery = {
        query: `
          query {
            hug(id: "test") {
              id
              hugType
            }
          }
        `
      };
      
      const hugServiceResponse = await fetch('http://localhost:4004/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hugServiceQuery)
      });
      
      const hugServiceData = await hugServiceResponse.json();
      console.log('Hug Service Response:', hugServiceData);
    } catch (error) {
      console.log('Hug Service not yet running');
    }
    
    // Test WebSocket Connection
    console.log('\n--- Testing WebSocket Connection ---');
    const ws = new WebSocket('ws://localhost:5000/ws');
    
    ws.on('open', function open() {
      console.log('WebSocket Connection Established');
      
      // Send ping message
      ws.send(JSON.stringify({ type: 'ping' }));
      
      // Close after a short delay
      setTimeout(() => {
        ws.close();
        console.log('WebSocket Test Complete');
      }, 1000);
    });
    
    ws.on('message', function incoming(data) {
      const message = JSON.parse(data);
      console.log('WebSocket Message Received:', message);
    });
    
    ws.on('error', function error(err) {
      console.log('WebSocket Error:', err.message);
    });
    
  } catch (error) {
    console.error('Error testing services:', error);
  }
}

// Run the tests
testServices();