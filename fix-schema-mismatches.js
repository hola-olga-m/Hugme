
#!/usr/bin/env node

/**
 * GraphQL Schema Mismatch Fixer
 * 
 * This script analyzes GraphQL errors and generates schema fixes
 * to resolve common issues like missing parameters, type mismatches,
 * and other schema inconsistencies.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SCHEMA_UPDATES_PATH = './schema-updates.graphql';
const BACKUP_SCHEMA_PATH = './backup/schema.graphql';

// Function to parse error messages from GraphQL client errors
function parseGraphQLErrors(errorString) {
  const errors = [];
  const errorLines = errorString.split('\n').filter(line => line.trim().length > 0);

  errorLines.forEach(line => {
    // Extract error message
    const messageMatch = line.match(/Message: (.+?)(?:,|$)/);
    if (messageMatch) {
      errors.push(messageMatch[1].trim());
    }
  });

  return errors;
}

// Function to generate schema updates based on errors
function generateSchemaUpdates(errors) {
  console.log(`Found ${errors.length} GraphQL errors to analyze...`);
  
  // Read existing schema updates
  let existingSchema = '';
  try {
    existingSchema = fs.readFileSync(SCHEMA_UPDATES_PATH, 'utf8');
  } catch (err) {
    console.log('No existing schema updates found, creating new file');
  }

  // Read backup schema to understand base types
  let backupSchema = '';
  try {
    backupSchema = fs.readFileSync(BACKUP_SCHEMA_PATH, 'utf8');
  } catch (err) {
    console.log('Warning: Backup schema not found. Type inference may be limited.');
  }

  const schemaLines = ['# Schema extensions to fix the GraphQL errors\n'];
  let hasQueryExtensions = false;
  let hasInputExtensions = false;
  let hasTypeExtensions = false;
  
  const queryExtensions = [];
  const inputExtensions = [];
  const typeExtensions = [];
  const processedErrors = new Set();

  // Track all field names to avoid duplicates
  const fieldNames = new Set();

  // Extract existing field names from schema
  if (existingSchema) {
    const fieldMatch = existingSchema.match(/\s+(\w+)(?:\(.+?\))?:/g);
    if (fieldMatch) {
      fieldMatch.forEach(match => {
        const fieldName = match.trim().split('(')[0].replace(':', '');
        fieldNames.add(fieldName);
      });
    }
  }

  errors.forEach(error => {
    // Skip if we've already processed this exact error
    if (processedErrors.has(error)) return;
    processedErrors.add(error);
    
    // Handle unknown argument errors
    if (error.includes('Unknown argument')) {
      const argMatch = error.match(/Unknown argument "([^"]+)" on field "([^"]+)\.([^"]+)"/);
      if (argMatch) {
        const [_, argName, typeName, fieldName] = argMatch;

        if (typeName === 'Query' && !fieldNames.has(fieldName)) {
          hasQueryExtensions = true;
          fieldNames.add(fieldName);
          const comment = `  # Add ${argName} to ${fieldName} query`;

          // Determine appropriate type based on argument name
          let argType = 'String';
          if (argName === 'limit' || argName === 'offset') {
            argType = 'Int';
          } else if (argName === 'id' || argName.endsWith('Id')) {
            argType = 'ID';
          } else if (argName === 'filter' || argName.includes('filter')) {
            argType = 'JSON';
          } else if (argName === 'search') {
            argType = 'String';
          }

          // Add field to Query type
          let returnType;
          if (fieldName.endsWith('s')) {
            returnType = `[${fieldName.slice(0, -1)}!]!`;
          } else {
            returnType = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}!`;
          }
          
          // Check if the field already has other args in the existing schema
          const existingArgs = {};
          const existingArgsMatch = existingSchema.match(new RegExp(`${fieldName}\\(([^)]+)\\)`));
          if (existingArgsMatch) {
            const args = existingArgsMatch[1].split(',');
            args.forEach(arg => {
              const [name, type] = arg.trim().split(':');
              if (name && type && name !== argName) {
                existingArgs[name.trim()] = type.trim();
              }
            });
          }
          
          // Combine new arg with existing args
          let argsStr = `${argName}: ${argType}`;
          for (const [name, type] of Object.entries(existingArgs)) {
            argsStr += `, ${name}: ${type}`;
          }
          
          queryExtensions.push(
            `${comment}`,
            `  ${fieldName}(${argsStr}): ${returnType}`
          );
        }
      }
    }

    // Handle type mismatch errors
    if (error.includes('of type') && error.includes('used in position expecting type')) {
      const typeMatch = error.match(/Variable "([^"]+)" of type "([^"]+)" used in position expecting type "([^"]+)"/);
      if (typeMatch) {
        const [_, varName, actualType, expectedType] = typeMatch;
        hasInputExtensions = true;

        // Handle common type mismatches
        if ((varName === '$limit' || varName === '$offset') && 
            (actualType === 'Int' && (expectedType === 'Float' || expectedType.includes('Int')))) {
          
          // Add pagination input types if not already added
          if (!inputExtensions.includes('input MoodsPaginationInput {')) {
            inputExtensions.push(
              '# Fix type mismatch for pagination parameters',
              'input MoodsPaginationInput {',
              '  limit: Int',
              '  offset: Int',
              '}',
              '',
              'input UsersPaginationInput {',
              '  limit: Int',
              '  offset: Int',
              '}',
              '',
              'input HugsPaginationInput {',
              '  limit: Int',
              '  offset: Int',
              '}'
            );
          }
        }
      }
    }
    
    // Handle missing fields errors
    if (error.includes('Cannot query field')) {
      const fieldMatch = error.match(/Cannot query field "([^"]+)" on type "([^"]+)"/);
      if (fieldMatch) {
        const [_, fieldName, typeName] = fieldMatch;
        
        if (typeName === 'Query' && !fieldNames.has(fieldName)) {
          hasQueryExtensions = true;
          fieldNames.add(fieldName);
          
          // Determine return type based on field name
          let returnType;
          if (fieldName.endsWith('s')) {
            returnType = `[${fieldName.slice(0, -1)}!]!`;
          } else if (fieldName === 'me') {
            returnType = 'User!';
          } else if (fieldName === 'moodStreak') {
            returnType = 'Int!';
          } else if (fieldName.startsWith('check') || fieldName.startsWith('is')) {
            returnType = 'Boolean!';
          } else {
            returnType = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}!`;
          }
          
          queryExtensions.push(
            `  # Add ${fieldName} query`,
            `  ${fieldName}: ${returnType}`
          );
        }
      }
    }
  });

  // Add Query type if we have extensions for it
  if (hasQueryExtensions && queryExtensions.length > 0) {
    schemaLines.push('type Query {');
    schemaLines.push(...queryExtensions);
    schemaLines.push('}\n');
  }

  // Add Input types if we have extensions for them
  if (hasInputExtensions && inputExtensions.length > 0) {
    schemaLines.push(...inputExtensions);
    schemaLines.push('');
  }

  // Add custom types if needed
  if (!existingSchema.includes('type Friendship')) {
    schemaLines.push('# Add Friendship type if missing');
    schemaLines.push('type Friendship {');
    schemaLines.push('  id: ID!');
    schemaLines.push('  status: String!');
    schemaLines.push('  requesterId: ID!');
    schemaLines.push('  requester: User');
    schemaLines.push('  addresseeId: ID!');
    schemaLines.push('  addressee: User');
    schemaLines.push('  createdAt: DateTime');
    schemaLines.push('  updatedAt: DateTime');
    schemaLines.push('}');
    schemaLines.push('');
  }

  if (!existingSchema.includes('type HugRequest')) {
    schemaLines.push('# Add HugRequest type if missing');
    schemaLines.push('type HugRequest {');
    schemaLines.push('  id: ID!');
    schemaLines.push('  senderId: ID!');
    schemaLines.push('  sender: User');
    schemaLines.push('  message: String');
    schemaLines.push('  status: String!');
    schemaLines.push('  isPublic: Boolean');
    schemaLines.push('  createdAt: DateTime');
    schemaLines.push('  updatedAt: DateTime');
    schemaLines.push('}');
    schemaLines.push('');
  }

  // Add DateTime scalar if needed
  if (!existingSchema.includes('scalar DateTime')) {
    schemaLines.push('# Define DateTime scalar if missing');
    schemaLines.push('scalar DateTime');
  }

  return schemaLines.join('\n');
}

// Main function
function fixSchemaMismatches(errorString) {
  console.log('🔍 Analyzing GraphQL errors...');

  // Parse error messages from input string
  const errors = parseGraphQLErrors(errorString);

  if (errors.length === 0) {
    console.log('✅ No GraphQL errors detected');
    return;
  }

  console.log(`📊 Found ${errors.length} distinct GraphQL errors`);

  // Generate schema updates
  const schemaUpdates = generateSchemaUpdates(errors);

  // Write schema updates to file
  fs.writeFileSync(SCHEMA_UPDATES_PATH, schemaUpdates);

  console.log(`✅ Schema updates written to ${SCHEMA_UPDATES_PATH}`);
  console.log('📝 Next steps:');
  console.log('  1. Review the generated schema updates');
  console.log('  2. Run the schema sync tool to apply changes');
  console.log('  3. Restart your application to apply the updated schema');
}

// If called directly
if (require.main === module) {
  const errorString = process.argv[2] || '';
  fixSchemaMismatches(errorString);
}

module.exports = { fixSchemaMismatches };
