#!/bin/bash

# Script to build and run the Vite application
echo "====================================================="
echo "Building and Running Vite Application"
echo "====================================================="

# Kill any existing frontend processes
echo "🧹 Killing any existing frontend processes..."
pkill -f "vite" || true
pkill -f "node.*express-server.js" || true
pkill -f "node.*PORT=5000" || true
sleep 2

# Define frontend port - use port 5000 for Replit compatibility
FRONTEND_PORT=5000

# Navigate to the web directory
cd hugmenow/web || { echo "Failed to navigate to hugmenow/web directory"; exit 1; }

# Check if /dist directory exists and is not empty - reuse if available
if [ -d "dist" ] && [ "$(ls -A dist 2>/dev/null)" ]; then
  echo "🔍 Found existing build in dist directory. Starting server..."
  
  # Start the express server to serve the existing build
  echo "🚀 Starting Express server with existing build on port $FRONTEND_PORT..."
  PORT=$FRONTEND_PORT node express-server.js
else
  # Build and serve the application
  echo "🔨 Building the application with Vite..."
  npm run build
  
  if [ $? -eq 0 ]; then
    echo "✅ Build successful. Starting server..."
    PORT=$FRONTEND_PORT node express-server.js
  else
    echo "❌ Build failed. Check the error messages above."
    exit 1
  fi
fi

# This line won't be reached as the server will keep the process running
echo "✅ Application running on port 5000"
echo "⌨️ Press Ctrl+C to stop"
echo "====================================================="