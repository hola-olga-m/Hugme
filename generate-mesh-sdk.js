#!/usr/bin/env node

/**
 * GraphQL Mesh SDK Generator
 * 
 * This script builds and generates a TypeScript SDK for GraphQL Mesh,
 * which can be used by client applications to interact with the API.
 */

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for the SDK
const SDK_OUTPUT_DIR = path.join(__dirname, 'mesh-sdk');

async function generateSDK() {
  console.log('🔧 Building GraphQL Mesh artifacts...');
  
  try {
    // First, ensure the mesh is built with the latest configuration
    await executeCommand('npx graphql-mesh build');
    
    console.log('✅ Mesh build completed');
    
    // Create output directory if it doesn't exist
    await fs.mkdir(SDK_OUTPUT_DIR, { recursive: true });
    
    // Generate the SDK
    console.log('🚀 Generating Mesh TypeScript SDK...');
    await executeCommand(`npx graphql-mesh generate-sdk -l typescript -o ${SDK_OUTPUT_DIR}`);
    
    console.log('✅ SDK generated successfully in mesh-sdk directory');
    
    // Copy mesh schema for reference
    await fs.copyFile(
      path.join(__dirname, '.mesh', 'schema.graphql'),
      path.join(SDK_OUTPUT_DIR, 'schema.graphql')
    );
    
    console.log('📋 Copied schema.graphql to SDK directory');
    
    // Create a simplified index.js for CommonJS compatibility
    await fs.writeFile(
      path.join(SDK_OUTPUT_DIR, 'index.js'),
      `/**
 * GraphQL Mesh SDK - CommonJS Entry Point
 * 
 * This file re-exports the TypeScript SDK for use in CommonJS environments.
 */

module.exports = require('./index.cjs');
`
    );
    
    console.log('📜 Created CommonJS compatibility layer');
    
    // Create sample usage documentation
    await fs.writeFile(
      path.join(SDK_OUTPUT_DIR, 'README.md'),
      `# GraphQL Mesh SDK

This SDK provides type-safe access to the HugMeNow GraphQL API.

## Usage

### In TypeScript/ES Module environments:

\`\`\`javascript
import { getSdk } from './mesh-sdk/index.js';
import { fetch } from 'cross-fetch';

// Create a client
const client = getSdk({
  baseUrl: 'http://localhost:5000/graphql',
  fetchFn: fetch,
  token: localStorage.getItem('authToken')  // Optional auth token
});

// Example: Fetch public moods
async function getPublicMoods() {
  const result = await client.PublicMoods();
  console.log(result.publicMoods);
  return result.publicMoods;
}
\`\`\`

### In CommonJS environments:

\`\`\`javascript
const { getSdk } = require('./mesh-sdk');
const fetch = require('cross-fetch');

// Create a client
const client = getSdk({
  baseUrl: 'http://localhost:5000/graphql',
  fetchFn: fetch,
  token: process.env.AUTH_TOKEN  // Optional auth token
});

// Example: Fetch public moods
async function getPublicMoods() {
  const result = await client.PublicMoods();
  console.log(result.publicMoods);
  return result.publicMoods;
}
\`\`\`
`
    );
    
    console.log('📚 Created SDK documentation');
    
    console.log('🎉 SDK generation completed successfully!');
  } catch (error) {
    console.error('❌ Error generating SDK:', error);
    process.exit(1);
  }
}

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

// Execute the script
generateSDK();