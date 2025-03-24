# Advanced GraphQL Implementation

## Overview

This document details the advanced GraphQL implementation for HugMood, covering schema stitching, GraphQL Mesh, Postgraphile, inspection tools, and various plugins that enhance the GraphQL ecosystem. These technologies are chosen to create a unified, performant, and maintainable API layer that serves both web and mobile clients efficiently.

## Schema Stitching

Schema stitching is a technique used to combine multiple GraphQL schemas into a single, unified schema. In HugMood, this enables us to maintain microservice boundaries while presenting a cohesive API to clients.

### Implementation Approach

```javascript
// Example of schema stitching implementation using @graphql-tools/stitch
const { stitchSchemas } = require('@graphql-tools/stitch');
const { makeRemoteExecutableSchema } = require('@graphql-tools/wrap');
const { fetch } = require('cross-fetch');

async function createStitchedSchema() {
  // Create executable schema for User Service
  const userServiceSchema = await makeRemoteExecutableSchema({
    schema: await fetchSDLFromService('http://localhost:5001/graphql'),
    executor: async ({ document, variables }) => {
      const query = print(document);
      const response = await fetch('http://localhost:5001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      return response.json();
    },
  });

  // Create executable schema for Mood Service
  const moodServiceSchema = await makeRemoteExecutableSchema({
    schema: await fetchSDLFromService('http://localhost:5002/graphql'),
    executor: async ({ document, variables }) => {
      const query = print(document);
      const response = await fetch('http://localhost:5002/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      return response.json();
    },
  });

  // Create executable schema for Hug Service
  const hugServiceSchema = await makeRemoteExecutableSchema({
    schema: await fetchSDLFromService('http://localhost:5003/graphql'),
    executor: async ({ document, variables }) => {
      const query = print(document);
      const response = await fetch('http://localhost:5003/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      return response.json();
    },
  });

  // Define how types are merged across schemas
  const typeMergingConfig = {
    User: {
      fieldName: 'user',
      args: (originalObject) => ({ id: originalObject.id }),
      selectionSet: '{ id }',
      canonical: true,
    },
    MoodEntry: {
      fieldName: 'moodEntry',
      args: (originalObject) => ({ id: originalObject.id }),
      selectionSet: '{ id }',
    },
    Hug: {
      fieldName: 'hug',
      args: (originalObject) => ({ id: originalObject.id }),
      selectionSet: '{ id }',
    },
  };

  // Stitch schemas together
  return stitchSchemas({
    subschemas: [
      { schema: userServiceSchema, batch: true },
      { schema: moodServiceSchema, batch: true },
      { schema: hugServiceSchema, batch: true },
    ],
    typeMerging: typeMergingConfig,
    // Add any custom resolvers for cross-service fields
    resolvers: {
      User: {
        // Add resolvers for fields that require data from multiple services
        moodEntries: {
          selectionSet: '{ id }',
          resolve(user, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: moodServiceSchema,
              operation: 'query',
              fieldName: 'moodEntriesByUserId',
              args: { userId: user.id, ...args },
              context,
              info,
            });
          },
        },
        hugsReceived: {
          selectionSet: '{ id }',
          resolve(user, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: hugServiceSchema,
              operation: 'query',
              fieldName: 'hugsReceivedByUserId',
              args: { userId: user.id, ...args },
              context,
              info,
            });
          },
        },
      },
    },
  });
}

// Helper function to fetch SDL from a service
async function fetchSDLFromService(url) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        {
          __schema {
            types {
              kind
              name
              description
              fields {
                name
                description
                args {
                  name
                  description
                  type {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                  defaultValue
                }
                type {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
              inputFields {
                name
                description
                type {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
                defaultValue
              }
              interfaces {
                kind
                name
              }
              enumValues {
                name
                description
              }
              possibleTypes {
                kind
                name
              }
            }
            queryType {
              name
            }
            mutationType {
              name
            }
            subscriptionType {
              name
            }
          }
        }
      `,
    }),
  });

  const { data } = await response.json();
  return buildClientSchema(data.__schema);
}
```

### Schema Stitching Benefits

1. **Modularity**: Each service maintains its own schema
2. **Unified API**: Clients interact with a single GraphQL endpoint
3. **Type Consistency**: Types that span multiple services are merged correctly
4. **Performance**: Includes batch resolving to minimize network requests

## GraphQL Mesh

GraphQL Mesh takes schema stitching to the next level by allowing integration of non-GraphQL data sources (REST, gRPC, SOAP, databases) into a unified GraphQL schema.

### Mesh Configuration

HugMood uses GraphQL Mesh to integrate various services:

```yaml
# .meshrc.yaml
sources:
  - name: UserService
    handler:
      graphql:
        endpoint: http://localhost:5001/graphql
        operationHeaders:
          Authorization: '{context.headers.authorization}'

  - name: MoodService
    handler:
      graphql:
        endpoint: http://localhost:5002/graphql
        operationHeaders:
          Authorization: '{context.headers.authorization}'

  - name: HugService
    handler:
      graphql:
        endpoint: http://localhost:5003/graphql
        operationHeaders:
          Authorization: '{context.headers.authorization}'

  - name: LegacyAnalyticsAPI
    handler:
      openapi:
        source: http://localhost:5004/swagger.json
        operationHeaders:
          api-key: '{env.ANALYTICS_API_KEY}'

  - name: PostgresDB
    handler:
      postgraphile:
        connectionString: '{env.DATABASE_URL}'
        schemaName: 'public'
        options:
          watchPg: false
          dynamicJson: true
          setofFunctionsContainNulls: false
          ignoreRBAC: false
          ignoreIndexes: false
          extendedErrors: ['hint', 'detail', 'errcode']

