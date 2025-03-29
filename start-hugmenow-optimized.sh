#!/bin/bash

# Optimized startup script for HugMeNow application
echo "Starting HugMeNow application services (optimized)..."

# Clean up any existing processes
echo "Cleaning up existing processes..."
echo "Killing any Node.js processes that might be using ports 3002 and 5000..."

# Find and kill processes
pkill -f "node.*PORT=3002" || true
pkill -f "node.*PORT=5000" || true
pkill -f "node.*simplified-server.mjs" || true
pkill -f "node.*simple-server.js" || true

# Wait a moment for ports to be released
sleep 1

# Get the API port from environment variable or use default (using 3004 to avoid conflict with PostGraphile)
API_PORT=${API_PORT:-3004}

# Start the API server in the background using the simplified server
echo "Starting API server on port ${API_PORT}..."
cd hugmenow/api && PORT=${API_PORT} node simplified-server.mjs &
API_PID=$!

# Start the frontend server immediately from dist without rebuilding
# Get the frontend port from environment variable or use default (using 3000 to avoid conflict with BasicServer)
FRONTEND_PORT=${PORT:-3000}

# Check if the dist directory exists
if [ ! -d "hugmenow/web/dist" ]; then
  echo "Building the frontend for the first time..."
  cd hugmenow/web && npm run build && cd ../..
else
  echo "Using existing build in dist directory..."
fi

# Start the frontend server
echo "Starting frontend server on port ${FRONTEND_PORT}..."
cd hugmenow/web && PORT=${FRONTEND_PORT} node express-server.js &
FRONTEND_PID=$!

# Display useful information
echo ""
echo "HugMeNow is now running with:"
echo "- API Server running on port ${API_PORT} (PID: $API_PID)"
echo "- Frontend Server running on port ${FRONTEND_PORT} (PID: $FRONTEND_PID)"
echo ""
echo "The frontend is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "The API is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/api"
echo "The GraphQL endpoint is at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/graphql"
echo "The PostGraphile interface is at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/postgraphile/graphiql"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all background processes to complete (or until this script is killed)
wait