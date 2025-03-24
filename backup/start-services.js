const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Service definitions
const services = [
  {
    name: 'API Gateway',
    dir: './services/api-gateway',
    script: 'app.js',
    port: process.env.API_GATEWAY_PORT || 5000,
    color: colors.green,
    dependencies: []
  },
  {
    name: 'Auth Service',
    dir: './services/auth-service',
    script: 'app.js',
    port: process.env.AUTH_SERVICE_PORT || 4001,
    color: colors.yellow,
    dependencies: []
  },
  {
    name: 'User Service',
    dir: './services/user-service',
    script: 'app.js',
    port: process.env.USER_SERVICE_PORT || 4002,
    color: colors.blue,
    dependencies: ['Auth Service']
  },
  {
    name: 'Mood Service',
    dir: './services/mood-service',
    script: 'app-mesh.js', // Using the GraphQL Mesh enabled version
    port: process.env.MOOD_SERVICE_PORT || 4003,
    color: colors.magenta,
    dependencies: ['Auth Service']
  },
  {
    name: 'Hug Service',
    dir: './services/hug-service',
    script: 'app.js',
    port: process.env.HUG_SERVICE_PORT || 4004,
    color: colors.cyan,
    dependencies: ['Auth Service', 'User Service']
  },
  {
    name: 'GraphQL Gateway',
    dir: './services/graphql-gateway',
    script: 'app.js',
    port: process.env.GRAPHQL_GATEWAY_PORT || 4000,
    color: colors.red,
    dependencies: ['Auth Service', 'User Service', 'Mood Service', 'Hug Service']
  },
  {
    name: 'GraphQL Mesh Gateway',
    dir: '.', // Root directory
    script: 'start-mesh.js',
    port: process.env.MESH_GATEWAY_PORT || 4005, // Use a different port from regular gateway
    color: colors.bright + colors.green,
    dependencies: ['Auth Service', 'User Service', 'Mood Service', 'Hug Service']
  }
];

// Store running processes
const processes = {};

// Function to start a service
function startService(service) {
  // Ensure the service directory exists
  if (!fs.existsSync(service.dir)) {
    console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} Directory not found: ${service.dir}`);
    return null;
  }

  // Ensure the script exists
  const scriptPath = path.join(service.dir, service.script);
  if (!fs.existsSync(scriptPath)) {
    console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} Script not found: ${scriptPath}`);
    return null;
  }

  console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} Starting on port ${service.port}...`);
  
  // Start the process
  const process = spawn('node', [scriptPath], {
    cwd: service.dir,
    env: { ...process.env, PORT: service.port },
    stdio: 'pipe'
  });
  
  // Handle process output
  process.stdout.on('data', (data) => {
    console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} ${data.toString().trim()}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`${service.color}${colors.bright}[${service.name}]${colors.reset} ${colors.red}ERROR:${colors.reset} ${data.toString().trim()}`);
  });
  
  // Handle process exit
  process.on('close', (code) => {
    console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} Exited with code ${code}`);
    delete processes[service.name];
    
    // Restart the service after a delay
    if (code !== 0) {
      console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} Restarting in 5 seconds...`);
      setTimeout(() => {
        processes[service.name] = startService(service);
      }, 5000);
    }
  });
  
  return process;
}

// Function to check if a dependency is running
function isDependencyRunning(dependency) {
  return processes[dependency] && processes[dependency].exitCode === null;
}

// Start services in order
async function startServices() {
  console.log(`${colors.bright}Starting HugMood Microservices...${colors.reset}`);
  
  // First start services with no dependencies
  for (const service of services.filter(s => s.dependencies.length === 0)) {
    processes[service.name] = startService(service);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds between services
  }
  
  // Then start services with dependencies
  const withDependencies = services.filter(s => s.dependencies.length > 0);
  for (const service of withDependencies) {
    // Check if all dependencies are running
    const missingDeps = service.dependencies.filter(dep => !isDependencyRunning(dep));
    if (missingDeps.length > 0) {
      console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} ${colors.red}Missing dependencies: ${missingDeps.join(', ')}${colors.reset}`);
      console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} Will wait and retry...`);
    } else {
      processes[service.name] = startService(service);
    }
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds between services
  }
  
  // Check for any services that haven't started yet
  const notStarted = services.filter(s => !processes[s.name]);
  if (notStarted.length > 0) {
    console.log(`${colors.yellow}${colors.bright}Some services could not be started:${colors.reset}`);
    for (const service of notStarted) {
      console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} ${colors.yellow}Not started${colors.reset}`);
    }
    
    // Retry after all other services have had a chance to start
    console.log(`${colors.yellow}${colors.bright}Retrying in 10 seconds...${colors.reset}`);
    setTimeout(() => {
      for (const service of notStarted) {
        const missingDeps = service.dependencies.filter(dep => !isDependencyRunning(dep));
        if (missingDeps.length === 0) {
          console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} Retrying...`);
          processes[service.name] = startService(service);
        } else {
          console.log(`${service.color}${colors.bright}[${service.name}]${colors.reset} ${colors.red}Still missing dependencies: ${missingDeps.join(', ')}${colors.reset}`);
        }
      }
    }, 10000);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.bright}Shutting down all services...${colors.reset}`);
  
  // Terminate all child processes
  Object.values(processes).forEach(proc => {
    if (proc && proc.exitCode === null) {
      proc.kill('SIGTERM');
    }
  });
  
  process.exit(0);
});

// Start all services
startServices();

console.log(`${colors.bright}Press Ctrl+C to stop all services${colors.reset}`);