transforms:
  # Prefixes to avoid naming conflicts
  - prefix:
      value: UserService_
      includeRootOperations: true
      ignore:
        - User
        - Query.user
        - Query.users
        - Mutation.updateUser

  - prefix:
      value: MoodService_
      includeRootOperations: true
      ignore:
        - MoodEntry
        - Query.moodEntry
        - Query.moodEntries

  - prefix:
      value: HugService_
      includeRootOperations: true
      ignore:
        - Hug
        - Query.hug
        - Query.hugs

  - prefix:
      value: Analytics_
      includeRootOperations: true
      ignore: []
  
  # Type merging across services
  - federation:
      types:
        User:
          keyFields: ['id']
          resolver: 
            queryFieldName: user
            queryFieldArgs: '{id: "{root.id}"}'
        MoodEntry:
          keyFields: ['id']
          resolver:
            queryFieldName: moodEntry
            queryFieldArgs: '{id: "{root.id}"}'
        Hug:
          keyFields: ['id']
          resolver:
            queryFieldName: hug
            queryFieldArgs: '{id: "{root.id}"}'

  # Field extensions for additional functionality
  - extend:
      typeDefs: |
        extend type User {
          moodStats: MoodStats
          hugStats: HugStats
        }
        
        type MoodStats {
          averageMood: Float
          moodEntryCount: Int
          moodsByDay: [MoodByDay!]
        }
        
        type HugStats {
          hugsSentCount: Int
          hugsReceivedCount: Int
          mostFrequentHugType: String
        }

additionalResolvers:
  - './mesh/resolvers.js'

plugins:
  - auth:
      module: './mesh/plugins/auth.js'
  - logger:
      module: './mesh/plugins/logger.js'
  - cache:
      module: './mesh/plugins/cache.js'

serve:
  endpoint: /graphql
  playground: true
  cors:
    origin: '*'
    credentials: true
```

### Custom Resolvers for Mesh

```javascript
// mesh/resolvers.js
module.exports = {
  User: {
    moodStats: {
      selectionSet: '{ id }',
      resolve: async (root, args, context, info) => {
        // Fetch mood entries for this user
        const moodEntries = await context.MoodService.Query.moodEntriesByUserId({
          userId: root.id,
          limit: 100
        });
        
        // Calculate statistics
        const averageMood = calculateAverageMood(moodEntries);
        const moodsByDay = calculateMoodsByDay(moodEntries);
        
        return {
          averageMood,
          moodEntryCount: moodEntries.length,
          moodsByDay
        };
      }
    },
    hugStats: {
      selectionSet: '{ id }',
      resolve: async (root, args, context, info) => {
        // Fetch hugs data for this user
        const [sent, received] = await Promise.all([
          context.HugService.Query.hugsSentByUserId({ userId: root.id }),
          context.HugService.Query.hugsReceivedByUserId({ userId: root.id })
        ]);
        
        // Calculate most frequent hug type
        const mostFrequentHugType = calculateMostFrequentHugType(sent);
        
        return {
          hugsSentCount: sent.length,
          hugsReceivedCount: received.length,
          mostFrequentHugType
        };
      }
    }
  }
};

// Helper functions
function calculateAverageMood(moodEntries) {
  if (moodEntries.length === 0) return 0;
  
  const sum = moodEntries.reduce((acc, entry) => acc + entry.intensity, 0);
  return sum / moodEntries.length;
}

function calculateMoodsByDay(moodEntries) {
  // Group mood entries by day and calculate average
  const days = {};
  
  moodEntries.forEach(entry => {
    const date = new Date(entry.createdAt);
    const day = date.toISOString().split('T')[0];
    
    if (!days[day]) {
      days[day] = { sum: 0, count: 0 };
    }
    
    days[day].sum += entry.intensity;
    days[day].count += 1;
  });
  
  return Object.entries(days).map(([day, data]) => ({
    day,
    averageMood: data.sum / data.count
  }));
}

function calculateMostFrequentHugType(hugsSent) {
  if (hugsSent.length === 0) return null;
  
  const typeCounts = {};
  
  hugsSent.forEach(hug => {
    typeCounts[hug.type] = (typeCounts[hug.type] || 0) + 1;
  });
  
  return Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    [0][0];
}
```

### Authentication Plugin

```javascript
// mesh/plugins/auth.js
const jwt = require('jsonwebtoken');

