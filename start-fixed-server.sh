#!/bin/bash

echo "🚀 Starting fixed test server..."

# Kill any existing processes on port 5002
pkill -f "node fixed-server.js" || echo "No existing process found"

# Wait for port to be free
sleep 1

# Start the server
node fixed-server.js