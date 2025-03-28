/**
 * Direct Apollo Server for HugMeNow API
 * A simplified GraphQL gateway that proxies requests to the PostGraphile API
 */

const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { buildSchema, printSchema } = require('graphql');
const { fetch } = require('cross-fetch');
const fs = require('fs');
const path = require('path');

// Config
const PORT = process.env.PORT || 5001;
const API_ENDPOINT = process.env.GRAPHQL_API_ENDPOINT || 'http://localhost:3003/graphql';

// Load schema from the downloaded PostGraphile schema
let typeDefs = '';
try {
  const schemaPath = path.join(__dirname, 'postgraphile-schema.graphql');
  if (fs.existsSync(schemaPath)) {
    typeDefs = fs.readFileSync(schemaPath, 'utf8');
    console.log('📝 Loaded schema from postgraphile-schema.graphql');
  } else {
    console.error('❌ Schema file not found! Please run the download-postgraphile-schema.js script first');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Error loading schema:', err);
  process.exit(1);
}

// Define custom resolvers that proxy requests to the API
const resolvers = {
  Query: {
    // Client information resolver
    clientInfo: () => {
      console.log('Resolving: Query.clientInfo');
      return {
        version: process.env.CLIENT_VERSION || '1.0.0',
        buildDate: new Date().toISOString(),
        platform: process.env.CLIENT_PLATFORM || 'web',
        features: (process.env.CLIENT_FEATURES || 'mood-tracking,friend-moods').split(',')
      };
    },
    
    // Generic resolver that forwards all other queries to the API
    __forward: {
      async resolve(parent, args, context, info) {
        const fieldName = info.fieldName;
        if (fieldName === 'clientInfo') return undefined;
        
        console.log(`Proxying: Query.${fieldName}`);
        const query = `query ${fieldName}Query($input: ${fieldName}Input) {
          ${fieldName}(input: $input) {
            nodes {
              id
              # Add other fields here as needed
            }
          }
        }`;
        
        try {
          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': context.token || ''
            },
            body: JSON.stringify({ query, variables: { input: args } })
          });
          
          const result = await response.json();
          if (result.errors) {
            console.error(`Error in ${fieldName}:`, result.errors);
            throw new Error(result.errors[0].message);
          }
          
          return result.data[fieldName];
        } catch (error) {
          console.error(`Error proxying ${fieldName}:`, error);
          throw error;
        }
      }
    }
  },
  
  Mutation: {
    // Generic resolver that forwards all mutations to the API
    __forward: {
      async resolve(parent, args, context, info) {
        const fieldName = info.fieldName;
        console.log(`Proxying: Mutation.${fieldName}`);
        
        const query = `mutation ${fieldName}Mutation($input: ${fieldName}Input!) {
          ${fieldName}(input: $input) {
            # Add expected return fields
            clientMutationId
          }
        }`;
        
        try {
          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': context.token || ''
            },
            body: JSON.stringify({ query, variables: { input: args.input } })
          });
          
          const result = await response.json();
          if (result.errors) {
            console.error(`Error in ${fieldName}:`, result.errors);
            throw new Error(result.errors[0].message);
          }
          
          return result.data[fieldName];
        } catch (error) {
          console.error(`Error proxying ${fieldName}:`, error);
          throw error;
        }
      }
    }
  }
};

// Add client-specific type definitions
const clientTypeDefs = `
  type ClientInfo {
    version: String!
    buildDate: String!
    platform: String
    features: [String]
  }
  
  extend type Query {
    clientInfo: ClientInfo!
  }
`;

// Create a schema that includes both the PostGraphile schema and client extensions
const schema = makeExecutableSchema({
  typeDefs: [typeDefs, clientTypeDefs],
  resolvers,
});

// Create and start the Apollo Server
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    // Extract auth token from request headers
    const token = req?.headers?.authorization || '';
    return { token };
  },
  introspection: true,
  playground: true,
});

// Start the server
server.listen({ port: PORT, host: '0.0.0.0' }).then(({ url }) => {
  console.log(`🚀 Apollo Server running at ${url}`);
  console.log(`Proxying GraphQL requests to ${API_ENDPOINT}`);
});