module.exports = {
  async onResolverCalled({ root, args, context, info, resolverData }) {
    // Skip authentication for introspection queries
    if (info.fieldName === '__schema' || info.fieldName === '__type') {
      return;
    }
    
    // Get authorization header
    const authHeader = context.headers.authorization;
    if (!authHeader) {
      throw new Error('Authentication required');
    }
    
    // Verify JWT token
    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user info to context
      context.user = decoded;
      
      // Check if operation is permitted for this user
      await checkPermission(decoded, info.fieldName, resolverData.source.name);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
};

async function checkPermission(user, fieldName, sourceName) {
  // Check if user has permission for this operation
  // This is a simplified example - real implementation would be more sophisticated
  
  // Admins have access to everything
  if (user.role === 'admin') return true;
  
  // Check sensitive operations
  const sensitiveOperations = [
    'updateUserRole',
    'deleteUser',
    'adminStats',
    // ...more sensitive operations
  ];
  
  if (sensitiveOperations.includes(fieldName) && user.role !== 'admin') {
    throw new Error('Permission denied');
  }
  
  return true;
}
```

### Caching Plugin

```javascript
// mesh/plugins/cache.js
const { createHash } = require('crypto');
const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  async onResolverCalled({ root, args, context, info, resolverData }) {
    // Only cache queries, not mutations or subscriptions
    if (info.operation.operation !== 'query') {
      return;
    }
    
    // Skip caching for user-specific data if requested
    if (context.skipCache) {
      return;
    }
    
    // Create cache key
    const cacheKey = createCacheKey(info.fieldName, args, context.user?.id);
    
    // Check cache
    try {
      const cachedResult = await getAsync(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
  },
  
  async onResolverDone({ root, args, context, info, result, resolverData }) {
    // Only cache queries, not mutations or subscriptions
    if (info.operation.operation !== 'query') {
      return;
    }
    
    // Skip caching for user-specific data if requested
    if (context.skipCache) {
      return;
    }
    
    // Determine TTL based on field
    const ttl = getCacheTTL(info.fieldName);
    if (ttl <= 0) {
      return;
    }
    
    // Create cache key
    const cacheKey = createCacheKey(info.fieldName, args, context.user?.id);
    
    // Store in cache
    try {
      await setAsync(cacheKey, JSON.stringify(result), 'EX', ttl);
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }
};

function createCacheKey(fieldName, args, userId) {
  // Create deterministic cache key
  const hash = createHash('sha256');
  hash.update(fieldName);
  hash.update(JSON.stringify(args || {}));
  
  // Include user ID for user-specific data
  if (userId) {
    hash.update(userId);
  }
  
  return `graphql:${hash.digest('hex')}`;
}

function getCacheTTL(fieldName) {
  // Define TTL (in seconds) for different queries
  const ttlMap = {
    // User data - short TTL as it changes frequently
    'user': 300, // 5 minutes
    'users': 300,
    
    // Mood entries - medium TTL
    'moodEntry': 600, // 10 minutes
    'moodEntries': 600,
    
    // Analytics - longer TTL as they're expensive to compute
    'moodAnalytics': 1800, // 30 minutes
    'hugStats': 1800,
    
    // Static data - long TTL
    'hugTypes': 86400, // 24 hours
    'moodTypes': 86400,
    
    // Default
    'default': 60 // 1 minute
  };
  
  return ttlMap[fieldName] || ttlMap.default;
}
```

### Logging Plugin

```javascript
// mesh/plugins/logger.js
module.exports = {
  async onResolverCalled({ root, args, context, info, resolverData }) {
    const startTime = Date.now();
    context._resolverStartTime = startTime;
    
    console.log(`[${new Date(startTime).toISOString()}] GraphQL ${info.operation.operation} started: ${info.fieldName}`);
  },
  
  async onResolverDone({ root, args, context, info, result, resolverData }) {
    const endTime = Date.now();
    const startTime = context._resolverStartTime || endTime;
    const duration = endTime - startTime;
    
    console.log(`[${new Date(endTime).toISOString()}] GraphQL ${info.operation.operation} completed: ${info.fieldName} (${duration}ms)`);
    
    // Log detailed timing for slow queries
    if (duration > 500) {
      console.warn(`Slow resolver detected: ${info.fieldName} took ${duration}ms`);
    }
  },
  
  async onResolverError({ root, args, context, info, error, resolverData }) {
    const endTime = Date.now();
    const startTime = context._resolverStartTime || endTime;
    const duration = endTime - startTime;
    
    console.error(`[${new Date(endTime).toISOString()}] GraphQL ${info.operation.operation} error: ${info.fieldName} (${duration}ms)`);
    console.error(`Error: ${error.message}`);
    console.error(error.stack);
  }
};
```

## Postgraphile Integration

Postgraphile automatically generates a GraphQL API from a PostgreSQL database schema, enabling rapid development and reducing boilerplate code. HugMood uses Postgraphile for parts of the schema that closely match the database structure.

### Basic Implementation

```javascript
const express = require('express');
const { postgraphile } = require('postgraphile');
const PgSimplifyInflectorPlugin = require('@graphile-contrib/pg-simplify-inflector');
const ConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');
const PgManyToManyPlugin = require('@graphile-contrib/pg-many-to-many');

const app = express();

app.use(
  '/graphql',
  postgraphile(
    process.env.DATABASE_URL,
    'public',
    {
      watchPg: process.env.NODE_ENV !== 'production',
      graphiql: process.env.NODE_ENV !== 'production',
      enhanceGraphiql: true,
      enableCors: true,
      appendPlugins: [
        PgSimplifyInflectorPlugin,
        ConnectionFilterPlugin,
        PgManyToManyPlugin,
      ],
      // Custom Postgraphile settings
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      ignoreIndexes: false,
      extendedErrors: ['hint', 'detail', 'errcode'],
      // Security settings
      jwtSecret: process.env.JWT_SECRET,
      jwtPgTypeIdentifier: 'public.jwt_token',
      pgDefaultRole: 'hugmood_anonymous',
      // Performance optimizations
      enableQueryBatching: true,
      bodySizeLimit: '500kb',
      // Subscription support
      subscriptions: true,
      simpleSubscriptions: true,
    }
  )
);

app.listen(process.env.PORT || 5000);
```

### JWT Authentication with Postgraphile

```sql
-- Create JWT custom type
CREATE TYPE public.jwt_token AS (
  token text,
  expires_at timestamptz
);

-- Create roles
CREATE ROLE hugmood_anonymous;
CREATE ROLE hugmood_user;
CREATE ROLE hugmood_admin;

-- Grant appropriate permissions
GRANT hugmood_anonymous TO postgres;
GRANT hugmood_user TO postgres;
GRANT hugmood_admin TO postgres;

-- Grant usage to all roles
GRANT USAGE ON SCHEMA public TO hugmood_anonymous, hugmood_user, hugmood_admin;

-- Anonymous can only select from public tables
GRANT SELECT ON public.hug_types TO hugmood_anonymous;
GRANT SELECT ON public.mood_types TO hugmood_anonymous;

-- Users can select, insert and update their own data
GRANT SELECT, INSERT, UPDATE ON public.users TO hugmood_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mood_entries TO hugmood_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hugs TO hugmood_user;

-- Row level security policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hugs ENABLE ROW LEVEL SECURITY;

-- User can only see and edit their own profile
CREATE POLICY users_policy ON public.users
  USING (id = current_setting('jwt.claims.user_id', true)::uuid)
  WITH CHECK (id = current_setting('jwt.claims.user_id', true)::uuid);

-- User can see and edit their own mood entries
CREATE POLICY mood_entries_policy ON public.mood_entries
  USING (user_id = current_setting('jwt.claims.user_id', true)::uuid)
  WITH CHECK (user_id = current_setting('jwt.claims.user_id', true)::uuid);

-- User can see any public mood entries
CREATE POLICY mood_entries_public_policy ON public.mood_entries
  USING (is_public = true);

-- User can insert hugs they send and view hugs they've sent or received
CREATE POLICY hugs_policy ON public.hugs
  USING (
    sender_id = current_setting('jwt.claims.user_id', true)::uuid
    OR recipient_id = current_setting('jwt.claims.user_id', true)::uuid
  )
  WITH CHECK (sender_id = current_setting('jwt.claims.user_id', true)::uuid);

-- Function to create JWT tokens
CREATE OR REPLACE FUNCTION public.authenticate(
  email text,
  password text
) RETURNS public.jwt_token AS $$
DECLARE
  account public.users;
  role text;
  token_lifetime interval = interval '1 day';
  result public.jwt_token;
BEGIN
  -- Find user with matching email
  SELECT u.* INTO account
  FROM public.users u
  WHERE u.email = authenticate.email;

  -- Check if user exists and password matches
  IF account.id IS NULL OR account.password_hash != crypt(password, account.password_hash) THEN
    RAISE EXCEPTION 'Invalid username or password';
  END IF;

  -- Determine role based on user type
  role := 'hugmood_user';
  IF account.is_admin THEN
    role := 'hugmood_admin';
  END IF;

  -- Create JWT token
  SELECT 
    sign(
      json_build_object(
        'role', role,
        'user_id', account.id,
        'exp', extract(epoch from now() + token_lifetime)::integer
      ),
      current_setting('app.jwt_secret')
    ) AS token,
    now() + token_lifetime AS expires_at
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;
```

## GraphQL Inspection and Development Tools

### GraphQL Playground Integration

```javascript
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { renderPlaygroundPage } = require('graphql-playground-html');
const schema = require('./schema');

const app = express();

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: false, // Disable built-in GraphiQL
}));

