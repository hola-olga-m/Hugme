#!/bin/bash

# Ensure nothing else is using port 5000
echo "Cleaning up any existing processes on port 5000..."
pkill -f "node.*PORT=5000" || true
pkill -f "node.*:5000" || true
sleep 1

# Start the public page server
echo "Starting public page server on port 5000..."
node public-page.js