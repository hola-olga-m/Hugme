// Cache clearing script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Clearing application caches...');

// Define paths to clear
const cachePaths = [
  './hugmenow/web/.cache',
  './hugmenow/web/dist/.cache',
  './hugmenow/api/dist',
  './node_modules/.cache'
];

// Clear each path if it exists
cachePaths.forEach(cachePath => {
  if (fs.existsSync(cachePath)) {
    try {
      console.log(`Clearing ${cachePath}...`);
      execSync(`rm -rf ${cachePath}`, { stdio: 'inherit' });
      console.log(`✅ ${cachePath} cleared successfully`);
    } catch (error) {
      console.error(`❌ Failed to clear ${cachePath}: ${error.message}`);
    }
  } else {
    console.log(`⚠️ Cache path ${cachePath} not found, skipping`);
  }
});


  // Create necessary directories if they don't exist
  try {
    if (!fs.existsSync('./hugmenow/web/src/generated')) {
      fs.mkdirSync('./hugmenow/web/src/generated', { recursive: true });
    }
    if (!fs.existsSync('./mesh-artifacts')) {
      fs.mkdirSync('./mesh-artifacts', { recursive: true });
    }
  } catch (error) {
    console.error('Failed to create directories:', error.message);
  }

  // Create or clear error log
  try {
    const errorLogPath = './hugmenow/web/src/graphql/error.log';
    const errorLogDir = path.dirname(errorLogPath);

    if (!fs.existsSync(errorLogDir)) {
      fs.mkdirSync(errorLogDir, { recursive: true });
    }

    // Write current GraphQL errors to the log file
    fs.writeFileSync(errorLogPath,
      '[GraphQL error]: Message: Unknown argument "limit" on field "Query.publicMoods".\n' +
      '[GraphQL error]: Message: Unknown argument "offset" on field "Query.publicMoods".\n' +
      '[GraphQL error]: Message: Unknown argument "limit" on field "Query.receivedHugs".\n' +
      '[GraphQL error]: Message: Unknown argument "offset" on field "Query.receivedHugs".\n' +
      '[GraphQL error]: Message: Unknown argument "search" on field "Query.users".\n' +
      '[GraphQL error]: Message: Unknown argument "limit" on field "Query.users".\n' +
      '[GraphQL error]: Message: Unknown argument "offset" on field "Query.users".\n' +
      '[GraphQL error]: Message: Unknown argument "offset" on field "Query.friendsMoods".\n' +
      '[GraphQL error]: Message: Variable "$limit" of type "Int" used in position expecting type "Float".'
    );
    console.log('Created GraphQL error log');
  } catch (error) {
    console.error('Failed to create error log:', error.message);
  }

console.log('✅ Cache clearing completed');

// Run if called directly
if (require.main === module) {
  clearCaches();
}

module.exports = { clearCaches };