// GraphQL Playground endpoint
app.get('/playground', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(renderPlaygroundPage({
    endpoint: '/graphql',
    subscriptionEndpoint: '/graphql/subscriptions',
    settings: {
      'request.credentials': 'include',
      'editor.theme': 'dark',
      'editor.reuseHeaders': true,
      'tracing.hideTracingResponse': false,
      'editor.fontSize': 14,
      'editor.fontFamily': "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
    },
  }));
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
  console.log('GraphQL endpoint: http://localhost:5000/graphql');
  console.log('GraphQL Playground: http://localhost:5000/playground');
});
```

### Apollo Studio Integration

```javascript
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const schema = require('./schema');

const app = express();

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: false, // Disable built-in playground
  // Enable Apollo Studio integration
  plugins: [
    {
      async serverWillStart() {
        console.log('Apollo Studio is available at: https://studio.apollographql.com');
        return {
          async renderLandingPage() {
            return {
              htmlLandingPage: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>HugMood GraphQL API</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: sans-serif; margin: 0; padding: 24px; }
    h1 { margin-top: 0; }
    a { color: #1976d2; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>HugMood GraphQL API</h1>
  <p>Welcome to the HugMood GraphQL API. You can explore the API using the following tools:</p>
  <ul>
    <li><a href="https://studio.apollographql.com/sandbox/explorer?endpoint=${encodeURIComponent(
      process.env.GRAPHQL_URL || 'http://localhost:5000/graphql'
    )}">Apollo Studio Explorer</a></li>
    <li><a href="/playground">GraphQL Playground</a></li>
  </ul>
</body>
</html>`,
            };
          },
        };
      },
    },
  ],
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  
  // GraphQL Playground endpoint
  app.get('/playground', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(renderPlaygroundPage({
      endpoint: '/graphql',
      subscriptionEndpoint: '/graphql/subscriptions',
    }));
  });
  
  app.listen(5000, () => {
    console.log(`Server running at http://localhost:5000${server.graphqlPath}`);
  });
}

startServer();
```

## GraphQL Plugins and Utilities

### Rate Limiting

```javascript
const { createRateLimitDirective } = require('graphql-rate-limit');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// Create the rate limit directive
const rateLimitDirective = createRateLimitDirective({
  identifyContext: (context) => context.user?.id || context.req.ip,
});

// Rate limiting type definitions
const typeDefs = `
  directive @rateLimit(
    max: Int!,
    window: String!,
    message: String,
    identityArgs: [String]
  ) on FIELD_DEFINITION

  type Query {
    # Limited to 100 requests per minute
    highVolume: String @rateLimit(max: 100, window: "1m", message: "Too many requests")
    
    # Limited to 10 requests per minute, using custom identity args
    sensitiveOperation(userId: ID!): Boolean @rateLimit(max: 10, window: "1m", identityArgs: ["userId"])
  }
`;

// Create executable schema with directive
const schema = makeExecutableSchema({
  typeDefs: [rateLimitDirective.typeDefs, typeDefs],
  resolvers: {
    Query: {
      highVolume: () => 'This is a high volume endpoint',
      sensitiveOperation: (_, { userId }) => true
    }
  },
  schemaTransforms: [rateLimitDirective.transformer]
});
```

### Error Handling

```javascript
const { ApolloServer, ApolloError } = require('apollo-server-express');
const { GraphQLError } = require('graphql');

// Custom error classes
class AuthenticationError extends ApolloError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHENTICATED');
    
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}

class ForbiddenError extends ApolloError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN');
    
    Object.defineProperty(this, 'name', { value: 'ForbiddenError' });
  }
}

class ValidationError extends ApolloError {
  constructor(message = 'Validation error', fieldErrors = {}) {
    super(message, 'VALIDATION_ERROR', { fieldErrors });
    
    Object.defineProperty(this, 'name', { value: 'ValidationError' });
  }
}

