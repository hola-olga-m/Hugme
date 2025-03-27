import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = 'http://localhost:3002/graphql';

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

async function getFullSchema() {
  const query = `
    query IntrospectionQuery {
      __schema {
        queryType {
          name
          fields {
            name
            description
            args {
              name
              description
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
        mutationType {
          name
          fields {
            name
            description
            args {
              name
              description
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
        types {
          name
          kind
          description
          fields {
            name
            description
            args {
              name
              description
              defaultValue
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
            type {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    }
  `;
  
  const result = await executeGraphQL(query);
  
  if (result.errors) {
    console.error('Failed to fetch schema:', result.errors);
    return null;
  }
  
  return result.data.__schema;
}

async function analyzeSchema() {
  console.log('Fetching and analyzing GraphQL schema...');
  
  const schema = await getFullSchema();
  
  if (!schema) {
    console.log('Failed to fetch schema');
    return;
  }
  
  // Extract Query type fields
  console.log('\n======= QUERIES AVAILABLE =======');
  const queryFields = schema.queryType.fields;
  queryFields.forEach(field => {
    const args = field.args.map(arg => `${arg.name}: ${formatType(arg.type)}`).join(', ');
    console.log(`${field.name}(${args}): ${formatType(field.type)}${field.description ? ` - ${field.description}` : ''}`);
  });
  
  // Extract Mutation type fields
  console.log('\n======= MUTATIONS AVAILABLE =======');
  const mutationFields = schema.mutationType.fields;
  mutationFields.forEach(field => {
    const args = field.args.map(arg => `${arg.name}: ${formatType(arg.type)}`).join(', ');
    console.log(`${field.name}(${args}): ${formatType(field.type)}${field.description ? ` - ${field.description}` : ''}`);
  });
  
  // Find Mood-related types
  console.log('\n======= MOOD-RELATED FIELDS =======');
  const moodType = schema.types.find(type => type.name === 'Mood');
  if (moodType && moodType.fields) {
    console.log('Mood fields:');
    moodType.fields.forEach(field => {
      console.log(`  ${field.name}: ${formatType(field.type)}`);
    });
  }
  
  // Find User-related types
  console.log('\n======= USER-RELATED FIELDS =======');
  const userType = schema.types.find(type => type.name === 'User');
  if (userType && userType.fields) {
    console.log('User fields:');
    userType.fields.forEach(field => {
      console.log(`  ${field.name}: ${formatType(field.type)}`);
    });
  }
  
  // Find Hug-related types
  console.log('\n======= HUG-RELATED FIELDS =======');
  const hugType = schema.types.find(type => type.name === 'Hug');
  if (hugType && hugType.fields) {
    console.log('Hug fields:');
    hugType.fields.forEach(field => {
      console.log(`  ${field.name}: ${formatType(field.type)}`);
    });
  }
  
  // Find input types
  console.log('\n======= INPUT TYPES =======');
  const inputTypes = schema.types.filter(type => type.kind === 'INPUT_OBJECT');
  inputTypes.forEach(type => {
    console.log(`${type.name}:`);
    if (type.fields) {
      type.fields.forEach(field => {
        console.log(`  ${field.name}: ${formatType(field.type)}`);
      });
    }
  });
}

function formatType(type) {
  if (!type) return 'Unknown';
  
  if (type.kind === 'NON_NULL') {
    if (type.ofType && type.ofType.kind === 'LIST') {
      if (type.ofType.ofType) {
        return `[${type.ofType.ofType.name || formatType(type.ofType.ofType)}]!`;
      }
      return '[Unknown]!';
    }
    return `${type.ofType ? (type.ofType.name || formatType(type.ofType)) : 'Unknown'}!`;
  } else if (type.kind === 'LIST') {
    if (type.ofType) {
      return `[${type.ofType.name || formatType(type.ofType)}]`;
    }
    return '[Unknown]';
  }
  return type.name || 'Unknown';
}

async function loginAndAnalyze() {
  // Try to login first to get full schema access
  const loginQuery = `
    mutation {
      login(loginInput: {
        email: "testuser@example.com",
        password: "Password123"
      }) {
        accessToken
      }
    }
  `;
  
  const loginResult = await executeGraphQL(loginQuery);
  
  let token = null;
  if (loginResult.data && loginResult.data.login) {
    token = loginResult.data.login.accessToken;
    console.log('Logged in successfully, using authenticated schema access');
  } else {
    console.log('Login failed, using public schema access');
  }
  
  // Analyze schema with token if available
  await analyzeSchema(token);
}

loginAndAnalyze();