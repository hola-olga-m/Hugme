
/**
 * Script to remove pagination parameters from client-side GraphQL queries
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Default files identified in fix-queries.js
const defaultFiles = [
  './hugmenow/web/src/components/dashboard/FriendMoodsWidget.jsx',
  './hugmenow/web/src/components/friends/FriendMoodFeed.jsx',
  './hugmenow/web/src/pages/DashboardPage.jsx',
];

// Patterns to remove pagination parameters
const fixPatterns = [
  {
    // Remove variables from queries
    search: /variables: { (limit|unreadOnly|offset|search): [^}]+},?\n\s+/g,
    replace: '',
  },
  {
    // Update query parameter types that have pagination
    search: /query \w+\(\$(limit|offset|search): \w+\)/g,
    replace: function(match) {
      return match.replace(/\(\$(limit|offset|search): \w+\)/, '');
    }
  },
  {
    // Remove parameters from field calls
    search: /(friendsMoods|publicMoods|receivedHugs|sentHugs|users|hugsReceived|hugsSent|notifications|followers|following|friends)\((limit|offset|search|unreadOnly)[^)]*\)/g,
    replace: '$1',
  },
  {
    // Remove pagination variables from useQuery
    search: /useQuery\(([^,]+), {\s*variables: {\s*(limit|offset|search): [^}]+}\s*}\)/g,
    replace: 'useQuery($1)',
  },
  {
    // Clean up leftover empty variables objects
    search: /variables: {}\s*,?/g,
    replace: '',
  },
  {
    // Clean up empty parentheses in field calls
    search: /(\w+)\(\)/g,
    replace: '$1',
  }
];

// Find all React component files that might contain GraphQL queries
async function findComponentFiles() {
  return new Promise((resolve, reject) => {
    glob('./hugmenow/web/src/**/*.{jsx,js,tsx,ts}', (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

// Main function to fix all files
async function fixAllFiles() {
  try {
    // Get all component files
    const allFiles = await findComponentFiles();
    
    console.log(`Found ${allFiles.length} files to scan for GraphQL queries.`);
    
    // Start with files we know need fixing
    const filesToProcess = [...defaultFiles];
    
    // Scan other files for GraphQL query patterns
    for (const file of allFiles) {
      if (!defaultFiles.includes(file)) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          // Look for GraphQL query patterns
          if (content.includes('query') && 
              (content.includes('limit:') || 
               content.includes('offset:') || 
               content.includes('$limit') || 
               content.includes('$offset'))) {
            filesToProcess.push(file);
          }
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
        }
      }
    }
    
    console.log(`Found ${filesToProcess.length} files with pagination parameters.`);
    
    // Process all identified files
    let totalFixed = 0;
    
    for (const filePath of filesToProcess) {
      try {
        if (!fs.existsSync(filePath)) {
          console.log(`File not found: ${filePath}`);
          continue;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        for (const pattern of fixPatterns) {
          const newContent = content.replace(pattern.search, pattern.replace);
          if (newContent !== content) {
            hasChanges = true;
            content = newContent;
          }
        }
        
        if (hasChanges) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Fixed: ${filePath}`);
          totalFixed++;
        } else {
          console.log(`⏭️ No changes needed: ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
      }
    }
    
    console.log(`\n✅ Done fixing client-side pagination parameters. Fixed ${totalFixed} files.`);
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Run the fix function
fixAllFiles();

module.exports = { 
  fixPatterns,
  findComponentFiles,
  fixAllFiles
};
