/**
 * Schema Fix Utility
 * 
 * This script helps identify and fix GraphQL schema mismatches between frontend
 * queries and the actual server schema.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// First, load the actual schema
async function loadSchema() {
  try {
    const schemaPath = path.resolve('./hugmenow/api/src/schema.gql');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    return parseSchema(schemaContent);
  } catch (error) {
    console.error('Error loading schema:', error);
    return null;
  }
}

// Parse the schema to extract field information
function parseSchema(schemaContent) {
  const queryTypeMatch = schemaContent.match(/type Query {([^}]*)}/s);
  
  if (!queryTypeMatch || !queryTypeMatch[1]) {
    throw new Error('Could not find Query type in schema');
  }
  
  const queryFields = queryTypeMatch[1].trim().split('\n');
  const fieldInfo = {};
  
  queryFields.forEach(field => {
    // Clean up the line
    const cleanField = field.trim();
    if (!cleanField || cleanField.startsWith('#')) return;
    
    // Extract field name and parameters
    const match = cleanField.match(/(\w+)(\(([^)]*)\))?:/);
    if (!match) return;
    
    const fieldName = match[1];
    const params = match[3];
    
    fieldInfo[fieldName] = {
      name: fieldName,
      parameters: params ? parseParameters(params) : []
    };
  });
  
  return fieldInfo;
}

// Parse parameters from a field definition
function parseParameters(paramsString) {
  if (!paramsString) return [];
  
  return paramsString.split(',').map(param => {
    param = param.trim();
    const [name, typeInfo] = param.split(':').map(p => p.trim());
    
    // Check if parameter has a default value
    const defaultMatch = typeInfo.match(/=\s*([^\s]+)/);
    const defaultValue = defaultMatch ? defaultMatch[1] : undefined;
    
    // Check if parameter is required (ends with !)
    const required = typeInfo.endsWith('!');
    
    // Extract the base type
    let type = typeInfo.replace(/!$/, '').split('=')[0].trim();
    
    return {
      name,
      type,
      required,
      defaultValue
    };
  });
}

// Find GraphQL query files in the frontend
async function findQueryFiles() {
  const pattern = './hugmenow/web/src/**/*.{js,jsx,ts,tsx}';
  const excludePattern = '**/node_modules/**';
  
  try {
    const files = await glob(pattern, { ignore: excludePattern });
    return files;
  } catch (error) {
    console.error('Error finding query files:', error);
    return [];
  }
}

