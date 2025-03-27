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

// Function to parse error messages from GraphQL client errors
function parseGraphQLErrors(errorString) {
  const errors = [];
  const errorLines = errorString.split('\n').filter(line => line.trim().length > 0);

  errorLines.forEach(line => {
    // Extract error message
    const messageMatch = line.match(/Message: (.+?)(?:,|$)/);
    if (messageMatch) {
      errors.push(messageMatch[1]);
    }
  });

  return errors;
}

// Function to generate schema updates based on errors
function generateSchemaUpdates(errors) {
  const schemaLines = ['# Schema Extensions to fix GraphQL errors\n'];
  let hasQueryExtensions = false;
  let hasInputExtensions = false;
  const queryExtensions = [];
  const inputExtensions = [];

  errors.forEach(error => {
    // Handle unknown argument errors
    if (error.includes('Unknown argument')) {
      const argMatch = error.match(/Unknown argument "([^"]+)" on field "([^"]+)\.([^"]+)"/);
      if (argMatch) {
        const [_, argName, typeName, fieldName] = argMatch;

        if (typeName === 'Query') {
          hasQueryExtensions = true;
          const comment = `  # Add ${argName} to ${fieldName} query`;

          // Determine appropriate type based on argument name
          let argType = 'String';
          if (argName === 'limit' || argName === 'offset') {
            argType = 'Int';
          } else if (argName === 'id') {
            argType = 'ID';
          } else if (argName.endsWith('Id')) {
            argType = 'ID';
          } else if (argName === 'filter' || argName.includes('filter')) {
            argType = 'JSON';
          }

          // Add field to Query type
          queryExtensions.push(
            `${comment}`,
            `  ${fieldName}(${argName}: ${argType})${fieldName.endsWith('s') ? ': [' + fieldName.slice(0, -1) + '!]!' : ': ' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + '!'}`
          );
        }
      }
    }

    // Handle type mismatch errors
    if (error.includes('of type') && error.includes('used in position expecting type')) {
      const typeMatch = error.match(/Variable "([^"]+)" of type "([^"]+)" used in position expecting type "([^"]+)"/);
      if (typeMatch) {
        const [_, varName, actualType, expectedType] = typeMatch;

        // Handle common type mismatches
        if (varName === '$limit' && actualType === 'Int' && expectedType === 'Float') {
          hasInputExtensions = true;
          inputExtensions.push(
            '# Fix type mismatch for limit parameter',
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
  });

  // Add Query type if we have extensions for it
  if (hasQueryExtensions) {
    schemaLines.push('type Query {');
    schemaLines.push(...queryExtensions);
    schemaLines.push('}\n');
  }

  // Add Input types if we have extensions for them
  if (hasInputExtensions) {
    schemaLines.push(...inputExtensions);
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