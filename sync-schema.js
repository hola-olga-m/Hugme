
// GraphQL Schema Synchronization Tool

/**
 * GraphQL Schema Synchronization Tool
 * 
 * This script combines schema updates with the existing schema
 * and applies them to both the server and client configurations.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const SCHEMA_UPDATES_PATH = './schema-updates.graphql';
const API_SCHEMA_PATH = './hugmenow/api/src/graphql/schema.graphql';
const CLIENT_SCHEMA_PATH = './hugmenow/web/src/graphql/schema.graphql';
const WEB_CODEGEN_PATH = './hugmenow/web/codegen.yml';
const API_CODEGEN_PATH = './hugmenow/api/codegen.yml';

function syncSchema() {
  console.log('🔄 Starting GraphQL schema synchronization...');

  // Check if schema updates file exists
  if (!fs.existsSync(SCHEMA_UPDATES_PATH)) {
    console.log('❌ Schema updates file not found. Run fix-schema-mismatches.js first.');
    return false;
  }

  // Read schema updates
  const schemaUpdates = fs.readFileSync(SCHEMA_UPDATES_PATH, 'utf8');
  if (!schemaUpdates.trim()) {
    console.log('⚠️ Schema updates file is empty, nothing to sync.');
    return false;
  }

  console.log('✅ Found schema updates');

  // Sync to API schema
  let apiSyncResult = true;
  if (fs.existsSync(API_SCHEMA_PATH)) {
    try {
      console.log(`📝 Updating API schema at ${API_SCHEMA_PATH}`);
      
      // Read existing API schema
      let apiSchema = fs.readFileSync(API_SCHEMA_PATH, 'utf8');
      
      // Append schema updates, avoiding duplicates
      const updatedApiSchema = mergeSchemas(apiSchema, schemaUpdates);
      
      // Write updated schema
      fs.writeFileSync(API_SCHEMA_PATH, updatedApiSchema);
      console.log('✅ API schema updated successfully');
    } catch (error) {
      console.error('❌ Failed to update API schema:', error.message);
      apiSyncResult = false;
    }
  } else {
    console.log('⚠️ API schema file not found, skipping API schema update');
  }

  // Sync to client schema
  let clientSyncResult = true;
  if (fs.existsSync(CLIENT_SCHEMA_PATH)) {
    try {
      console.log(`📝 Updating client schema at ${CLIENT_SCHEMA_PATH}`);
      
      // Read existing client schema
      let clientSchema = fs.readFileSync(CLIENT_SCHEMA_PATH, 'utf8');
      
      // Append schema updates, avoiding duplicates
      const updatedClientSchema = mergeSchemas(clientSchema, schemaUpdates);
      
      // Write updated schema
      fs.writeFileSync(CLIENT_SCHEMA_PATH, updatedClientSchema);
      console.log('✅ Client schema updated successfully');
    } catch (error) {
      console.error('❌ Failed to update client schema:', error.message);
      clientSyncResult = false;
    }
  } else {
    console.log('⚠️ Client schema file not found, skipping client schema update');
  }

  // Run codegen if needed
  if (apiSyncResult || clientSyncResult) {
    try {
      console.log('🔄 Running GraphQL codegen to update types...');
      
      if (fs.existsSync(WEB_CODEGEN_PATH)) {
        console.log('Generating web types...');
        execSync('cd hugmenow/web && npx graphql-codegen', { stdio: 'inherit' });
      }
      
      if (fs.existsSync(API_CODEGEN_PATH)) {
        console.log('Generating API types...');
        execSync('cd hugmenow/api && npx graphql-codegen', { stdio: 'inherit' });
      }
      
      console.log('✅ GraphQL types generated successfully');
    } catch (error) {
      console.error('⚠️ Failed to run GraphQL codegen:', error.message);
      console.log('You may need to run codegen manually');
    }
  }

  console.log('✅ Schema synchronization completed');
  return apiSyncResult || clientSyncResult;
}

/**
 * Merges two GraphQL schemas, avoiding duplicate definitions
 */
function mergeSchemas(baseSchema, updateSchema) {
  // Parse schema sections
  const baseTypes = parseSchemaTypes(baseSchema);
  const updateTypes = parseSchemaTypes(updateSchema);
  
  // Merge types
  const mergedTypes = { ...baseTypes };
  
  for (const [typeName, typeContent] of Object.entries(updateTypes)) {
    if (mergedTypes[typeName]) {
      // Type exists, merge fields
      const baseFields = parseTypeFields(mergedTypes[typeName]);
      const updateFields = parseTypeFields(typeContent);
      
      const mergedFields = { ...baseFields };
      for (const [fieldName, fieldDef] of Object.entries(updateFields)) {
        if (!mergedFields[fieldName]) {
          mergedFields[fieldName] = fieldDef;
        }
      }
      
      // Rebuild type content
      mergedTypes[typeName] = rebuildTypeContent(typeName, mergedFields);
    } else {
      // New type, add it directly
      mergedTypes[typeName] = typeContent;
    }
  }
  
  // Rebuild schema
  let result = '';
  for (const [typeName, typeContent] of Object.entries(mergedTypes)) {
    result += typeContent + '\n\n';
  }
  
  return result.trim();
}

/**
 * Parses a schema string into a map of type name to type content
 */
function parseSchemaTypes(schema) {
  const types = {};
  const typeRegex = /(type|input|interface|enum|scalar|union)\s+(\w+)(?:\s+(?:implements|extends)\s+\w+)?\s*{([^}]*)}/g;
  const scalarRegex = /(scalar)\s+(\w+)/g;
  
  let match;
  
  // Process regular types
  while ((match = typeRegex.exec(schema))) {
    const [fullMatch, kind, name, fields] = match;
    types[`${kind} ${name}`] = fullMatch;
  }
  
  // Process scalars
  while ((match = scalarRegex.exec(schema))) {
    const [fullMatch, kind, name] = match;
    if (!fullMatch.includes('{')) {  // Avoid double-matching types already captured
      types[`${kind} ${name}`] = fullMatch;
    }
  }
  
  return types;
}

/**
 * Parses the fields of a type definition
 */
function parseTypeFields(typeContent) {
  const fieldsMatch = typeContent.match(/{([^}]*)}/);
  if (!fieldsMatch) return {};
  
  const fields = {};
  const fieldLines = fieldsMatch[1].split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
  
  for (const line of fieldLines) {
    const fieldMatch = line.match(/(\w+)(\([^)]*\))?:([^,!]+[!]?)/);
    if (fieldMatch) {
      const [_, name, args, type] = fieldMatch;
      fields[name] = line;
    }
  }
  
  return fields;
}

/**
 * Rebuilds a type definition from its field map
 */
function rebuildTypeContent(typeName, fields) {
  const [kind, name] = typeName.split(' ');
  let result = `${kind} ${name} {`;
  
  for (const fieldDef of Object.values(fields)) {
    result += `\n  ${fieldDef}`;
  }
  
  result += '\n}';
  return result;
}

// Execute when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = syncSchema();
  process.exit(result ? 0 : 1);
}

export { syncSchema };
