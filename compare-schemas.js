/**
 * Compare GraphQL Schemas
 * 
 * This utility script compares the PostGraphile generated schema with the client schema
 * to identify any inconsistencies or changes that need to be propagated.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const POSTGRAPHILE_SCHEMA_PATH = './postgraphile-schema.graphql';
const CLIENT_SCHEMA_PATH = './hugmenow/web/src/generated/schema.graphql';

/**
 * Load schema content from a file
 */
async function loadSchema(path) {
  try {
    const content = await fs.readFile(path, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error loading schema from ${path}:`, error.message);
    throw error;
  }
}

/**
 * Basic comparison of two schemas
 */
async function compareSchemas() {
  console.log('Basic Schema Comparison:');
  console.log('-----------------------');
  
  try {
    // Load schemas
    const postGraphileSchema = await loadSchema(POSTGRAPHILE_SCHEMA_PATH);
    const clientSchema = await loadSchema(CLIENT_SCHEMA_PATH);
    
    // Simple statistics
    const pgLines = postGraphileSchema.split('\n').length;
    const clientLines = clientSchema.split('\n').length;
    
    console.log(`PostGraphile Schema: ${pgLines} lines`);
    console.log(`Client Schema: ${clientLines} lines`);
    
    // Check for key entity types in both schemas
    const entityTypes = ['User', 'Mood', 'Hug', 'HugRequest', 'Friendship'];
    
    for (const type of entityTypes) {
      const pgTypeRegex = new RegExp(`(?:type|interface)\\s+${type}\\s+(?:implements|\\{)`, 'g');
      const clientTypeRegex = new RegExp(`(?:type|interface)\\s+${type}\\s+(?:implements|\\{)`, 'g');
      
      const pgHasType = pgTypeRegex.test(postGraphileSchema);
      const clientHasType = clientTypeRegex.test(clientSchema);
      
      console.log(`\nEntity type '${type}':`);
      console.log(`  PostGraphile Schema: ${pgHasType ? 'Present' : 'Missing'}`);
      console.log(`  Client Schema: ${clientHasType ? 'Present' : 'Missing'}`);
      
      if (pgHasType && clientHasType) {
        // For matching types, check field differences
        await compareType(type);
      }
    }
    
    return { pgLines, clientLines };
  } catch (error) {
    console.error('Schema comparison failed:', error.message);
    throw error;
  }
}

/**
 * Check if a specific type exists in both schemas and identify any differences
 */
async function compareType(typeName) {
  try {
    // Load schemas
    const postGraphileSchema = await loadSchema(POSTGRAPHILE_SCHEMA_PATH);
    const clientSchema = await loadSchema(CLIENT_SCHEMA_PATH);
    
    // Extract type definitions
    const pgTypeRegex = new RegExp(`type\\s+${typeName}\\s+(?:implements[^{]+)?{([^}]+)}`, 's');
    const clientTypeRegex = new RegExp(`type\\s+${typeName}\\s+(?:implements[^{]+)?{([^}]+)}`, 's');
    
    const pgTypeMatch = pgTypeRegex.exec(postGraphileSchema);
    const clientTypeMatch = clientTypeRegex.exec(clientSchema);
    
    if (!pgTypeMatch || !clientTypeMatch) {
      console.log(`  Cannot extract type definition for ${typeName} from one or both schemas`);
      return;
    }
    
    const pgTypeBody = pgTypeMatch[1].trim();
    const clientTypeBody = clientTypeMatch[1].trim();
    
    // Extract fields
    const pgFields = pgTypeBody.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    const clientFields = clientTypeBody.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    // Compare field counts
    console.log(`  Fields in PostGraphile: ${pgFields.length}`);
    console.log(`  Fields in Client: ${clientFields.length}`);
    
    // Extract field names for easier comparison
    const pgFieldNames = new Set(pgFields.map(field => field.split(':')[0].trim()));
    const clientFieldNames = new Set(clientFields.map(field => field.split(':')[0].trim()));
    
    // Fields only in PostGraphile
    const onlyInPg = [...pgFieldNames].filter(field => !clientFieldNames.has(field));
    if (onlyInPg.length > 0) {
      console.log(`  Fields only in PostGraphile: ${onlyInPg.join(', ')}`);
    }
    
    // Fields only in client
    const onlyInClient = [...clientFieldNames].filter(field => !pgFieldNames.has(field));
    if (onlyInClient.length > 0) {
      console.log(`  Fields only in Client: ${onlyInClient.join(', ')}`);
    }
    
    // Common fields with type differences
    const commonFields = [...pgFieldNames].filter(field => clientFieldNames.has(field));
    
    const fieldDifferences = [];
    for (const fieldName of commonFields) {
      const pgField = pgFields.find(f => f.startsWith(fieldName));
      const clientField = clientFields.find(f => f.startsWith(fieldName));
      
      if (pgField && clientField && pgField !== clientField) {
        fieldDifferences.push({
          field: fieldName,
          pgDefinition: pgField,
          clientDefinition: clientField
        });
      }
    }
    
    if (fieldDifferences.length > 0) {
      console.log(`  Fields with type differences:`);
      fieldDifferences.forEach(diff => {
        console.log(`    ${diff.field}:`);
        console.log(`      PostGraphile: ${diff.pgDefinition}`);
        console.log(`      Client: ${diff.clientDefinition}`);
      });
    } else {
      console.log(`  No type differences in common fields`);
    }
    
    return {
      onlyInPg,
      onlyInClient,
      fieldDifferences
    };
  } catch (error) {
    console.error(`Error comparing type ${typeName}:`, error.message);
    throw error;
  }
}

/**
 * Run all schema comparisons
 */
async function runComparisons() {
  try {
    console.log('Schema Comparison Tool');
    console.log('=====================\n');
    
    // Basic schema comparison
    await compareSchemas();
    
  } catch (error) {
    console.error('Schema comparison failed:', error.message);
  }
}

// Run the script if executed directly
runComparisons();