// Custom error formatting
const formatError = (error) => {
  // Don't expose internal server errors to clients
  if (error.originalError instanceof GraphQLError) {
    // Pass GraphQL errors with extensions
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: error.extensions,
    };
  }
  
  // Log internal errors but don't expose details to client
  console.error('Internal error:', error);
  return new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
};

// Apollo Server setup with error handling
const server = new ApolloServer({
  schema,
  formatError,
  context: ({ req }) => {
    // Authentication logic
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token && req.body.operationName !== 'IntrospectionQuery') {
      throw new AuthenticationError();
    }
    
    try {
      const user = verifyToken(token);
      return { user };
    } catch (err) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }
});
```

### Subscription Handling

```javascript
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const express = require('express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');

// Create PubSub instance
const pubsub = new PubSub();

// Define subscription triggers
const EVENTS = {
  MOOD_UPDATED: 'MOOD_UPDATED',
  HUG_RECEIVED: 'HUG_RECEIVED',
  USER_STATUS_CHANGED: 'USER_STATUS_CHANGED'
};

// Type definitions with subscriptions
const typeDefs = `
  type Subscription {
    moodUpdated(userId: ID): MoodEntry!
    hugReceived: Hug!
    userStatusChanged(userId: ID): User!
  }
  
  # Rest of the schema...
`;

// Resolvers with subscription handlers
const resolvers = {
  Subscription: {
    moodUpdated: {
      subscribe: (_, { userId }, context) => {
        // Authorize subscription
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        // Filter by userId if provided
        const filter = userId ? 
          (payload) => payload.moodUpdated.userId === userId :
          () => true;
        
        return pubsub.asyncIterator([EVENTS.MOOD_UPDATED], { filter });
      }
    },
    hugReceived: {
      subscribe: (_, __, context) => {
        // Ensure authentication
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        // Only receive hugs for the authenticated user
        const filter = (payload) => 
          payload.hugReceived.recipientId === context.user.id;
        
        return pubsub.asyncIterator([EVENTS.HUG_RECEIVED], { filter });
      }
    },
    userStatusChanged: {
      subscribe: (_, { userId }, context) => {
        // Ensure authentication
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        // Filter by userId if provided
        const filter = userId ?
          (payload) => payload.userStatusChanged.id === userId :
          () => true;
        
        return pubsub.asyncIterator([EVENTS.USER_STATUS_CHANGED], { filter });
      }
    }
  },
  
  // Other resolvers...
};

// Create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Set up server
const app = express();
const httpServer = createServer(app);

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    // Extract and verify token
    const token = req?.headers?.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const user = verifyToken(token);
        return { user };
      } catch (err) {
        // Invalid token
        return {};
      }
    }
    return {};
  }
});

