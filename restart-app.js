
/**
 * Application Restart Utility
 * Clears caches, fixes schema issues, and restarts the application
 */

const { spawn, execSync } = require('child_process');
const { clearCaches } = require('./cache-clear');
const fs = require('fs');

async function restartApplication() {
  console.log('🔄 Starting application restart process...');
  
  // Step 1: Clear caches
  console.log('\n📦 Step 1: Clearing caches...');
  clearCaches();
  
  // Step 2: Fix schema issues
  console.log('\n🛠️ Step 2: Fixing schema issues...');
  try {
    // Run the fix-schema-mismatches script
    if (fs.existsSync('./hugmenow/web/src/graphql/error.log')) {
      const errors = fs.readFileSync('./hugmenow/web/src/graphql/error.log', 'utf8');
      execSync(`node fix-schema-mismatches.js "${errors}"`, { stdio: 'inherit' });
    } else {
      execSync('node fix-schema-mismatches.js "[GraphQL error]: Message: Unknown argument \\"limit\\" on field \\"Query.publicMoods\\""', { stdio: 'inherit' });
    }
    
    // Sync schema
    execSync('node sync-schema.js', { stdio: 'inherit' });
    
    console.log('✅ Schema fixes applied');
  } catch (error) {
    console.error('❌ Error fixing schema:', error.message);
    console.log('Continuing with restart process...');
  }
  
  // Step 3: Tell user to restart the application
  console.log('\n🚀 Step 3: Restart application');
  console.log('\n✅ Preparation complete! To complete the restart:');
  console.log('1. Press the "Stop" button to stop all running processes');
  console.log('2. Press the "Run" button to restart the application');
  console.log('\nIf issues persist, you can run the "FixGraphQLSchema" workflow');
}

// Execute if run directly
if (require.main === module) {
  restartApplication();
}

module.exports = { restartApplication };
