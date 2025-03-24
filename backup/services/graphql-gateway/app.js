const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { buildSchema, print } = require('graphql');
const { stitchSchemas } = require('@graphql-tools/stitch');
const { makeRemoteExecutor, delegateToSchema } = require('@graphql-tools/wrap');
const { introspectSchema } = require('@graphql-tools/wrap');
const { addMocksToSchema } = require('@graphql-tools/mock');
const { mergeResolvers } = require('@graphql-tools/merge');
const fetch = require('node-fetch');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.GRAPHQL_GATEWAY_PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const httpServer = http.createServer(app);

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001/graphql';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4002/graphql';
const MOOD_SERVICE_URL = process.env.MOOD_SERVICE_URL || 'http://localhost:4003/graphql';
const HUG_SERVICE_URL = process.env.HUG_SERVICE_URL || 'http://localhost:4004/graphql';

// Create remote executors for each service with retry logic
function createRemoteExecutorWithRetry(url, serviceName) {
  return async ({ document, variables, context }) => {
    // Maximum number of retry attempts
    const MAX_RETRIES = 3;
    let retries = 0;
    let lastError;

    while (retries < MAX_RETRIES) {
      try {
        const query = typeof document === 'string' ? document : print(document);
        
        // Prepare headers
        const headers = {
          'Content-Type': 'application/json'
        };
        
        // Add authorization header if token is present in context
        if (context?.token) {
          headers['Authorization'] = `Bearer ${context.token}`;
        }
        
        // Make the request to the service
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query, variables })
        });
        
        const result = await response.json();
        
        // Check if the service returned errors
        if (result.errors) {
          console.error(`${serviceName} error:`, result.errors);
          
          // Determine if we should retry based on error type
          const shouldRetry = result.errors.some(error => {
            return error.message.includes('network') || 
                   error.message.includes('timeout') ||
                   error.message.includes('connection');
          });
          
          if (shouldRetry && retries < MAX_RETRIES - 1) {
            retries++;
            await new Promise(resolve => setTimeout(resolve, 500 * retries)); // Exponential backoff
            continue;
          }
        }
        
        return result;
      } catch (error) {
        console.error(`Error executing GraphQL query to ${serviceName}:`, error);
        lastError = error;
        
        // For network errors, retry after a delay
        if (retries < MAX_RETRIES - 1) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 500 * retries)); // Exponential backoff
        } else {
          throw error;
        }
      }
    }
    
    // If we've exhausted retries, throw the last error
    throw lastError;
  };
}

// Create remote executors for each service
const authServiceExecutor = createRemoteExecutorWithRetry(AUTH_SERVICE_URL, 'Auth Service');
const userServiceExecutor = createRemoteExecutorWithRetry(USER_SERVICE_URL, 'User Service');
const moodServiceExecutor = createRemoteExecutorWithRetry(MOOD_SERVICE_URL, 'Mood Service');
const hugServiceExecutor = createRemoteExecutorWithRetry(HUG_SERVICE_URL, 'Hug Service');