// Start the server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  
  // Set up subscription server
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams) => {
        // Authenticate WebSocket connection
        const token = connectionParams.Authorization?.replace('Bearer ', '');
        if (token) {
          try {
            const user = verifyToken(token);
            return { user };
          } catch (err) {
            throw new Error('Invalid token');
          }
        }
        throw new Error('Authentication required');
      }
    },
    { server: httpServer, path: '/graphql/subscriptions' }
  );
  
  httpServer.listen(5000, () => {
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:5000/graphql/subscriptions`);
  });
}

startServer();

// Example of publishing an event
async function publishMoodUpdate(moodEntry) {
  await pubsub.publish(EVENTS.MOOD_UPDATED, {
    moodUpdated: moodEntry
  });
}

async function publishHugReceived(hug) {
  await pubsub.publish(EVENTS.HUG_RECEIVED, {
    hugReceived: hug
  });
}

async function publishUserStatusChange(user) {
  await pubsub.publish(EVENTS.USER_STATUS_CHANGED, {
    userStatusChanged: user
  });
}
```

### Dataloaders for Batching and Caching

```javascript
const DataLoader = require('dataloader');
const { Pool } = require('pg');

// Create database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create context function with dataloaders
function createContext({ req }) {
  return {
    // Extract user from JWT token
    user: extractUserFromToken(req.headers.authorization),
    
    // User dataloader
    userLoader: new DataLoader(async (userIds) => {
      // Single query to fetch multiple users
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE id = ANY($1)',
        [userIds]
      );
      
      // Return users in the same order as ids
      return userIds.map(id => 
        rows.find(row => row.id === id) || null
      );
    }),
    
    // Mood entries dataloader
    moodEntriesLoader: new DataLoader(async (userIds) => {
      // Single query to fetch mood entries for multiple users
      const { rows } = await pool.query(
        'SELECT * FROM mood_entries WHERE user_id = ANY($1) ORDER BY created_at DESC',
        [userIds]
      );
      
      // Group entries by user
      const entriesByUser = userIds.map(id => 
        rows.filter(row => row.user_id === id)
      );
      
      return entriesByUser;
    }),
    
    // Hugs received dataloader
    hugsReceivedLoader: new DataLoader(async (userIds) => {
      // Single query to fetch hugs for multiple recipients
      const { rows } = await pool.query(
        'SELECT * FROM hugs WHERE recipient_id = ANY($1) ORDER BY sent_at DESC',
        [userIds]
      );
      
      // Group hugs by recipient
      const hugsByUser = userIds.map(id => 
        rows.filter(row => row.recipient_id === id)
      );
      
      return hugsByUser;
    }),
  };
}

// Example usage in resolver
const resolvers = {
  User: {
    async moodEntries(user, _, context) {
      return context.moodEntriesLoader.load(user.id);
    },
    
    async hugsReceived(user, _, context) {
      return context.hugsReceivedLoader.load(user.id);
    }
  },
  
  Query: {
    async user(_, { id }, context) {
      return context.userLoader.load(id);
    },
    
    async users(_, { ids }, context) {
      return context.userLoader.loadMany(ids);
    }
  }
};
```

## System-Independent Front-end Architecture

The HugMood front-end architecture is designed to support multiple platforms (web, mobile, desktop) while maintaining a consistent user experience and maximizing code reuse.

### Shared Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Shared Business Logic                   │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │             │  │             │  │                 │  │
│  │  GraphQL    │  │  State      │  │  Domain Models  │  │
│  │  Operations │  │  Management │  │                 │  │
│  │             │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │             │  │             │  │                 │  │
│  │  Validation │  │  Utility    │  │  Service        │  │
│  │  Logic      │  │  Functions  │  │  Interfaces     │  │
│  │             │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
                           │
                           │
                           ▼
     ┌────────────────────────────────────────┐
     │         Platform-Specific UI           │
     │                                        │
┌────┴────────┐  ┌────────────┐  ┌────────────┴───┐
│             │  │            │  │                │
│  Web (React)│  │Native (RN) │  │ Desktop (Elec) │
│             │  │            │  │                │
└─────────────┘  └────────────┘  └────────────────┘
```

### Shared Business Logic

The shared business logic layer is platform-agnostic and contains:

1. **GraphQL Operations**: Queries, mutations, and subscriptions
2. **State Management**: Core state logic (not UI state)
3. **Domain Models**: Data structures and transformations
4. **Validation Logic**: Form validation, data integrity checks
5. **Utility Functions**: Helpers, formatters, etc.
6. **Service Interfaces**: API clients, authentication, etc.

#### Folder Structure

```
/src
  /shared
    /graphql
      /queries
      /mutations
      /subscriptions
      /fragments
      index.ts
    /models
      User.ts
      MoodEntry.ts
      Hug.ts
      ...
    /state
      UserState.ts
      MoodState.ts
      HugState.ts
      ...
    /services
      ApiService.ts
      AuthService.ts
      AnalyticsService.ts
      ...
    /validation
      userValidation.ts
      moodValidation.ts
      ...
    /utils
      dateUtils.ts
      formatters.ts
      ...
  /web
    ...
  /mobile
    ...
  /desktop
    ...
```

#### Example Shared Code

```typescript
// shared/models/MoodEntry.ts
export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  intensity: number;
  note?: string;
  tags: string[];
  createdAt: string;
  isPublic: boolean;
}

export interface MoodEntryInput {
  mood: string;
  intensity: number;
  note?: string;
  tags?: string[];
  isPublic?: boolean;
}

export function calculateMoodValence(mood: string): number {
  const valenceMap: Record<string, number> = {
    'joy': 0.9,
    'contentment': 0.8,
    'serenity': 0.7,
    'neutral': 0.5,
    'anxiety': 0.3,
    'sadness': 0.2,
    'anger': 0.1
  };
  
  return valenceMap[mood] || 0.5;
}

export function categorizeMood(mood: string): 'positive' | 'neutral' | 'negative' {
  const positiveEmotions = ['joy', 'contentment', 'serenity', 'excitement'];
  const neutralEmotions = ['neutral', 'surprise', 'curiosity'];
  const negativeEmotions = ['anxiety', 'sadness', 'anger', 'fear', 'frustration'];
  
  if (positiveEmotions.includes(mood)) return 'positive';
  if (neutralEmotions.includes(mood)) return 'neutral';
  if (negativeEmotions.includes(mood)) return 'negative';
  
  return 'neutral';
}
```

```typescript
// shared/graphql/queries/moodQueries.ts
import { gql } from '@apollo/client/core';
import { MOOD_ENTRY_FRAGMENT } from '../fragments';

export const GET_MOOD_ENTRIES = gql`
  query GetMoodEntries($limit: Int, $offset: Int) {
    moodEntries(limit: $limit, offset: $offset) {
      ...MoodEntryFields
    }
  }
  ${MOOD_ENTRY_FRAGMENT}
`;

export const GET_MOOD_ENTRY = gql`
  query GetMoodEntry($id: ID!) {
    moodEntry(id: $id) {
      ...MoodEntryFields
    }
  }
  ${MOOD_ENTRY_FRAGMENT}
`;

export const GET_MOOD_ANALYTICS = gql`
  query GetMoodAnalytics($timeRange: TimeRange!) {
    moodAnalytics(timeRange: $timeRange) {
      moodFrequency {
        mood
        count
        percentage
      }
      moodByDayOfWeek {
        day
        averageMood
        entries
      }
      averageMood
      moodTrend
      insights {
        id
        type
        title
        description
      }
    }
  }
`;
```

```typescript
// shared/services/AuthService.ts
import { AuthResponse, LoginInput, RegisterInput, User } from '../models';

export interface AuthService {
  login(credentials: LoginInput): Promise<AuthResponse>;
  register(userData: RegisterInput): Promise<AuthResponse>;
  logout(): Promise<boolean>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): boolean;
  getAuthToken(): string | null;
}

// Implementation will be platform-specific but interface is shared
```

### Platform-Specific UI Layers

Each platform has its own UI implementation that consumes the shared business logic:

#### Web (React)

```typescript
// web/src/components/MoodTracker.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_MOOD_ENTRY } from 'shared/graphql/mutations';
import { MoodEntryInput, validateMoodEntry } from 'shared/models';
import { MoodSelector, MoodIntensitySlider, TagInput } from './ui';

