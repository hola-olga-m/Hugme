
#!/usr/bin/env node

/**
 * GraphQL Error Scanner
 * 
 * This script scans the codebase for GraphQL queries and mutations,
 * analyzing them for potential schema errors against the current schema.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const WEB_SRC_DIR = './hugmenow/web/src';
const API_SCHEMA_PATH = './hugmenow/api/src/graphql/schema.graphql';
const CLIENT_SCHEMA_PATH = './hugmenow/web/src/graphql/schema.graphql';
const RESULTS_PATH = './schema-analysis/error-scan-results.md';

// Ensure the schema-analysis directory exists
if (!fs.existsSync('./schema-analysis')) {
  fs.mkdirSync('./schema-analysis', { recursive: true });
}

// Get all .js, .jsx, .ts, and .tsx files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (
      file.endsWith('.js') || 
      file.endsWith('.jsx') || 
      file.endsWith('.ts') || 
      file.endsWith('.tsx')
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Extract GraphQL queries from files
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

// Analyze a query for potential schema issues
function analyzeQuery(query, schemaContent) {
  const issues = [];
  
  // Check for field names in Query type
  const queryFieldMatch = query.text.match(/query\s+\w+\s*{([^}]*)}/);
  if (queryFieldMatch) {
    const queryFields = queryFieldMatch[1].trim().split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
    
    queryFields.forEach(field => {
      // Extract the field name without arguments
      const fieldNameMatch = field.match(/(\w+)(?:\(.*\))?/);
      if (fieldNameMatch) {
        const fieldName = fieldNameMatch[1];
        
        // Check if the field exists in the schema
        if (!schemaContent.includes(`${fieldName}:`)) {
          issues.push(`Field "${fieldName}" not found in Query type`);
        }
        
        // Check for arguments
        const argsMatch = field.match(/\w+\s*\((.*)\)/);
        if (argsMatch) {
          const args = argsMatch[1].split(',')
            .map(arg => arg.trim())
            .filter(arg => arg);
          
          args.forEach(arg => {
            const argNameMatch = arg.match(/(\w+):/);
            if (argNameMatch) {
              const argName = argNameMatch[1];
              
              // Check if the field argument is defined in the schema
              const fieldDefMatch = new RegExp(`${fieldName}\\s*\\(([^)]*)\\)`, 'g');
              let fieldDefMatches = fieldDefMatch.exec(schemaContent);
              
              if (fieldDefMatches) {
                const fieldArgs = fieldDefMatches[1];
                if (!fieldArgs.includes(`${argName}:`)) {
                  issues.push(`Argument "${argName}" not found for field "${fieldName}"`);
                }
              }
            }
          });
        }
      }
    });
  }
  
  return issues;
}

// Main function
async function scanForErrors() {
  console.log('🔍 Scanning codebase for GraphQL queries...');
  
  // Get schema content
  let schemaContent = '';
  if (fs.existsSync(CLIENT_SCHEMA_PATH)) {
    schemaContent = fs.readFileSync(CLIENT_SCHEMA_PATH, 'utf8');
  } else if (fs.existsSync(API_SCHEMA_PATH)) {
    schemaContent = fs.readFileSync(API_SCHEMA_PATH, 'utf8');
  } else {
    console.error('❌ No schema file found. Cannot analyze queries.');
    return;
  }
  
  // Find all files
  const files = findFiles(WEB_SRC_DIR);
  console.log(`📁 Scanning ${files.length} files for GraphQL queries...`);
  
  // Results storage
  const results = [];
  let totalQueries = 0;
  let totalIssues = 0;
  
  // Process each file
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const queries = extractQueries(content);
    
    if (queries.length > 0) {
      console.log(`📄 Found ${queries.length} queries in ${filePath}`);
      totalQueries += queries.length;
      
      // Analyze each query
      const fileIssues = [];
      
      for (const query of queries) {
        const issues = analyzeQuery(query, schemaContent);
        
        if (issues.length > 0) {
          fileIssues.push({
            query: query.text,
            issues
          });
          
          totalIssues += issues.length;
        }
      }
      
      if (fileIssues.length > 0) {
        results.push({
          filePath,
          issues: fileIssues
        });
      }
    }
  }
  
  // Generate report
  const report = [
    '# GraphQL Error Scan Results',
    '',
    `Scan completed at: ${new Date().toISOString()}`,
    '',
    `Total files scanned: ${files.length}`,
    `Total queries found: ${totalQueries}`,
    `Total issues found: ${totalIssues}`,
    '',
    '## Issues by File',
    ''
  ];
  
  results.forEach(result => {
    report.push(`### ${result.filePath}`);
    report.push('');
    
    result.issues.forEach((issue, index) => {
      report.push(`#### Query ${index + 1}:`);
      report.push('```graphql');
      report.push(issue.query);
      report.push('```');
      report.push('');
      report.push('Issues:');
      report.push('');
      
      issue.issues.forEach(issueText => {
        report.push(`- ${issueText}`);
      });
      
      report.push('');
    });
  });
  
  // Write report
  fs.writeFileSync(RESULTS_PATH, report.join('\n'));
  
  console.log(`✅ Scan complete. Found ${totalIssues} issues in ${results.length} files.`);
  console.log(`📝 Report written to ${RESULTS_PATH}`);
}

// Execute when run directly
if (require.main === module) {
  scanForErrors();
}

module.exports = { scanForErrors };
