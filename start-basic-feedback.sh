#!/bin/bash

echo "Starting basic feedback test server..."
echo "This server will run on port 5000"

# First, kill any existing processes on port 5000
echo "Attempting to kill any existing processes on port 5000"
fuser -k 5000/tcp 2>/dev/null || true

# Make sure port is available
sleep 1

# Start the server
node --experimental-modules basic-feedback-test.js