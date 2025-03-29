#!/bin/bash

echo "Starting ultra simple server..."

# First, make sure port 5000 is free
echo "Clearing port 5000..."
fuser -k 5000/tcp 2>/dev/null || true

# Wait for a second
sleep 1

# Start the server
echo "Starting server on port 5000..."
node ultra-simple-server.js