export function MoodTracker() {
  const [moodInput, setMoodInput] = useState<MoodEntryInput>({
    mood: 'neutral',
    intensity: 0.5,
    isPublic: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [createMoodEntry, { loading }] = useMutation(CREATE_MOOD_ENTRY);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate using shared logic
    const validationErrors = validateMoodEntry(moodInput);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await createMoodEntry({
        variables: { input: moodInput }
      });
      
      // Reset form
      setMoodInput({
        mood: 'neutral',
        intensity: 0.5,
        isPublic: false
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };
  
  return (
    <div className="mood-tracker">
      <h2>Track Your Mood</h2>
      
      <form onSubmit={handleSubmit}>
        <MoodSelector 
          selected={moodInput.mood}
          onChange={mood => setMoodInput({ ...moodInput, mood })}
          error={errors.mood}
        />
        
        <MoodIntensitySlider
          value={moodInput.intensity}
          onChange={intensity => setMoodInput({ ...moodInput, intensity })}
          error={errors.intensity}
        />
        
        <div className="form-group">
          <label htmlFor="note">Notes (optional)</label>
          <textarea
            id="note"
            value={moodInput.note || ''}
            onChange={e => setMoodInput({ ...moodInput, note: e.target.value })}
          />
        </div>
        
        <TagInput
          tags={moodInput.tags || []}
          onChange={tags => setMoodInput({ ...moodInput, tags })}
        />
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={moodInput.isPublic}
              onChange={e => setMoodInput({ ...moodInput, isPublic: e.target.checked })}
            />
            Share with friends
          </label>
        </div>
        
        {errors.submit && (
          <div className="error">{errors.submit}</div>
        )}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Mood'}
        </button>
      </form>
    </div>
  );
}
```

#### Mobile (React Native)

```typescript
// mobile/src/screens/MoodTrackerScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_MOOD_ENTRY } from 'shared/graphql/mutations';
import { MoodEntryInput, validateMoodEntry } from 'shared/models';
import { MoodSelector, MoodIntensitySlider, TagInput, Button, TextInput } from '../components';
import { COLORS, SPACING } from '../theme';

export function MoodTrackerScreen({ navigation }) {
  const [moodInput, setMoodInput] = useState<MoodEntryInput>({
    mood: 'neutral',
    intensity: 0.5,
    isPublic: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [createMoodEntry, { loading }] = useMutation(CREATE_MOOD_ENTRY);
  
  const handleSubmit = async () => {
    // Validate using shared logic
    const validationErrors = validateMoodEntry(moodInput);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await createMoodEntry({
        variables: { input: moodInput }
      });
      
      // Navigate to confirmation/dashboard
      navigation.navigate('MoodConfirmation', { mood: moodInput.mood });
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Track Your Mood</Text>
      
      <MoodSelector 
        selected={moodInput.mood}
        onChange={mood => setMoodInput({ ...moodInput, mood })}
        error={errors.mood}
      />
      
      <MoodIntensitySlider
        value={moodInput.intensity}
        onChange={intensity => setMoodInput({ ...moodInput, intensity })}
        error={errors.intensity}
      />
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          multiline
          value={moodInput.note || ''}
          onChangeText={note => setMoodInput({ ...moodInput, note })}
          style={styles.textInput}
          placeholder="How are you feeling?"
        />
      </View>
      
      <TagInput
        tags={moodInput.tags || []}
        onChange={tags => setMoodInput({ ...moodInput, tags })}
      />
      
      <View style={styles.formGroup}>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Share with friends</Text>
          <Switch
            value={moodInput.isPublic}
            onValueChange={isPublic => setMoodInput({ ...moodInput, isPublic })}
          />
        </View>
      </View>
      
      {errors.submit && (
        <Text style={styles.errorText}>{errors.submit}</Text>
      )}
      
      <Button
        title={loading ? 'Saving...' : 'Save Mood'}
        onPress={handleSubmit}
        disabled={loading}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.medium,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.large,
    color: COLORS.text,
  },
  formGroup: {
    marginBottom: SPACING.medium,
  },
  label: {
    fontSize: 16,
    marginBottom: SPACING.small,
    color: COLORS.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.small,
    minHeight: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.medium,
  },
  button: {
    marginTop: SPACING.medium,
  },
});
```

### Adapters for Platform-Specific Features

Adapters provide a consistent interface to platform-specific features:

```typescript
// shared/services/interfaces/StorageService.ts
export interface StorageService {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// web/src/services/adapters/WebStorageAdapter.ts
import { StorageService } from 'shared/services/interfaces/StorageService';

export class WebStorageAdapter implements StorageService {
  constructor(private storage: Storage = localStorage) {}
  
  async setItem(key: string, value: string): Promise<void> {
    this.storage.setItem(key, value);
  }
  
  async getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key);
  }
  
  async removeItem(key: string): Promise<void> {
    this.storage.removeItem(key);
  }
  
  async clear(): Promise<void> {
    this.storage.clear();
  }
}

// mobile/src/services/adapters/AsyncStorageAdapter.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from 'shared/services/interfaces/StorageService';

export class AsyncStorageAdapter implements StorageService {
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }
  
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }
  
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
  
  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}
```

## Deployment on Replit

HugMood can be deployed on Replit with some specific configurations to ensure optimal performance.

### Replit Configuration

Create a `.replit` file at the root of the project:

```toml
# .replit
run = "npm start"
entrypoint = "server.js"

[env]
PORT = "5000"
NODE_ENV = "production"

[packager]
language = "nodejs"

[packager.features]
packageSearch = true
guessImports = true
enabledForHosting = true

[languages.javascript]
pattern = "**/*.js"
syntax = "javascript"

[languages.typescript]
pattern = "**/*.ts"
syntax = "typescript"

[nix]
channel = "stable-21_11"

[deployment]
build = ["npm", "run", "build"]
run = ["npm", "start"]
deploymentTarget = "cloudrun"
```

### Database Setup

Instead of a local PostgreSQL database, use a hosted database service:

1. Create a PostgreSQL database on a service like Supabase, Railway, or Neon
2. Add the database connection string as a secret in Replit:
   - Go to Secrets in the Replit sidebar
   - Add `DATABASE_URL` with your connection string

### Package Configuration

Update your `package.json` to include build and start scripts:

```json
{
  "name": "hugmood",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "build": "npm run build:server && npm run build:client",
    "build:server": "tsc -p tsconfig.server.json",
    "build:client": "webpack --mode production",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "nodemon --exec ts-node server.ts",
    "dev:client": "webpack serve --mode development"
  },
  "dependencies": {
    // ...dependencies
  },
  "devDependencies": {
    // ...devDependencies
  },
  "engines": {
    "node": ">=14.x"
  }
}
```

### Create a Proper Entry Point

Create a server.js file that will serve as the entry point:

```javascript
// server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const path = require('path');
const compression = require('compression');
const { typeDefs, resolvers } = require('./dist/schema');

