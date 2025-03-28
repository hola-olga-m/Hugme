/**
 * Live Query Gateway for HugMeNow
 * 
 * This is a simplified gateway that supports the @live directive
 * without relying on complex GraphQL Mesh configuration.
 */

import express from 'express';
import { createYoga } from 'graphql-yoga';
import { parse, print } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import fetch from 'cross-fetch';
import cors from 'cors';
import chalk from 'chalk';

// Configuration
const PORT = process.env.PORT || 5006;
const API_ENDPOINT = 'http://localhost:3003/postgraphile/graphql';

// Simple schema with @live directive support
const typeDefs = `
  directive @live on QUERY

  type Query {
    publicMoods(limit: Int): [Mood]
    userMoods(userId: ID, limit: Int): [Mood]
    receivedHugs(userId: ID!, limit: Int): [Hug]
    sentHugs(userId: ID!, limit: Int): [Hug]
    clientInfo: ClientInfo!
  }

  type Mutation {
    createMood(input: MoodInput!): MoodPayload
    sendHug(input: HugInput!): HugPayload
    login(input: LoginInput!): AuthPayload
    register(input: RegisterInput!): AuthPayload
  }

  input MoodInput {
    mood: MoodInput_mood!
  }

  input MoodInput_mood {
    userId: ID!
    mood: String!
    intensity: Int!
    message: String
    isPublic: Boolean
  }

  input HugInput {
    hug: HugInput_hug!
  }

  input HugInput_hug {
    senderId: ID!
    recipientId: ID!
    moodId: ID!
    message: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    username: String!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type MoodPayload {
    mood: Mood
  }

  type HugPayload {
    hug: Hug
  }

  type Mood {
    id: ID!
    userId: ID!
    mood: String!
    intensity: Int!
    message: String
    isPublic: Boolean
    createdAt: String
    user: User
  }

  type Hug {
    id: ID!
    senderId: ID!
    recipientId: ID!
    moodId: ID!
    message: String
    isRead: Boolean
    createdAt: String
    sender: User
    recipient: User
    mood: Mood
    # Virtual fields for compatibility with test script
    fromUser: User
    toUser: User
    read: Boolean
  }

  type User {
    id: ID!
    username: String!
    email: String!
    profileImage: String
  }

  type ClientInfo {
    version: String!
    buildDate: String!
    platform: String
    features: [String]
  }
`;

// Create executable schema with resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {} // Will be added later in startServer function
});

// Forward operations to the underlying API
async function executeOperation(query, variables, context) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (context.headers?.authorization) {
    headers['Authorization'] = context.headers.authorization;
  }
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        query: print(typeof query === 'string' ? parse(query) : query),
        variables 
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error executing operation:', error);
    return { errors: [{ message: error.message }] };
  }
}

// Client info resolver
const clientInfo = () => {
  return {
    version: process.env.CLIENT_VERSION || '2.0.0',
    buildDate: new Date().toISOString(),
    platform: process.env.CLIENT_PLATFORM || 'web',
    features: (process.env.CLIENT_FEATURES || 'live-queries,mood-tracking').split(',')
  };
};

