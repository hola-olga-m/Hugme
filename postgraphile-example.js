/**
 * PostGraphile Example
 * 
 * This script demonstrates how to interact with the PostGraphile GraphQL API
 * programmatically from your Node.js application.
 */

import fetch from 'node-fetch';

// Configuration
const POSTGRAPHILE_URL = process.env.POSTGRAPHILE_URL || 'http://localhost:5000/postgraphile/graphql';

/**
 * Execute a GraphQL query against the PostGraphile API
 * @param {string} query - The GraphQL query string
 * @param {Object} variables - Variables for the GraphQL query (optional)
 * @returns {Promise<Object>} The query results
 */
async function executePostGraphileQuery(query, variables = {}) {
  try {
    console.log(`Executing PostGraphile query: ${query.split('\n')[0]}...`);
    
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
 * Example: Get schema information - this doesn't rely on specific GraphQL types
 * which may cause version conflicts
 */
async function getSchemaInfo() {
  const query = `
    query IntrospectionQuery {
      __schema {
        queryType {
          name
        }
        mutationType {
          name
        }
        types {
          name
          kind
          description
        }
      }
    }
  `;
  
  try {
    const data = await executePostGraphileQuery(query);
    console.log('Schema Info:');
    console.log('- Query Type:', data.__schema.queryType.name);
    console.log('- Mutation Type:', data.__schema.mutationType.name);
    
    // Count types by kind
    const typesByKind = data.__schema.types.reduce((acc, type) => {
      if (!type.name.startsWith('__')) { // Skip introspection types
        acc[type.kind] = (acc[type.kind] || 0) + 1;
      }
      return acc;
    }, {});
    
    console.log('- Types by kind:');
    Object.entries(typesByKind).forEach(([kind, count]) => {
      console.log(`  ${kind}: ${count}`);
    });
    
    // List important entity types
    const entityTypes = data.__schema.types.filter(
      type => ['User', 'Mood', 'Hug', 'Friendship', 'HugRequest'].includes(type.name)
    );
    
    console.log('- Entity Types:');
    entityTypes.forEach(type => {
      console.log(`  ${type.name} (${type.kind})${type.description ? ': ' + type.description : ''}`);
    });
    
    return data.__schema;
  } catch (error) {
    console.error('Error fetching schema info:', error.message);
    throw error;
  }
}

/**
 * Example: Get query fields - using introspection to avoid type conflicts
 */
async function getQueryFields() {
  const query = `
    query GetQueryFields {
      __type(name: "Query") {
        name
        fields {
          name
          description
          type {
            name
            kind
          }
        }
      }
    }
  `;
  
  try {
    const data = await executePostGraphileQuery(query);
    console.log('Query Fields:');
    
    const fields = data.__type.fields;
    // Only show a subset to keep the output manageable
    const sampleFields = fields.slice(0, 5);
    
    sampleFields.forEach(field => {
      console.log(`- ${field.name}: ${field.type.name || field.type.kind}`);
      if (field.description) {
        console.log(`  Description: ${field.description}`);
      }
    });
    
    console.log(`...and ${fields.length - 5} more fields`);
    
    return fields;
  } catch (error) {
    console.error('Error fetching query fields:', error.message);
    throw error;
  }
}

/**
 * Example: Get type details - using introspection to avoid type conflicts
 */
async function getTypeDetails(typeName) {
  const query = `
    query GetTypeDetails($typeName: String!) {
      __type(name: $typeName) {
        name
        kind
        description
        fields {
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
      }
    }
  `;
  
  try {
    const data = await executePostGraphileQuery(query, { typeName });
    
    if (!data.__type) {
      throw new Error(`Type '${typeName}' not found in schema`);
    }
    
    console.log(`Type Details for '${typeName}':`);
    console.log(`- Kind: ${data.__type.kind}`);
    if (data.__type.description) {
      console.log(`- Description: ${data.__type.description}`);
    }
    
    if (data.__type.fields) {
      console.log(`- Fields (${data.__type.fields.length}):`);
      data.__type.fields.forEach(field => {
        const typeName = field.type.name || 
                        (field.type.ofType && field.type.ofType.name) || 
                        field.type.kind;
        console.log(`  ${field.name}: ${typeName}`);
      });
    }
    
    return data.__type;
  } catch (error) {
    console.error(`Error fetching details for type '${typeName}':`, error.message);
    throw error;
  }
}

/**
 * Example: Create a new mood entry
 */
async function createMood(moodData) {
  const mutation = `
    mutation CreateMood($input: CreateMoodInput!) {
      createMood(input: $input) {
        mood {
          id
          score
          note
          isPublic
          userId
          createdAt
        }
      }
    }
  `;
  
  try {
    const data = await executePostGraphileQuery(mutation, { input: { mood: moodData } });
    console.log('Created mood:', JSON.stringify(data.createMood.mood, null, 2));
    return data.createMood.mood;
  } catch (error) {
    console.error('Error creating mood:', error.message);
    throw error;
  }
}

/**
 * Example: Send a hug to a user
 */
async function sendHug(hugData) {
  const mutation = `
    mutation SendHug($input: CreateHugInput!) {
      createHug(input: $input) {
        hug {
          id
          type
          message
          senderId
          recipientId
          isRead
          createdAt
        }
      }
    }
  `;
  
  try {
    const data = await executePostGraphileQuery(mutation, { input: { hug: hugData } });
    console.log('Sent hug:', JSON.stringify(data.createHug.hug, null, 2));
    return data.createHug.hug;
  } catch (error) {
    console.error('Error sending hug:', error.message);
    throw error;
  }
}

/**
 * Run the example application
 */
async function runExample() {
  try {
    console.log("PostGraphile Example Application");
    console.log("===============================");
    
    // Get all users
    console.log("\n📊 Fetching all users...");
    const users = await getAllUsers();
    
    if (users.length === 0) {
      console.log("No users found in the database.");
      return;
    }
    
    // Use the first user for further examples
    const exampleUserId = users[0].id;
    console.log(`\n🔍 Using user ${users[0].name} (${exampleUserId}) for examples`);
    
    // Get user by ID
    console.log("\n🧑 Fetching user details...");
    await getUserById(exampleUserId);
    
    // Get moods for the user
    console.log("\n😊 Fetching user's mood history...");
    await getMoodsForUser(exampleUserId);
    
    // Create a new mood (commented out to avoid modifying the database)
    /*
    console.log("\n➕ Creating a new mood entry...");
    const newMood = {
      score: 8,
      note: "Feeling great today!",
      isPublic: true,
      userId: exampleUserId,
    };
    await createMood(newMood);
    */
    
    // Send a hug (commented out to avoid modifying the database)
    /*
    console.log("\n🤗 Sending a hug...");
    // Make sure we have at least two users
    if (users.length > 1) {
      const recipientId = users[1].id;
      const newHug = {
        type: "SUPPORTIVE",
        message: "Hang in there!",
        senderId: exampleUserId,
        recipientId,
        isRead: false,
      };
      await sendHug(newHug);
    } else {
      console.log("Need at least two users to demonstrate sending a hug.");
    }
    */
    
    console.log("\n✅ Example completed successfully!");
  } catch (error) {
    console.error("❌ Example failed:", error.message);
  }
}

// Run the example if this script is executed directly
runExample();