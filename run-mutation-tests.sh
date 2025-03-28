#!/bin/bash

# Set up Node.js options for proper ESM loading
export NODE_OPTIONS="--experimental-specifier-resolution=node"

# Run the test script
echo "Starting mutation tests..."
node test-mutations.js