// Introspect and stitch the schemas with enhanced error handling
async function createGatewaySchema() {
  try {
    const subschemas = [];
    
    // Try to fetch schemas from all services with fallbacks
    try {
      const authServiceSchema = await introspectSchema(authServiceExecutor);
      subschemas.push({
        schema: authServiceSchema,
        executor: authServiceExecutor,
        batch: true,
        merge: {
          User: {
            selectionSet: '{ id }',
            fieldName: 'userById',
            args: originalObject => ({ id: originalObject.id })
          }
        }
      });
      console.log('Successfully loaded Auth Service schema');
    } catch (error) {
      console.error('Failed to load Auth Service schema:', error);
    }
    
    try {
      const userServiceSchema = await introspectSchema(userServiceExecutor);
      subschemas.push({
        schema: userServiceSchema,
        executor: userServiceExecutor,
        batch: true,
        merge: {
          User: {
            selectionSet: '{ id }',
            fieldName: 'userProfile',
            args: originalObject => ({ userId: originalObject.id })
          }
        }
      });
      console.log('Successfully loaded User Service schema');
    } catch (error) {
      console.error('Failed to load User Service schema:', error);
    }
    
    try {
      const moodServiceSchema = await introspectSchema(moodServiceExecutor);
      subschemas.push({
        schema: moodServiceSchema,
        executor: moodServiceExecutor,
        batch: true,
        merge: {
          User: {
            selectionSet: '{ id }',
            fieldName: 'moodStreak',
            args: originalObject => ({ userId: originalObject.id })
          },
          Mood: {
            selectionSet: '{ id }',
            fieldName: 'mood',
            args: originalObject => ({ id: originalObject.id })
          }
        }
      });
      console.log('Successfully loaded Mood Service schema');
    } catch (error) {
      console.error('Failed to load Mood Service schema:', error);
    }
    
    try {
      const hugServiceSchema = await introspectSchema(hugServiceExecutor);
      subschemas.push({
        schema: hugServiceSchema,
        executor: hugServiceExecutor,
        batch: true,
        merge: {
          User: {
            selectionSet: '{ id }',
            fieldName: 'userById',
            args: originalObject => ({ id: originalObject.id })
          },
          Hug: {
            selectionSet: '{ id }',
            fieldName: 'hug',
            args: originalObject => ({ id: originalObject.id })
          }
        }
      });
      console.log('Successfully loaded Hug Service schema');
    } catch (error) {
      console.error('Failed to load Hug Service schema:', error);
    }
    
    // If no schemas were loaded, return a fallback schema
    if (subschemas.length === 0) {
      console.warn('No service schemas could be loaded, using fallback schema');
      return createFallbackSchema();
    }
    
    // Define gateway-specific resolvers for advanced cross-service operations
    const gatewayResolvers = {
      Query: {
        // Example of a resolver that spans multiple services
        userDashboard: async (_, { userId }, context, info) => {
          // Validate user access
          if (!context.user || (context.user.userId !== userId && !context.user.isAdmin)) {
            throw new Error('Not authorized to access this dashboard');
          }
          
          try {
            // Get user profile from User Service
            const userProfileResult = await userServiceExecutor({
              document: `
                query GetUserProfile($userId: ID!) {
                  userProfile(userId: $userId) {
                    id
                    userId
                    displayName
                    bio
                    stats {
                      followingCount
                      followersCount
                      hugsGiven
                      hugsReceived
                    }
                  }
                }
              `,
              variables: { userId },
              context
            });
            
            // Get mood streak from Mood Service
            const moodStreakResult = await moodServiceExecutor({
              document: `
                query GetMoodStreak($userId: ID!) {
                  moodStreak(userId: $userId) {
                    currentStreak
                    longestStreak
                  }
                  moodAnalytics(userId: $userId, timeRange: 7) {
                    statistics {
                      averageScore
                      dominantMood
                    }
                  }
                }
              `,
              variables: { userId },
              context
            });
            
            // Get recent hugs from Hug Service
            const hugsResult = await hugServiceExecutor({
              document: `
                query GetRecentHugs($userId: ID!) {
                  hugs(userId: $userId, limit: 5) {
                    hugs {
                      id
                      hugType
                      createdAt
                    }
                    totalCount
                  }
                }
              `,
              variables: { userId },
              context
            });
            
            // Combine results into a unified dashboard
            return {
              user: userProfileResult.data?.userProfile || null,
              moodStats: {
                currentStreak: moodStreakResult.data?.moodStreak?.currentStreak || 0,
                longestStreak: moodStreakResult.data?.moodStreak?.longestStreak || 0,
                averageMood: moodStreakResult.data?.moodAnalytics?.statistics?.averageScore || 0,
                dominantMood: moodStreakResult.data?.moodAnalytics?.statistics?.dominantMood || 'neutral'
              },
              recentActivity: {
                hugs: hugsResult.data?.hugs?.hugs || [],
                hugCount: hugsResult.data?.hugs?.totalCount || 0
              }
            };
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw new Error('Failed to load dashboard data');
          }
        }
      },
      
      // Custom resolvers for merged types
      User: {
        // Get mood data for a user
        moodSummary: async (user, _, context, info) => {
          try {
            const result = await moodServiceExecutor({
              document: `
                query GetUserMoodSummary($userId: ID!) {
                  moodHistory(userId: $userId, period: "7days") {
                    summary {
                      averageScore
                      moodFrequency {
                        mood
                        count
                      }
                    }
                  }
                }
              `,
              variables: { userId: user.id },
              context
            });
            
            return result.data?.moodHistory?.summary || null;
          } catch (error) {
            console.error('Error fetching user mood summary:', error);
            return null;
          }
        },
        
        // Get recent hugs for a user
        recentHugs: async (user, { limit = 3 }, context, info) => {
          try {
            const result = await hugServiceExecutor({
              document: `
                query GetUserRecentHugs($userId: ID!, $limit: Int!) {
                  hugs(userId: $userId, limit: $limit) {
                    hugs {
                      id
                      hugType
                      message
                      createdAt
                    }
                  }
                }
              `,
              variables: { userId: user.id, limit },
              context
            });
            
            return result.data?.hugs?.hugs || [];
          } catch (error) {
            console.error('Error fetching user recent hugs:', error);
            return [];
          }
        }
      }
    };
    
    // Define the additional gateway schema
    const gatewayTypeDefs = `
      extend type Query {
        userDashboard(userId: ID!): UserDashboard
      }
      
      type UserDashboard {
        user: User
        moodStats: MoodStats
        recentActivity: RecentActivity
      }
      
      type MoodStats {
        currentStreak: Int
        longestStreak: Int
        averageMood: Float
        dominantMood: String
      }
      
      type RecentActivity {
        hugs: [Hug]
        hugCount: Int
      }
      
      extend type User {
        moodSummary: MoodSummary
        recentHugs(limit: Int): [Hug]
      }
      
      type MoodSummary {
        averageScore: Float
        moodFrequency: [MoodFrequencyItem]
      }
      
      type MoodFrequencyItem {
        mood: String!
        count: Int!
        percentage: Float
      }
    `;
    
    // Stitch the schemas together with advanced options
    return stitchSchemas({
      subschemas,
      typeDefs: [gatewayTypeDefs],
      resolvers: [gatewayResolvers],
      mergeTypes: true, // Merge types with the same name
      typeMergingOptions: {
        // Type merging rules - how to merge fields from different services
        validationSettings: {
          validationLevel: 'error' // or 'warn' during development
        }
      }
    });
  } catch (error) {
    console.error('Error creating gateway schema:', error);
    return createFallbackSchema();
  }
}

