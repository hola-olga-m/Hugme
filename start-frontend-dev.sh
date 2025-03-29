#!/bin/bash

# Script to start just the frontend development server
echo "====================================================="
echo "Starting HugMeNow Frontend Development Server"
echo "====================================================="

# Define frontend port - use port 5000 for Replit compatibility
FRONTEND_DEV_PORT=5000

# Check if port is already in use
if lsof -i:$FRONTEND_DEV_PORT > /dev/null 2>&1; then
  echo "⚠️ Warning: Port $FRONTEND_DEV_PORT is already in use. Attempting to free it..."
  fuser -k $FRONTEND_DEV_PORT/tcp || echo "Could not free port $FRONTEND_DEV_PORT"
  sleep 1
fi

# Navigate to web directory and start Vite dev server
echo "🚀 Starting Vite development server on port $FRONTEND_DEV_PORT..."
cd hugmenow/web
# Setting host to 0.0.0.0 makes it accessible from outside the container
# Setting port to 5000 ensures it's accessible through Replit
PORT=$FRONTEND_DEV_PORT npm run dev -- --host 0.0.0.0 --port $FRONTEND_DEV_PORT

echo "✅ Frontend development server started"
echo "====================================================="