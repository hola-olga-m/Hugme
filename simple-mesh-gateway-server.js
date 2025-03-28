/**
 * Simple GraphQL Mesh Gateway Server
 * 
 * This is a simplified version that doesn't use the complex Mesh configuration,
 * making it more reliable for demonstration purposes.
 */

import express from 'express';
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchSchemas } from '@graphql-tools/stitch';
import { wrapSchema } from '@graphql-tools/wrap';
import fetch from 'cross-fetch';
import { buildClientSchema, getIntrospectionQuery, print } from 'graphql';
import cors from 'cors';
import chalk from 'chalk';

// Configuration
const PORT = process.env.PORT || 5006;
const API_ENDPOINT = 'http://localhost:3003/postgraphile/graphql';

console.log(chalk.blue('🔍 Starting Simple Mesh Gateway Server...'));
console.log(chalk.blue(`🔗 Connecting to API at ${API_ENDPOINT}`));
console.log(chalk.blue(`🚀 Server will run at http://0.0.0.0:${PORT}/graphql`));

// Define the live query directive
const liveQueryDirectiveTypeDefs = `
  directive @live on QUERY
`;

// Client Information type
const clientInfoTypeDefs = `
  type ClientInfo {
    version: String!
    buildDate: String!
    platform: String
    deviceInfo: String
    features: [String]
  }

  extend type Query {
    clientInfo: ClientInfo!
  }
`;

// Client information resolver
const clientInfoResolvers = {
  Query: {
    clientInfo: () => ({
      version: process.env.CLIENT_VERSION || '2.0.0',
      buildDate: new Date().toISOString(),
      platform: process.env.CLIENT_PLATFORM || 'web',
      deviceInfo: 'Simple Mesh Gateway',
      features: (process.env.CLIENT_FEATURES || 'live-queries,mood-tracking').split(',')
    })
  }
};

// Create a remote executor for the PostGraphile API
const createRemoteExecutor = async () => {
  console.log(chalk.blue('🔗 Creating remote executor for PostGraphile API...'));
  
  return async ({ document, variables, context }) => {
    // Add authentication if available
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (context?.headers?.authorization) {
      headers['Authorization'] = context.headers.authorization;
    }
    
    try {
      const query = print(document);
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error executing remote query:', error);
      throw error;
    }
  };
};

// Start the server
async function startServer() {
  try {
    // Create remote executor
    const executor = await createRemoteExecutor();
    
    // Introspect the PostGraphile schema
    console.log(chalk.green('📊 Introspecting PostGraphile schema...'));
    // Custom introspection logic
    const introspectionResult = await executor({
      document: {
        kind: 'Document',
        definitions: [
          {
            kind: 'OperationDefinition',
            operation: 'query',
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: '__schema',
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'types',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'kind',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'name',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'description',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'fields',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'name',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'description',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'args',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'name',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'description',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'type',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'kind',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'name',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'ofType',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'kind',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'name',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'ofType',
                                                      },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'kind',
                                                            },
                                                          },
                                                          {
                                                            kind: 'Field',
                                                            name: {
                                                              kind: 'Name',
                                                              value: 'name',
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'type',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'kind',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'name',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'ofType',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'kind',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'name',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'ofType',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'kind',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'name',
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'interfaces',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'kind',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'name',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'enumValues',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'name',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'description',
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'queryType',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'name',
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'mutationType',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'name',
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'subscriptionType',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'name',
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'directives',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'name',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'description',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'locations',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'args',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'name',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'description',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'type',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'kind',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'name',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'ofType',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'kind',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'name',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'ofType',
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'kind',
                                                      },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: {
                                                        kind: 'Name',
                                                        value: 'name',
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    });
    
    if (!introspectionResult?.data?.__schema) {
      console.error(chalk.red('❌ Failed to introspect schema:'), introspectionResult?.errors || 'No schema data received');
      throw new Error('Schema introspection failed');
    }
    
    // Build a schema from the introspection result
    const schema = buildClientSchema(introspectionResult.data);
    
    // Create a stitched schema that combines:
    // 1. The remote PostGraphile schema
    // 2. The live query directive
    // 3. Local client info type and resolvers
    console.log(chalk.green('🔄 Stitching schemas together...'));
    const gatewaySchema = stitchSchemas({
      subschemas: [
        { schema, executor }
      ],
      typeDefs: [
        liveQueryDirectiveTypeDefs,
        clientInfoTypeDefs
      ],
      resolvers: clientInfoResolvers
    });
    
    // Create Express app
    const app = express();
    app.use(cors());
    
    // Create Yoga server (modern GraphQL server that supports @live directive)
    const yoga = createYoga({
      schema: gatewaySchema,
      context: (req) => ({
        // Pass request headers to the executor
        headers: req.request.headers
      }),
      graphqlEndpoint: '/graphql',
      landingPage: true,
      maskedErrors: false,
      graphiql: {
        title: 'HugMeNow Simple Mesh Gateway',
        defaultQuery: `# Welcome to HugMeNow GraphQL API
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
      console.log(chalk.green(`✅ Simple Mesh Gateway running at http://0.0.0.0:${PORT}/graphql`));
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