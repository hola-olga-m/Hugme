#!/bin/bash

# Startup script for HugMeNow application
echo "Starting HugMeNow application services..."

# Start the API server in the background
echo "Starting API server on port 3001..."
cd hugmenow/api && node dist/main.js &
API_PID=$!

# Give the API server a moment to start up
sleep 3

# Start the frontend server
echo "Starting frontend server on port 5000..."
cd hugmenow/web && node simple-server.js &
FRONTEND_PID=$!

# Display useful information
echo ""
echo "HugMeNow is now running with:"
echo "- API Server running on port 3001 (PID: $API_PID)"
echo "- Frontend Server running on port 5000 (PID: $FRONTEND_PID)"
echo ""
echo "The frontend is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "The API is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/api"
echo "The GraphQL endpoint is at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/graphql"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all background processes to complete (or until this script is killed)
wait