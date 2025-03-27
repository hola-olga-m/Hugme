
// Application Restart Script

/**
 * Application Restart Script
 * 
 * This script properly restarts the HugMeNow application
 * after schema changes to ensure the changes are applied.
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔄 Restarting HugMeNow application...');

// Function to check if a process is running
function isProcessRunning(processName) {
  try {
    const output = execSync(`ps aux | grep ${processName} | grep -v grep`).toString();
    return output.length > 0;
  } catch (error) {
    return false;
  }
}

// Function to restart the application
function restartApp() {
  try {
    // Kill any existing Node.js processes for the app
    console.log('📋 Stopping running processes...');
    
    try {
      execSync('pkill -f "node index.js"', { stdio: 'inherit' });
    } catch (error) {
      // It's okay if there are no processes to kill
      console.log('No running index.js processes found');
    }
    
    // Clear any potential cache files
    console.log('🧹 Clearing potential cache files...');
    
    const cachePaths = [
      './hugmenow/web/.cache',
      './hugmenow/web/dist/.cache',
      './hugmenow/api/dist',
      './node_modules/.cache'
    ];
    
    cachePaths.forEach(path => {
      if (fs.existsSync(path)) {
        try {
          console.log(`Clearing ${path}...`);
          execSync(`rm -rf ${path}`, { stdio: 'inherit' });
        } catch (error) {
          console.log(`Warning: Could not clear ${path}`);
        }
      }
    });

    // Copy the updated schema files to appropriate locations
    console.log('📋 Ensuring schema files are up to date...');
    
    if (fs.existsSync('./schema-updates.graphql')) {
      console.log('Running schema synchronization...');
      execSync('node sync-schema.js', { stdio: 'inherit' });
    }
    
    // Restart the application using the workflow
    console.log('🚀 Starting HugMeNow application...');
    
    execSync('node index.js &', { stdio: 'inherit' });
    
    console.log('✅ Application restart initiated successfully');
  } catch (error) {
    console.error('❌ Failed to restart application:', error.message);
    process.exit(1);
  }
}

// Execute restart
restartApp();
