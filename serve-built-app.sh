#!/bin/bash

# Script to serve the already-built Vite application
echo "====================================================="
echo "Serving Pre-built Vite Application"
echo "====================================================="

# Kill any existing express server processes
echo "🧹 Cleaning up any existing server processes..."
pkill -f "node.*express-server.js" || true
sleep 1

# Define frontend port - use port 5000 for Replit compatibility
FRONTEND_PORT=5000

# Navigate to the web directory
cd hugmenow/web || { echo "Failed to navigate to hugmenow/web directory"; exit 1; }

# Check if /dist directory exists and is not empty
if [ -d "dist" ] && [ "$(ls -A dist 2>/dev/null)" ]; then
  echo "🔍 Found existing build in dist directory."
  
  # Start the express server to serve the existing build
  echo "🚀 Starting Express server on port $FRONTEND_PORT..."
  PORT=$FRONTEND_PORT node express-server.js
else
  echo "❌ No build found in dist directory. Please run build script first."
  exit 1
fi