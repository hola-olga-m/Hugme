#!/bin/bash

# Start Vite Application Script - Development Mode
echo "====================================================="
echo "Starting Vite Application - Development Mode"
echo "====================================================="

# Kill any existing frontend processes
echo "🧹 Killing any existing frontend processes..."
pkill -f "vite" || true
pkill -f "node.*express-server.js" || true
sleep 1

# Define frontend port - use port 5000 for Replit compatibility
FRONTEND_PORT=5000

# Navigate to the web directory
cd hugmenow/web

# Start the development server directly using the dev script
echo "🚀 Starting Vite development server on port ${FRONTEND_PORT}..."
npm run dev -- --host 0.0.0.0 --port ${FRONTEND_PORT}

# Display useful information (this won't be shown as the dev server will take over the console)
echo "✅ HugMeNow frontend is now running on port ${FRONTEND_PORT}"
echo "The frontend is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "⌨️ Press Ctrl+C to stop the service"
echo "====================================================="