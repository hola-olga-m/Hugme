
/**
 * Simple script to fix GraphQL queries by removing pagination parameters
 */

const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  './hugmenow/web/src/components/dashboard/FriendMoodsWidget.jsx',
  './hugmenow/web/src/components/friends/FriendMoodFeed.jsx',
  './hugmenow/web/src/pages/DashboardPage.jsx',
];

// Patterns to fix
const fixPatterns = [
  {
    // Remove variables from queries
    search: /variables: { (limit|unreadOnly|offset|search): [^}]+},?\n\s+/g,
    replace: '',
  },
  {
    // Update GET_FRIENDS_MOODS query parameter type
    search: /query GetFriendsMoods\(\$limit: Int\)/g,
    replace: 'query GetFriendsMoods',
  },
  {
    // Remove parameters from field calls
    search: /(friendsMoods|publicMoods|receivedHugs|users)\((limit|offset|search)[^)]*\)/g,
    replace: '$1',
  },
];

// Fix files
for (const filePath of files) {
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
      console.log(`Fixed: ${filePath}`);
    } else {
      console.log(`No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

console.log('Done fixing queries.');

module.exports = { fixPatterns };