// Start the server
async function startServer() {
  try {
    console.log(chalk.blue('🔍 Starting Live Query Gateway...'));
    console.log(chalk.blue(`🔗 Connecting to API at ${API_ENDPOINT}`));
    
    // Create Express app
    const app = express();
    app.use(cors());
    
    // Create resolvers that forward to the underlying API
    const resolvers = {
      // Resolve virtual fields
      Hug: {
        // Map fromUser to sender
        fromUser: (parent) => parent.sender,
        
        // Map toUser to recipient
        toUser: (parent) => parent.recipient,
        
        // Map read to isRead
        read: (parent) => parent.isRead
      },
      
      Query: {
        // Forward public moods query
        publicMoods: async (_, args, context) => {
          const result = await executeOperation(`
            query PublicMoods($limit: Int) {
              publicMoods(limit: $limit) {
                id
                userId
                mood
                intensity
                message
                isPublic
                createdAt
                user {
                  id
                  username
                }
              }
            }
          `, args, context);
          
          return result.data?.publicMoods;
        },
        
        // Forward user moods query
        userMoods: async (_, args, context) => {
          const result = await executeOperation(`
            query UserMoods($userId: ID, $limit: Int) {
              userMoods(userId: $userId, limit: $limit) {
                id
                userId
                mood
                intensity
                message
                isPublic
                createdAt
                user {
                  id
                  username
                }
              }
            }
          `, args, context);
          
          return result.data?.userMoods;
        },
        
        // Forward received hugs query
        receivedHugs: async (_, args, context) => {
          const result = await executeOperation(`
            query ReceivedHugs($userId: ID!, $limit: Int) {
              receivedHugs(userId: $userId, limit: $limit) {
                id
                senderId
                recipientId
                moodId
                message
                isRead
                createdAt
                sender {
                  id
                  username
                }
                recipient {
                  id
                  username
                }
              }
            }
          `, args, context);
          
          return result.data?.receivedHugs;
        },
        
        // Forward sent hugs query
        sentHugs: async (_, args, context) => {
          const result = await executeOperation(`
            query SentHugs($userId: ID!, $limit: Int) {
              sentHugs(userId: $userId, limit: $limit) {
                id
                senderId
                recipientId
                moodId
                message
                isRead
                createdAt
                sender {
                  id
                  username
                }
                recipient {
                  id
                  username
                }
              }
            }
          `, args, context);
          
          return result.data?.sentHugs;
        },
        
        // Client info resolver (local)
        clientInfo
      },
      
      Mutation: {
        // Forward create mood mutation
        createMood: async (_, args, context) => {
          const result = await executeOperation(`
            mutation CreateMood($input: MoodInput!) {
              createMood(input: $input) {
                mood {
                  id
                  userId
                  mood
                  intensity
                  message
                  isPublic
                  createdAt
                }
              }
            }
          `, args, context);
          
          return result.data?.createMood;
        },
        
        // Forward send hug mutation
        sendHug: async (_, args, context) => {
          const result = await executeOperation(`
            mutation SendHug($input: HugInput!) {
              sendHug(input: $input) {
                hug {
                  id
                  senderId
                  recipientId
                  moodId
                  message
                  isRead
                  createdAt
                }
              }
            }
          `, args, context);
          
          return result.data?.sendHug;
        },
        
        // Forward login mutation
        login: async (_, args, context) => {
          const result = await executeOperation(`
            mutation Login($input: LoginInput!) {
              login(input: $input) {
                token
                user {
                  id
                  username
                  email
                }
              }
            }
          `, args, context);
          
          return result.data?.login;
        },
        
        // Forward register mutation
        register: async (_, args, context) => {
          const result = await executeOperation(`
            mutation Register($input: RegisterInput!) {
              register(input: $input) {
                token
                user {
                  id
                  username
                  email
                }
              }
            }
          `, args, context);
          
          return result.data?.register;
        }
      }
    };
    
    // Update schema with resolvers
    const schemaWithResolvers = makeExecutableSchema({
      typeDefs,
      resolvers
    });
    
    // Create Yoga server with @live directive support
    const yoga = createYoga({
      schema: schemaWithResolvers,
      context: ({ request }) => {
        const authHeader = request.headers.get('authorization');
        console.log(chalk.blue('🔑 Authorization header:', authHeader || 'none'));
        
        // Check for mock authentication token
        const isMockAuth = authHeader && authHeader.includes('mock-auth-token-for-testing');
        console.log(chalk.blue('🔐 Using mock auth:', isMockAuth));
        
        // Create mock user if using mock auth token
        const mockUser = isMockAuth ? {
          id: 'mock-user-123',
          username: 'mockuser',
          email: 'mock@example.com',
          authenticated: true
        } : null;
        
        // If using mock auth, create a complete context
        if (isMockAuth) {
          console.log(chalk.yellow('⚠️ Using mock authentication for testing'));
          return {
            headers: request.headers,
            request: request,
            user: mockUser,
            mockAuth: true
          };
        }
        
        // Regular context for non-mock requests
        return {
          headers: request.headers,
          request: request
        };
      },
      plugins: [
        // Simple live query plugin that re-executes queries with @live directive
        {
          onExecute: ({ setResultAndStopExecution, operationName, document, args, context }) => {
            // Check if query has @live directive
            if (!document || !document.definitions) {
              // Skip if document is not properly formed
              return;
            }
            
            const definitions = document.definitions;
            const operation = definitions.find(
              def => def.kind === 'OperationDefinition' && def.operation === 'query'
            );
            
            if (operation) {
              const liveDirective = operation.directives?.find(d => d.name.value === 'live');
              
              if (liveDirective) {
                console.log(`🔄 Live query detected: ${operationName || 'unnamed'}`);
                
                // Set up interval to re-execute the query
                const interval = setInterval(async () => {
                  try {
                    // Re-execute the resolver
                    const result = await resolvers.Query[operation.selectionSet.selections[0].name.value](
                      null,
                      args,
                      context
                    );
                    
                    // Push the updated result
                    setResultAndStopExecution({
                      data: {
                        [operation.selectionSet.selections[0].name.value]: result
                      }
                    });
                  } catch (error) {
                    console.error('Error in live query update:', error);
                  }
                }, 2000); // Poll every 2 seconds
                
                // Clean up on client disconnect
                context.request.signal.addEventListener('abort', () => {
                  clearInterval(interval);
                  console.log(`🔄 Live query stopped: ${operationName || 'unnamed'}`);
                });
              }
            }
          }
        }
      ],
      graphqlEndpoint: '/graphql',
      landingPage: true,
      maskedErrors: false,
      graphiql: {
        title: 'HugMeNow Live Query Gateway',
        defaultQuery: `# Welcome to HugMeNow GraphQL API with Live Query Support
# Try a query with @live directive for real-time updates

query PublicMoods @live {
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

# Or try getting client information
# query GetClientInfo {
#   clientInfo {
#     version
#     buildDate
#     features
#   }
# }
`,
      }
    });
    
    // Mount GraphQL server
    app.use('/graphql', yoga);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: process.env.CLIENT_VERSION || '2.0.0'
      });
    });
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(chalk.green(`✅ Live Query Gateway running at http://0.0.0.0:${PORT}/graphql`));
      console.log(chalk.cyan('📱 GraphiQL playground available at the same URL'));
      console.log(chalk.yellow('📡 Live Query support enabled - use @live directive on queries'));
    });
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to start server:'), error);
    process.exit(1);
  }
}

// Start the server
startServer();