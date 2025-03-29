#!/bin/bash

# Script to run the built Vite application
echo "====================================================="
echo "Starting Built Vite Application"
echo "====================================================="

# Kill any existing frontend processes
echo "🧹 Killing any existing frontend processes..."
pkill -f "node.*express-server.js" || true
sleep 1

# Define frontend port - use port 5000 for Replit compatibility
FRONTEND_PORT=5000

# Navigate to the web directory
cd hugmenow/web || { echo "Failed to navigate to hugmenow/web directory"; exit 1; }

# Check if the dist directory exists
if [ ! -d "dist" ]; then
  echo "❌ Build directory not found. Please run build-vite-app.sh first"
  exit 1
fi

# Start the built application using the express server
echo "🚀 Starting the built application on port ${FRONTEND_PORT}..."
PORT=${FRONTEND_PORT} npm run start

# Display useful information
echo "✅ HugMeNow frontend is now running on port ${FRONTEND_PORT}"
echo "The frontend is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "⌨️ Press Ctrl+C to stop the service"
echo "====================================================="