// HugMeNow Launcher
const { spawn } = require('child_process');
const path = require('path');

// Log output from child processes
function logOutput(name, data) {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    console.log(`[${name}] ${line}`);
  });
}

console.log('Starting HugMeNow application...');

// Path to the startup script (relative to this file)
const startupScriptPath = path.join(__dirname, 'start-hugmenow.sh');

// Set any required environment variables
process.env.REPLIT_ENV = 'true';

// Start the application using the bash script
const proc = spawn('bash', [startupScriptPath], {
  stdio: 'pipe',
  shell: true,
  env: {
    ...process.env,
    PORT: '5000', // Ensure frontend server uses port 5000
    API_PORT: '3002', // Ensure API server uses port 3002
  }
});

// Handle process output
proc.stdout.on('data', (data) => {
  logOutput('HugMeNow', data);
});

proc.stderr.on('data', (data) => {
  logOutput('ERROR', data);
});

// Handle process exit
proc.on('close', (code) => {
  console.log(`HugMeNow process exited with code ${code}`);
});

// Handle process error
proc.on('error', (err) => {
  console.error('Failed to start HugMeNow:', err);
});