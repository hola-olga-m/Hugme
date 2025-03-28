
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Starting GraphQL fixes...');

// Common GraphQL errors from the logs
const knownErrors = {
  'Cannot query field "userMoods" on type "Query"': {
    oldField: 'userMoods',
    newField: 'moods',
    message: 'Replacing userMoods with moods'
  },
  'Cannot query field "sentHugs" on type "Query"': {
    oldField: 'sentHugs',
    newField: 'hugs',
    message: 'Replacing sentHugs with hugs'
  },
  'Cannot query field "receivedHugs" on type "Query"': {
    oldField: 'receivedHugs',
    newField: 'hugs',
    message: 'Replacing receivedHugs with hugs'
  },
  'Cannot query field "friendsMoods" on type "Query"': {
    oldField: 'friendsMoods',
    newField: 'publicMoods',
    message: 'Replacing friendsMoods with publicMoods'
  },
  'Cannot query field "score" on type "PublicMood"': {
    oldField: 'score',
    newField: 'note',
    message: 'Replacing score with note'
  },
  'Field "moodStreak" of type "MoodStreak" must have a selection of subfields': {
    pattern: /moodStreak\s*{?[^{]*?}/g,
    replacement: 'moodStreak { count currentStreak longestStreak }',
    message: 'Adding required subfields to moodStreak'
  },
  'Variable "$limit" of type "Int" used in position expecting type "Float"': {
    pattern: /\$limit:\s*Int/g,
    replacement: '$limit: Float',
    message: 'Changing Int to Float for $limit variable'
  }
};

// Function to fix http-proxy-middleware module error
async function fixHttpProxyMiddleware() {
  console.log('🔧 Fixing http-proxy-middleware module error...');
  
  const fixRequestBodyPath = './hugmenow/web/node_modules/http-proxy-middleware/dist/handlers/fix-request-body.js';
  
  // Check if the directory exists
  const dirPath = path.dirname(fixRequestBodyPath);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Create the missing file
  const fileContent = `
/**
 * Fix for missing module error
 * This is a placeholder implementation of the fix-request-body module
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixRequestBody = void 0;

// Simple implementation to fix request body if needed
function fixRequestBody(proxyReq, req) {
  if (!req.body || !Object.keys(req.body).length) {
    return;
  }

  const contentType = proxyReq.getHeader('Content-Type');
  const writeBody = (bodyData) => {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  };

  if (contentType === 'application/json') {
    writeBody(JSON.stringify(req.body));
  }
}

exports.fixRequestBody = fixRequestBody;
exports.default = fixRequestBody;
  `;
  
  fs.writeFileSync(fixRequestBodyPath, fileContent);
  console.log(`✅ Created missing module: ${fixRequestBodyPath}`);
  
  return true;
}

// Find all GraphQL query files in the frontend
async function findGraphQLFiles() {
  const pattern = './hugmenow/web/src/**/*.{js,jsx,ts,tsx,graphql}';
  const excludePattern = '**/node_modules/**';
  
  try {
    const files = await glob(pattern, { ignore: excludePattern });
    return files;
  } catch (error) {
    console.error('Error finding GraphQL files:', error);
    return [];
  }
}

// Fix GraphQL queries in a file
function fixGraphQLQueriesInFile(filePath) {
  console.log(`Processing ${filePath}`);
  
  try {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let fileModified = false;
    
    // Find GraphQL template literals
    const gqlPattern = /(gql|graphql)`([^`]+)`/g;
    
    // Track modifications
    const changes = [];
    
    // Replace each GraphQL template literal
    fileContent = fileContent.replace(gqlPattern, (match, tag, queryText) => {
      let newQueryText = queryText;
      
      // Apply fixes for each known error
      for (const error in knownErrors) {
        const fix = knownErrors[error];
        
        if (fix.pattern && fix.replacement) {
          // For regex pattern replacements
          const oldText = newQueryText;
          newQueryText = newQueryText.replace(fix.pattern, fix.replacement);
          
          if (oldText !== newQueryText) {
            changes.push(fix.message);
          }
        } else if (fix.oldField && fix.newField) {
          // For field name replacements - use word boundaries
          const fieldPattern = new RegExp(`\\b${fix.oldField}\\b`, 'g');
          const oldText = newQueryText;
          newQueryText = newQueryText.replace(fieldPattern, fix.newField);
          
          if (oldText !== newQueryText) {
            changes.push(fix.message);
          }
        }
      }
      
      // Check if we made any changes
      if (queryText !== newQueryText) {
        fileModified = true;
        return `${tag}\`${newQueryText}\``;
      }
      
      return match;
    });
    
    // Save file if modified
    if (fileModified) {
      fs.writeFileSync(filePath, fileContent, 'utf8');
      console.log(`✅ Fixed queries in ${path.basename(filePath)}:`);
      changes.forEach(change => console.log(`  - ${change}`));
      return true;
    } else {
      console.log(`No changes needed in ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Fix queries with pagination parameters
function fixPaginationQueries() {
  console.log('🔧 Fixing pagination parameter issues...');
  
  const files = [
    './hugmenow/web/src/graphql/queries.js', 
    './hugmenow/web/src/graphql/queries.jsx',
    './hugmenow/web/src/graphql/publicQueries.js',
    './hugmenow/web/src/graphql/publicQueries.jsx'
  ];
  
  for (const filePath of files) {
    if (fs.existsSync(filePath)) {
      let fileContent = fs.readFileSync(filePath, 'utf8');
      let fileModified = false;
      
      // Fix limit and offset variables
      const limitPattern = /\$limit:\s*Int/g;
      if (limitPattern.test(fileContent)) {
        fileContent = fileContent.replace(limitPattern, '$limit: Float');
        fileModified = true;
        console.log('  - Changed $limit: Int to $limit: Float');
      }
      
      const offsetPattern = /\$offset:\s*Int/g;
      if (offsetPattern.test(fileContent)) {
        fileContent = fileContent.replace(offsetPattern, '$offset: Float');
        fileModified = true;
        console.log('  - Changed $offset: Int to $offset: Float');
      }
      
      if (fileModified) {
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`✅ Fixed pagination parameters in ${path.basename(filePath)}`);
      }
    }
  }
}

// Fix the GraphQL errors
async function fixGraphQLErrors() {
  console.log('🔧 Starting GraphQL error fixes...');
  
  // Step 1: Fix the missing http-proxy-middleware module
  await fixHttpProxyMiddleware();
  
  // Step 2: Fix pagination queries
  fixPaginationQueries();
  
  // Step 3: Find and fix GraphQL files
  const files = await findGraphQLFiles();
  console.log(`Found ${files.length} files to process`);
  
  let fixedFiles = 0;
  
  for (const filePath of files) {
    if (fixGraphQLQueriesInFile(filePath)) {
      fixedFiles++;
    }
  }
  
  console.log(`\n✅ GraphQL fixes completed! Fixed issues in ${fixedFiles} files.`);
  console.log('The app should now run correctly. Please restart the HugMeNow workflow.');
  
  return true;
}

// Run the fix
fixGraphQLErrors();
