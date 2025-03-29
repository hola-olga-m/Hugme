#!/bin/bash

# HugMeNow application startup script
echo "Starting HugMeNow application services in development mode..."

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

# Start the API server in the background
echo "Starting API server on port 3002..."
cd hugmenow/api && PORT=3002 node simplified-server.mjs &
API_PID=$!

# Start the frontend server in development mode
echo "Starting frontend server in development mode..."
cd hugmenow/web && npm run dev &
FRONTEND_PID=$!

# Display useful information
echo ""
echo "HugMeNow is now running with:"
echo "- API Server running on port 3002 (PID: $API_PID)"
echo "- Frontend Server running in development mode (PID: $FRONTEND_PID)"
echo ""
echo "The frontend is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "The API is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/api"
echo "The GraphQL endpoint is at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/graphql"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all background processes to complete (or until this script is killed)
wait