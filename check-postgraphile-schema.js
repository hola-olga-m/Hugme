/**
 * PostGraphile Schema Checker
 * 
 * This utility script checks the current PostgreSQL schema that PostGraphile is using,
 * providing details about available tables, views, functions, and relationships.
 */

import fetch from 'node-fetch';

// Configuration
const POSTGRAPHILE_URL = process.env.POSTGRAPHILE_URL || 'http://localhost:5000/postgraphile/graphql';

/**
 * Execute a GraphQL query against the PostGraphile API
 */
async function executePostGraphileQuery(query, variables = {}) {
  try {
    const response = await fetch(POSTGRAPHILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Error:', result.errors);
      throw new Error('GraphQL query failed');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error executing GraphQL query:', error.message);
    throw error;
  }
}

/**
 * Get introspection data from the GraphQL schema
 */
async function getSchemaIntrospection() {
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        queryType { name }
        mutationType { name }
        types {
          name
          kind
          description
          fields(includeDeprecated: true) {
            name
            description
            args {
              name
              description
              type {
                name
                kind
              }
              defaultValue
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
  
  const data = await executePostGraphileQuery(introspectionQuery);
  return data.__schema;
}

/**
 * Get all available tables in the PostgreSQL schema
 */
async function getPostgresqlTables() {
  console.log('Fetching PostgreSQL Tables:');
  console.log('---------------------------');
  
  // Find object types that represent database tables
  const schema = await getSchemaIntrospection();
  
  const tables = schema.types.filter(type => {
    // Skip GraphQL introspection types and connection types
    if (type.name.startsWith('__') || 
        type.name.endsWith('Connection') || 
        type.name.endsWith('Edge') ||
        type.name === 'Query' || 
        type.name === 'Mutation' ||
        type.kind !== 'OBJECT') {
      return false;
    }
    
    // Only include entity tables (those with nodeId which indicates they're from the DB)
    if (type.fields) {
      return type.fields.some(field => field.name === 'nodeId');
    }
    
    return false;
  });
  
  console.log(`Found ${tables.length} tables in the PostgreSQL schema:\n`);
  
  for (const table of tables) {
    console.log(`Table: ${table.name}`);
    if (table.description) {
      console.log(`Description: ${table.description}`);
    }
    
    if (table.fields) {
      console.log('Fields:');
      table.fields.forEach(field => {
        const typeName = field.type.name || 
                        (field.type.ofType && field.type.ofType.name) || 
                        'Complex Type';
        
        const isNonNull = field.type.kind === 'NON_NULL';
        const fieldDescription = field.description ? ` - ${field.description}` : '';
        
        console.log(`  ${field.name}: ${typeName}${isNonNull ? '!' : ''}${fieldDescription}`);
      });
    }
    
    console.log('\n');
  }
  
  return tables;
}

/**
 * Get root query fields (main entry points to the API)
 */
async function getRootQueryFields() {
  console.log('Fetching Root Query Fields:');
  console.log('--------------------------');
  
  const schema = await getSchemaIntrospection();
  const queryType = schema.types.find(type => type.name === schema.queryType.name);
  
  if (!queryType || !queryType.fields) {
    console.log('No query fields found.');
    return [];
  }
  
  console.log(`Found ${queryType.fields.length} root query fields:\n`);
  
  queryType.fields.forEach(field => {
    const returnType = field.type.name || 
                      (field.type.ofType && field.type.ofType.name) || 
                      'Complex Type';
    
    const args = field.args.length > 0 
      ? `(${field.args.map(arg => `${arg.name}: ${arg.type.name || 'Complex Type'}`).join(', ')})`
      : '';
    
    console.log(`${field.name}${args}: ${returnType}`);
    if (field.description) {
      console.log(`  Description: ${field.description}`);
    }
    console.log('');
  });
  
  return queryType.fields;
}

/**
 * Run all schema checks
 */
async function runSchemaChecks() {
  try {
    console.log('PostGraphile Schema Checker');
    console.log('============================\n');
    
    // Get tables
    await getPostgresqlTables();
    
    console.log('============================\n');
    
    // Get root query fields
    await getRootQueryFields();
    
  } catch (error) {
    console.error('Schema check failed:', error.message);
  }
}

// Run the script if executed directly
runSchemaChecks();