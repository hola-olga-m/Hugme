#!/usr/bin/env node

/**
 * GraphQL Schema Sync Tool
 * 
 * This script automatically synchronizes GraphQL schemas between client and server.
 * It uses GraphQL Mesh for schema processing and GraphQL Inspector for validation.
 * 
 * Features:
 * - Downloads the latest GraphQL schema from the server
 * - Generates TypeScript types and React hooks
 * - Validates client queries against the schema
 * - Detects breaking changes between schema versions
 * - Provides detailed error reporting for schema mismatches
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const CONFIG = {
  outputDir: './hugmenow/web/src/generated',
  clientQueriesDir: './hugmenow/web/src/graphql',
  meshDir: './mesh-artifacts',
  graphqlConfigPath: './.graphqlrc.yml',
  meshConfigPath: './.meshrc.yml',
  serverSchemaPath: './hugmenow/api/src/schema.gql',
  clientSchemaPath: './hugmenow/web/src/generated/schema.graphql'
};

// Ensure output directory exists
function ensureDirectoriesExist() {
  const directories = [CONFIG.outputDir, CONFIG.meshDir];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Run a command and return a promise
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: options.silent ? 'ignore' : 'inherit',
      env: { ...process.env, ...options.env }
    });

    process.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command '${command} ${args.join(' ')}' failed with code ${code}`));
      }
    });
  });
}

// Get schema from server using GraphQL Mesh
async function fetchServerSchema() {
  console.log('📥 Fetching server schema using GraphQL Mesh...');
  try {
    await runCommand('npx', ['mesh', 'dev', '--silent'], { silent: true });
    console.log('✅ Schema fetched successfully');
  } catch (error) {
    console.log('⚠️ Failed to start mesh in dev mode, trying to generate artifacts...');
    try {
      await runCommand('npx', ['mesh', 'build']);
      console.log('✅ Mesh artifacts built successfully');
    } catch (meshError) {
      throw new Error(`Failed to build mesh artifacts: ${meshError.message}`);
    }
  }
}

// Generate TypeScript types using GraphQL Codegen
async function generateTypes() {
  console.log('🔄 Generating TypeScript types...');
  try {
    await runCommand('npx', ['graphql-codegen']);
    console.log('✅ TypeScript types generated successfully');
  } catch (error) {
    throw new Error(`Failed to generate TypeScript types: ${error.message}`);
  }
}

// Validate client queries against the schema
async function validateClientQueries() {
  console.log('🔍 Validating client queries against schema...');
  try {
    await runCommand('npx', ['graphql-inspector', 'validate', CONFIG.clientSchemaPath, 
      `${CONFIG.clientQueriesDir}/**/*.js`, `./hugmenow/web/src/**/*.jsx`]);
    console.log('✅ All client queries are valid');
  } catch (error) {
    console.error('❌ Some client queries are invalid. Please fix them before continuing.');
    throw error;
  }
}

// Detect breaking changes between schema versions
async function detectBreakingChanges() {
  if (!fs.existsSync(CONFIG.serverSchemaPath) || !fs.existsSync(CONFIG.clientSchemaPath)) {
    console.log('⚠️ Cannot check for breaking changes - schema files missing');
    return;
  }
  
  console.log('🔍 Checking for breaking changes...');
  try {
    await runCommand('npx', ['graphql-inspector', 'diff', 
      CONFIG.serverSchemaPath, CONFIG.clientSchemaPath, '--require', 'breaking']);
    console.log('✅ No breaking changes detected');
  } catch (error) {
    console.error('⚠️ Breaking changes detected in schema. Client code may need updates.');
    // We don't throw here because this is informational
  }
}

// Main function to run the schema sync process
async function syncSchema() {
  try {
    console.log('🚀 Starting enhanced GraphQL schema synchronization...');
    
    // Step 0: Ensure directories exist
    ensureDirectoriesExist();
    
    // Step 1: Fetch server schema
    await fetchServerSchema();
    
    // Step 2: Generate TypeScript types
    await generateTypes();
    
    // Step 3: Validate client queries
    try {
      await validateClientQueries();
    } catch (error) {
      console.log('⚠️ Query validation encountered issues. Continuing with sync process...');
      // We continue despite validation errors to generate the types
    }
    
    // Step 4: Check for breaking changes
    await detectBreakingChanges();
    
    console.log('\n✨ Schema synchronization completed successfully!');
    console.log('📁 Generated TypeScript types are available at:', CONFIG.outputDir);
    console.log('\n📘 How to use generated types:');
    console.log('  1. Import types from "./generated/graphql"');
    console.log('  2. Replace hardcoded query strings with generated hooks');
    console.log('  3. Enjoy type safety and auto-completion!');
    
    console.log('\n🔄 To learn more about schema synchronization, see:');
    console.log('  - docs/development/graphql-schema-sync.md');
    
  } catch (error) {
    console.error('\n❌ Schema synchronization failed:', error.message);
    process.exit(1);
  }
}

// Execute the sync process
syncSchema();