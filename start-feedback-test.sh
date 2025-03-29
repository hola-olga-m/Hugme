#!/bin/bash

echo "Starting feedback test server..."
echo "This server will run on port 5001 to be accessible by the web application feedback tool"

# Find and kill any existing processes on port 5001
echo "Attempting to kill any existing processes on port 5001"
fuser -k 5001/tcp 2>/dev/null || true

# Make sure port is available
sleep 1

# Start the server
node feedback-test-server.js