// Extract GraphQL queries from a file
function extractQueries(fileContent) {
  const queries = [];
  
  // Regular expressions for different query patterns
  const gqlTagPattern = /(?:gql|graphql)`([^`]+)`/g;
  const queryPattern = /(query|mutation)\s+(\w+)(?:\s*\(([^)]*)\))?\s*{([^}]*)}/g;
  
  // Look for gql/graphql tagged template literals
  let match;
  while ((match = gqlTagPattern.exec(fileContent))) {
    const queryText = match[1];
    queries.push({
      text: queryText,
      index: match.index
    });
  }
  
  return queries;
}

// Analyze a query to find potential schema mismatches
function analyzeQuery(query, schema) {
  const issues = [];
  
  // Extract query operation name and field
  const queryMatch = query.text.match(/(query|mutation)\s+(\w+)(?:\s*\(([^)]*)\))?\s*{([^}]*)}/);
  if (!queryMatch) return issues;
  
  const [, operationType, operationName, variablesDef, queryBody] = queryMatch;
  
  // Extract field names from the query
  const fieldPattern = /(\w+)(?:\s*\(([^)]*)\))?/g;
  let fieldMatch;
  
  const queryLines = queryBody.split('\n');
  for (const line of queryLines) {
    const trimmedLine = line.trim();
    
    // Skip nested fields and fragments
    if (trimmedLine.startsWith('{') || trimmedLine.endsWith('{') || 
        trimmedLine.startsWith('}') || trimmedLine.startsWith('...')) {
      continue;
    }
    
    // Extract field and its arguments if any
    fieldMatch = fieldPattern.exec(trimmedLine);
    if (!fieldMatch) continue;
    
    const [, fieldName, fieldArgs] = fieldMatch;
    
    // Skip if it's not a top-level query field
    if (!schema[fieldName]) continue;
    
    // If the field has arguments, validate them
    if (fieldArgs) {
      const parsedArgs = parseQueryArguments(fieldArgs);
      const schemaParams = schema[fieldName].parameters;
      
      // Find arguments that aren't in the schema
      for (const argName in parsedArgs) {
        const paramDef = schemaParams.find(p => p.name === argName);
        
        if (!paramDef) {
          issues.push({
            type: 'UNKNOWN_ARGUMENT',
            message: `Unknown argument "${argName}" on field "${fieldName}"`,
            fieldName,
            argName
          });
        } else {
          // Validate argument type
          const argValue = parsedArgs[argName];
          const isNumber = !isNaN(parseFloat(argValue));
          
          if (isNumber && paramDef.type === 'Float' && !argValue.includes('.')) {
            issues.push({
              type: 'TYPE_MISMATCH',
              message: `Argument "${argName}" is an Int but the schema expects Float for field "${fieldName}"`,
              fieldName,
              argName,
              expectedType: paramDef.type
            });
          }
        }
      }
    }
  }
  
  return issues;
}

// Parse arguments in a query field
function parseQueryArguments(argsString) {
  const args = {};
  
  // Cleanup whitespace
  argsString = argsString.trim();
  
  // Simple regex that handles basic cases
  const argPattern = /(\w+):\s*([^,]+)/g;
  let argMatch;
  
  while ((argMatch = argPattern.exec(argsString))) {
    const [, name, value] = argMatch;
    args[name] = value.trim();
  }
  
  return args;
}

// Generate fixes for the issues
function generateFixes(issues, fileContent) {
  // Group issues by field name
  const issuesByField = {};
  
  issues.forEach(issue => {
    if (!issuesByField[issue.fieldName]) {
      issuesByField[issue.fieldName] = [];
    }
    issuesByField[issue.fieldName].push(issue);
  });
  
  let fixedContent = fileContent;
  
  // Apply fixes for each field
  for (const fieldName in issuesByField) {
    const fieldIssues = issuesByField[fieldName];
    
    // Handle type mismatches
    const typeMismatches = fieldIssues.filter(i => i.type === 'TYPE_MISMATCH');
    typeMismatches.forEach(issue => {
      if (issue.expectedType === 'Float') {
        // Find integer literals for this field and add decimal point
        const pattern = new RegExp(`${issue.argName}:\\s*(\\d+)`, 'g');
        fixedContent = fixedContent.replace(pattern, `${issue.argName}: $1.0`);
      }
    });
    
    // Handle unknown arguments
    const unknownArgs = fieldIssues.filter(i => i.type === 'UNKNOWN_ARGUMENT');
    unknownArgs.forEach(issue => {
      // Find the argument in query and remove it
      const pattern = new RegExp(`${issue.argName}:\\s*[^,\\)]+,?`, 'g');
      fixedContent = fixedContent.replace(pattern, '');
      
      // Clean up any trailing commas in argument lists
      fixedContent = fixedContent.replace(/,\s*\)/g, ')');
    });
  }
  
  return fixedContent;
}

// Main function to run the schema fix
async function runSchemaFix() {
  console.log('Reading schema...');
  const schema = await loadSchema();
  
  if (!schema) {
    console.error('Failed to load schema. Exiting.');
    return;
  }
  
  console.log('Finding query files...');
  const files = await findQueryFiles();
  
  if (files.length === 0) {
    console.log('No query files found. Exiting.');
    return;
  }
  
  console.log(`Found ${files.length} potential files with GraphQL queries.`);
  let totalIssues = 0;
  let fixedFiles = 0;
  
  for (const filePath of files) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const queries = extractQueries(fileContent);
      
      if (queries.length === 0) continue;
      
      console.log(`\nAnalyzing ${path.basename(filePath)} (${queries.length} queries)`);
      
      let fileIssues = [];
      for (const query of queries) {
        const issues = analyzeQuery(query, schema);
        fileIssues = [...fileIssues, ...issues];
      }
      
      if (fileIssues.length > 0) {
        console.log(`Found ${fileIssues.length} issues`);
        fileIssues.forEach(issue => {
          console.log(`- ${issue.message}`);
        });
        
        // Generate and apply fixes
        const fixedContent = generateFixes(fileIssues, fileContent);
        
        if (fixedContent !== fileContent) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(`✅ Fixed issues in ${path.basename(filePath)}`);
          fixedFiles++;
        }
        
        totalIssues += fileIssues.length;
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }
  
  console.log(`\nSummary: Found ${totalIssues} issues in ${fixedFiles} files and applied fixes.`);
}

// Run the schema fix
runSchemaFix();