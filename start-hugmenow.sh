#!/bin/bash

# Startup script for HugMeNow application
echo "Starting HugMeNow application services..."

# Get the API port from environment variable or use default
API_PORT=${API_PORT:-3002}

# Start the API server in the background using the simplified server
echo "Starting API server on port ${API_PORT}..."
cd hugmenow/api && PORT=${API_PORT} node simplified-server.mjs &
API_PID=$!

# Give the API server a moment to start up
sleep 3

# Get the frontend port from environment variable or use default
FRONTEND_PORT=${PORT:-5000}

# Start the frontend server
echo "Starting frontend server on port ${FRONTEND_PORT}..."
cd hugmenow/web && PORT=${FRONTEND_PORT} node simple-server.js &
FRONTEND_PID=$!

# Display useful information
echo ""
echo "HugMeNow is now running with:"
echo "- API Server running on port ${API_PORT} (PID: $API_PID)"
echo "- Frontend Server running on port 5000 (PID: $FRONTEND_PID)"
echo ""
echo "The frontend is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "The API is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/api"
echo "The GraphQL endpoint is at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/graphql"
echo "The PostGraphile interface is at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/postgraphile/graphiql"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all background processes to complete (or until this script is killed)
wait