// Create Express app
const app = express();

// Enable gzip compression
app.use(compression());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/client')));

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Server
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => {
    // Extract auth token
    const token = req?.headers?.authorization || '';
    return { token };
  },
  plugins: [
    // Add any server plugins
  ],
});

// Start server
async function startServer() {
  await apolloServer.start();
  
  // Apply Apollo middleware
  apolloServer.applyMiddleware({ app });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up subscription server
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams) => {
        // Handle authentication
        const token = connectionParams.Authorization || '';
        return { token };
      },
    },
    { server: httpServer, path: '/graphql/subscriptions' }
  );
  
  // Handle SPA routing by serving index.html for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/client/index.html'));
  });
  
  // Get port from environment or default to 5000
  const PORT = process.env.PORT || 5000;
  
  // Start HTTP server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql/subscriptions`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});
```

### Optimize for Memory Constraints

Replit has memory constraints, so optimize your application:

1. **Reduce Bundle Size**: Use code splitting and tree shaking
2. **Optimize Dependencies**: Use lightweight alternatives where possible
3. **Memory Management**: Implement garbage collection hints
4. **Connection Pooling**: Limit database connection pool size

Example database connection with optimized pool:

```javascript
const { Pool } = require('pg');

// Create optimized connection pool for Replit's memory constraints
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5, // Limit max connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Timeout after 2 seconds
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Required for some providers
  } : false
});

// Release client to pool on error
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    const originalRelease = client.release;
    
    // Override release method
    client.release = () => {
      client.release = originalRelease;
      return client.release();
    };
    
    return client;
  },
  end: () => pool.end()
};
```

### Environment Variables

Set up environment variables in the Replit environment:

1. JWT Secret for authentication
2. GraphQL-specific settings
3. Feature flags for enabling/disabling specific features
4. Database connection details

### Monitor and Scale

Implement monitoring to track application performance on Replit:

```javascript
// monitoring.js
const { performance } = require('perf_hooks');
const os = require('os');

// Simple in-memory metrics store
const metrics = {
  requests: 0,
  errors: 0,
  responseTime: [],
  lastGC: Date.now(),
  memoryUsage: []
};

// Record memory usage periodically
setInterval(() => {
  const memUsage = process.memoryUsage();
  metrics.memoryUsage.push({
    timestamp: Date.now(),
    rss: memUsage.rss / 1024 / 1024, // MB
    heapTotal: memUsage.heapTotal / 1024 / 1024, // MB
    heapUsed: memUsage.heapUsed / 1024 / 1024, // MB
    external: memUsage.external / 1024 / 1024 // MB
  });
  
  // Keep only last 100 measurements
  if (metrics.memoryUsage.length > 100) {
    metrics.memoryUsage.shift();
  }
  
  // Check if memory usage is high and trigger garbage collection
  if (memUsage.heapUsed / memUsage.heapTotal > 0.85 && 
      Date.now() - metrics.lastGC > 60000) { // Only GC at most once per minute
    try {
      global.gc();
      metrics.lastGC = Date.now();
    } catch (e) {
      // gc() is only available with --expose-gc flag
    }
  }
}, 60000); // Record every minute

// Express middleware for request tracking
function monitoringMiddleware(req, res, next) {
  const start = performance.now();
  
  // Count request
  metrics.requests += 1;
  
  // Track response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = performance.now() - start;
    
    // Record response time
    metrics.responseTime.push(duration);
    
    // Keep only last 1000 measurements
    if (metrics.responseTime.length > 1000) {
      metrics.responseTime.shift();
    }
    
    // Count errors
    if (res.statusCode >= 400) {
      metrics.errors += 1;
    }
    
    originalEnd.apply(res, args);
  };
  
  next();
}

// Endpoint to get metrics
function metricsEndpoint(req, res) {
  // Calculate average response time
  const avgResponseTime = metrics.responseTime.length > 0
    ? metrics.responseTime.reduce((sum, time) => sum + time, 0) / metrics.responseTime.length
    : 0;
  
  // Get latest memory usage
  const latestMemory = metrics.memoryUsage.length > 0
    ? metrics.memoryUsage[metrics.memoryUsage.length - 1]
    : { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 };
  
  // Return metrics
  res.json({
    uptime: process.uptime(),
    requests: metrics.requests,
    errors: metrics.errors,
    errorRate: metrics.requests > 0 ? metrics.errors / metrics.requests : 0,
    avgResponseTime,
    memory: latestMemory,
    cpuUsage: os.loadavg()[0], // 1 minute load average
    timestamp: Date.now()
  });
}

module.exports = {
  monitoringMiddleware,
  metricsEndpoint
};
```

Add the monitoring middleware to your Express app:

```javascript
const { monitoringMiddleware, metricsEndpoint } = require('./monitoring');

// Apply monitoring middleware
app.use(monitoringMiddleware);

// Add metrics endpoint (protected with basic auth)
app.get('/metrics', (req, res, next) => {
  // Basic auth check
  const auth = req.headers.authorization;
  if (!auth || auth !== `Basic ${process.env.METRICS_AUTH}`) {
    res.status(401).send('Unauthorized');
    return;
  }
  next();
}, metricsEndpoint);
```

## Conclusion

This document provides comprehensive guidance on implementing advanced GraphQL features, system-independent frontend architecture, and Replit deployment for HugMood. By leveraging these techniques, HugMood can deliver a robust, performant, and maintainable application across multiple platforms while ensuring a consistent user experience.