// Create a fallback schema when services are unavailable
function createFallbackSchema() {
  const fallbackSchema = buildSchema(`
    type Query {
      _service: ServiceInfo
      serviceStatus: [ServiceStatus]
    }
    
    type ServiceInfo {
      name: String
      version: String
      status: String
    }
    
    type ServiceStatus {
      name: String
      url: String
      available: Boolean
      message: String
    }
  `);
  
  // Add mock resolvers to the fallback schema
  return addMocksToSchema({
    schema: fallbackSchema,
    mocks: {
      ServiceInfo: () => ({
        name: 'HugMood GraphQL Gateway',
        version: '1.0.0',
        status: 'Degraded - Some services unavailable'
      }),
      ServiceStatus: () => ({
        name: 'Service',
        url: 'http://localhost:4000',
        available: false,
        message: 'Service temporarily unavailable'
      })
    },
    preserveResolvers: true
  });
}

// Middleware to handle authentication
const authMiddleware = (req) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  let user = null;
  
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production'
      );
      user = decoded;
    } catch (err) {
      console.error('Token verification error:', err.message);
    }
  }
  
  return { user, token };
};

// Start the server with health checks
async function startServer() {
  // Check connectivity to services
  const serviceStatus = [];
  
  // Helper function to check a service
  const checkService = async (url, name) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' })
      });
      
      if (response.ok) {
        console.log(`✅ ${name} is available`);
        serviceStatus.push({ name, url, available: true, message: 'Service available' });
        return true;
      } else {
        console.warn(`⚠️ ${name} returned status ${response.status}`);
        serviceStatus.push({ name, url, available: false, message: `Service returned status ${response.status}` });
        return false;
      }
    } catch (error) {
      console.error(`❌ ${name} is not available:`, error.message);
      serviceStatus.push({ name, url, available: false, message: error.message });
      return false;
    }
  };
  
  // Check all services
  await Promise.all([
    checkService(AUTH_SERVICE_URL, 'Auth Service'),
    checkService(USER_SERVICE_URL, 'User Service'),
    checkService(MOOD_SERVICE_URL, 'Mood Service'),
    checkService(HUG_SERVICE_URL, 'Hug Service')
  ]);
  
  // Create the gateway schema
  const schema = await createGatewaySchema();
  
  // Create Apollo Server with enhanced logging and metrics
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const { user, token } = authMiddleware(req);
      return { user, token, serviceStatus };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        // Custom plugin for request logging
        async requestDidStart(requestContext) {
          const startTime = Date.now();
          console.log(`GraphQL request started: ${requestContext.request.operationName || 'anonymous'}`);
          
          return {
            async willSendResponse(requestContext) {
              const duration = Date.now() - startTime;
              console.log(`GraphQL request completed in ${duration}ms: ${requestContext.request.operationName || 'anonymous'}`);
            },
            async didEncounterErrors(requestContext) {
              console.error('GraphQL errors:', requestContext.errors);
            }
          };
        }
      }
    ],
    // Enhanced error formatting
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      
      // Customize error messages based on error type
      if (error.originalError) {
        // Authentication errors
        if (error.originalError.message.includes('authentication') || error.originalError.message.includes('token')) {
          return {
            message: 'Authentication error',
            code: 'AUTH_ERROR',
            locations: error.locations,
            path: error.path
          };
        }
        
        // Service unavailable errors
        if (error.originalError.message.includes('ECONNREFUSED') || error.originalError.message.includes('network')) {
          return {
            message: 'Service temporarily unavailable',
            code: 'SERVICE_UNAVAILABLE',
            locations: error.locations,
            path: error.path
          };
        }
      }
      
      // Default error handling
      return {
        message: error.message,
        locations: error.locations,
        path: error.path
      };
    }
  });
  
  // Start Apollo Server
  await server.start();
  
  // Apply middleware
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: {
      origin: '*',
      credentials: true
    }
  });
  
  // Start HTTP server
  await new Promise(resolve => httpServer.listen({ port: PORT, host: '0.0.0.0' }, resolve));
  
  console.log(`🚀 GraphQL Gateway ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
  
  return { server, app, httpServer, serviceStatus };
}

// Express routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>HugMood GraphQL Gateway</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                 max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.5; }
          h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
          h2 { color: #444; margin-top: 2rem; }
          pre { background: #f5f5f5; padding: 1rem; border-radius: 3px; overflow-x: auto; }
          .success { color: green; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h1>HugMood GraphQL Gateway</h1>
        <p>The GraphQL Gateway is running. Visit <a href="/graphql">/graphql</a> to access the GraphQL Playground.</p>
        
        <h2>Services</h2>
        <ul>
          <li>Auth Service: ${AUTH_SERVICE_URL}</li>
          <li>User Service: ${USER_SERVICE_URL}</li>
          <li>Mood Service: ${MOOD_SERVICE_URL}</li>
          <li>Hug Service: ${HUG_SERVICE_URL}</li>
        </ul>
        
        <h2>Sample Query</h2>
        <pre>
{
  serviceStatus {
    name
    url
    available
    message
  }
}
        </pre>
      </body>
    </html>
  `);
});

