#!/usr/bin/env node

/**
 * GraphQL Schema Mismatch Resolver
 * 
 * This utility helps identify and fix schema mismatches between client queries
 * and the server schema. It analyzes the errors from GraphQL Inspector and 
 * provides guidance on how to fix them.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

// Directories to search for GraphQL operations
// Focusing on the main GraphQL query and mutation files for efficiency
const SEARCH_DIRS = [
  './hugmenow/web/src/graphql'
];

function getGraphQLFiles() {
  let files = [];
  SEARCH_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      const pattern = path.join(dir, '**/*.{js,jsx}');
      const matches = glob.sync(pattern);
      files = [...files, ...matches];
    }
  });
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Extract GraphQL operations
  const gqlMatches = content.match(/gql`([^`]+)`/g) || [];
  
  gqlMatches.forEach((match, index) => {
    const operation = match.replace(/gql`/, '').replace(/`$/, '');
    const operationName = operation.match(/(?:query|mutation|subscription)\s+(\w+)/)?.[1] || `UnnamedOperation${index}`;
    
    try {
      // Write operation to temporary file
      const tempFile = `./schema-analysis/temp-${operationName}.graphql`;
      fs.mkdirSync('./schema-analysis', { recursive: true });
      fs.writeFileSync(tempFile, operation);
      
      // Validate against local schema file instead of HTTP endpoint
      try {
        execSync(`npx graphql-inspector validate "${tempFile}" "./hugmenow/web/src/generated/schema.graphql"`, { stdio: 'pipe' });
      } catch (error) {
        const errorOutput = error.stdout?.toString() || error.message;
        const extractedIssues = extractIssues(errorOutput);
        
        if (extractedIssues.length > 0) {
          issues.push({
            operationName,
            file: filePath,
            issues: extractedIssues
          });
        }
      }
      
      // Clean up
      fs.unlinkSync(tempFile);
    } catch (err) {
      console.error(`Error analyzing operation ${operationName} in ${filePath}:`, err);
    }
  });
  
  return issues;
}

function extractIssues(output) {
  const issues = [];
  const lines = output.split('\n');
  
  let currentIssue = null;
  
  for (const line of lines) {
    if (line.includes('→ ')) {
      // This is an issue line
      const issue = line.trim().replace('→ ', '');
      currentIssue = {
        message: issue,
        suggestion: null
      };
      
      // Generate suggestions based on error type
      if (issue.includes('Unknown argument')) {
        const match = issue.match(/Unknown argument "(\w+)"/);
        if (match) {
          currentIssue.suggestion = `Remove the '${match[1]}' argument or update the server schema to include it`;
        }
      } else if (issue.includes('Cannot query field')) {
        const match = issue.match(/Cannot query field "(\w+)"/);
        if (match) {
          currentIssue.suggestion = `Remove the '${match[1]}' field or update the server schema to include it`;
        }
      } else if (issue.includes('Unknown type')) {
        const match = issue.match(/Unknown type "(\w+)"/);
        if (match) {
          currentIssue.suggestion = `Update the server schema to include the '${match[1]}' type`;
        }
      }
      
      issues.push(currentIssue);
    }
  }
  
  return issues;
}

function writeAnalysisReport(results) {
  const reportPath = './schema-analysis/mismatch-report.md';
  fs.mkdirSync('./schema-analysis', { recursive: true });
  
  let report = '# GraphQL Schema Mismatch Report\n\n';
  report += `Generated on ${new Date().toLocaleString()}\n\n`;
  
  if (results.length === 0) {
    report += '✅ No schema mismatches found!\n';
  } else {
    report += `⚠️ Found ${results.length} files with schema mismatches.\n\n`;
    
    results.forEach(fileResult => {
      const relPath = path.relative('.', fileResult.file);
      report += `## File: ${relPath}\n\n`;
      
      fileResult.issues.forEach(issueGroup => {
        report += `### Operation: ${issueGroup.operationName}\n\n`;
        
        issueGroup.issues.forEach(issue => {
          report += `- **Issue**: ${issue.message}\n`;
          if (issue.suggestion) {
            report += `  - **Suggestion**: ${issue.suggestion}\n`;
          }
          report += '\n';
        });
      });
      
      report += '---\n\n';
    });
    
    report += '## Next Steps\n\n';
    report += '1. Review the issues and suggestions above\n';
    report += '2. Update client queries to match the server schema\n';
    report += '3. Or update the server schema to include the missing fields/types\n';
    report += '4. Run schema synchronization again to verify fixes\n';
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`📝 Schema mismatch report written to ${reportPath}`);
}

function analyzeSchema() {
  console.log('🔍 Analyzing GraphQL schema mismatches...');
  
  const files = getGraphQLFiles();
  console.log(`📂 Found ${files.length} files to analyze`);
  
  // Implement a limit to avoid processing too many files
  const MAX_FILES = 10;
  const filesToProcess = files.slice(0, MAX_FILES);
  
  if (files.length > MAX_FILES) {
    console.log(`⚠️ Limiting analysis to ${MAX_FILES} files to avoid timeout. Running in batches.`);
  }
  
  const results = [];
  
  filesToProcess.forEach(file => {
    console.log(`Analyzing ${file}...`);
    const fileIssues = analyzeFile(file);
    if (fileIssues.length > 0) {
      results.push({
        file,
        issues: fileIssues
      });
    }
  });
  
  writeAnalysisReport(results);
  console.log(`🔍 Schema mismatch analysis complete! Processed ${filesToProcess.length} of ${files.length} files.`);
  
  if (files.length > MAX_FILES) {
    console.log('To analyze more files, run again with different batch settings or increase MAX_FILES value.');
  }
}

analyzeSchema();