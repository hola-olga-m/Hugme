#!/bin/bash

echo "Starting port 5000 test server..."

# First, make sure port 5000 is free
echo "Clearing port 5000..."
fuser -k 5000/tcp 2>/dev/null || true

# Wait for a second
sleep 1

# Start the server
echo "Starting server on port 5000..."
node port-five-thousand-test.js