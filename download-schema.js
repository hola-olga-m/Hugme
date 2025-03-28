#!/usr/bin/env node

// Use ES modules
import fs from 'fs';
import { getIntrospectionQuery, buildClientSchema, printSchema } from 'graphql';

const GRAPHQL_ENDPOINT = 'http://0.0.0.0:5000/graphql';
const OUTPUT_PATH = './hugmenow/web/src/generated/schema.graphql';

async function downloadSchema() {
  console.log(`Downloading schema from ${GRAPHQL_ENDPOINT}...`);
  
  try {
    // Dynamic import for node-fetch
    const { default: fetch } = await import('node-fetch');
    const introspectionQuery = getIntrospectionQuery();
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: introspectionQuery,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const { data } = await response.json();
    
    if (!data) {
      throw new Error('No data returned from introspection query');
    }
    
    // Build and print the schema
    const schema = buildClientSchema(data);
    const sdl = printSchema(schema);
    
    // Create directory if it doesn't exist
    const dir = OUTPUT_PATH.substring(0, OUTPUT_PATH.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the schema to file
    fs.writeFileSync(OUTPUT_PATH, sdl);
    
    console.log(`✅ Schema successfully downloaded to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Error downloading schema:', error.message);
    process.exit(1);
  }
}

downloadSchema();