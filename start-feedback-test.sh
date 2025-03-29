#!/bin/bash

# Kill any existing processes using port 5000
echo "Killing any existing processes on port 5000..."
pkill -f "node.*:5000" || true
pkill -f "node.*PORT=5000" || true
sleep 1

# Make executable
chmod +x replit-feedback-test.js

# Start the minimal server
echo "Starting minimal feedback test server on port 5000..."
node replit-feedback-test.js