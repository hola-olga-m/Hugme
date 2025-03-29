#!/bin/bash

# Clean up any existing processes
echo "Cleaning up existing processes..."
pkill -f "node.*PORT=5005" || true
pkill -f "node.*direct-test-server.js" || true

# Wait a moment for ports to be released
sleep 1

# Start the test server
echo "Starting direct test server on port 5005..."
node direct-test-server.js