// Health check endpoint with detailed status
app.get('/health', async (req, res) => {
  try {
    // Check connectivity to all services
    const serviceStatus = [];
    
    // Helper function to check a service
    const checkService = async (url, name) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '{ __typename }' }),
          timeout: 2000 // 2 second timeout
        });
        
        if (response.ok) {
          serviceStatus.push({ name, url, available: true, message: 'Service available' });
          return true;
        } else {
          serviceStatus.push({ name, url, available: false, message: `Service returned status ${response.status}` });
          return false;
        }
      } catch (error) {
        serviceStatus.push({ name, url, available: false, message: error.message });
        return false;
      }
    };
    
    // Check all services in parallel
    await Promise.all([
      checkService(AUTH_SERVICE_URL, 'Auth Service'),
      checkService(USER_SERVICE_URL, 'User Service'),
      checkService(MOOD_SERVICE_URL, 'Mood Service'),
      checkService(HUG_SERVICE_URL, 'Hug Service')
    ]);
    
    // Determine overall status
    const allServicesAvailable = serviceStatus.every(service => service.available);
    const anyServiceAvailable = serviceStatus.some(service => service.available);
    
    let status = 'ok';
    if (!anyServiceAvailable) {
      status = 'critical';
    } else if (!allServicesAvailable) {
      status = 'degraded';
    }
    
    res.status(anyServiceAvailable ? 200 : 503).json({
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: serviceStatus
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
startServer()
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = { app, startServer };