#!/bin/bash

# Startup script for HugMeNow application
echo "Starting HugMeNow application services..."

# Check if API server is already running
if curl -s http://localhost:3001/health > /dev/null; then
  echo "API server is already running on port 3001"
  API_RUNNING=true
else
  # Start the API server first (NestJS)
  echo "Starting API server on port 3001..."
  cd hugmenow/api && NODE_ENV=production node dist/main.js &
  API_PID=$!
  API_RUNNING=false

  # Wait for API server to be ready
  echo "Waiting for API server to be ready..."
  MAX_RETRIES=30
  RETRY_COUNT=0
  while ! curl -s http://localhost:3001/health > /dev/null; do
    echo "API server not ready yet, retrying in 1 second..."
    sleep 1
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
      echo "Failed to start API server after $MAX_RETRIES attempts"
      kill $API_PID 2>/dev/null
      exit 1
    fi
  done
  echo "API server is running!"
fi

API_STATUS=$(curl -s http://localhost:3001/health)
echo "API Status: $API_STATUS"

# Check if Frontend server is already running
if curl -s http://localhost:5000/health-check > /dev/null || curl -s http://localhost:5000/health-text > /dev/null; then
  echo "Frontend server is already running on port 5000"
  FRONTEND_RUNNING=true
else
  # Start the Frontend server with the improved server implementation
  echo "Starting Frontend server on port 5000..."
  cd /home/runner/workspace/hugmenow/web && node improved-server.cjs &
  FRONTEND_PID=$!
  FRONTEND_RUNNING=false

  # Wait for Frontend server to be ready
  echo "Waiting for Frontend server to be ready..."
  MAX_RETRIES=30
  RETRY_COUNT=0
  while ! (curl -s http://localhost:5000/health-check > /dev/null || curl -s http://localhost:5000/health-text > /dev/null); do
    echo "Frontend server not ready yet, retrying in 1 second..."
    sleep 1
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
      echo "Failed to start Frontend server after $MAX_RETRIES attempts"
      [ "$API_RUNNING" = false ] && kill $API_PID 2>/dev/null
      kill $FRONTEND_PID 2>/dev/null
      exit 1
    fi
  done
  echo "Frontend server is running!"
fi

FRONTEND_STATUS=$(curl -s http://localhost:5000/health)
echo "Frontend Status: $FRONTEND_STATUS"

# Display useful information
echo ""
echo "HugMeNow is now running with:"
echo "- API Server running on port 3001"
echo "- Frontend Server running on port 5000"
echo ""
echo "The frontend is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "The API is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/api"
echo "The GraphQL endpoint is at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/graphql"
echo "Health check endpoints:"
echo "- Full status page: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/health-check"
echo "- JSON response: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/health"
echo "- Plain text: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/health-text"
echo "Server info endpoint: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/info"

# Wait for both servers to complete (they should run indefinitely)
echo ""
echo "Services are now running. Press Ctrl+C to stop..."

# Only wait if we started any servers
if [ "$API_RUNNING" = false ] || [ "$FRONTEND_RUNNING" = false ]; then
  # If we started at least one server, wait for it
  if [ "$API_RUNNING" = false ] && [ "$FRONTEND_RUNNING" = false ]; then
    wait $API_PID $FRONTEND_PID
  elif [ "$API_RUNNING" = false ]; then
    wait $API_PID
  elif [ "$FRONTEND_RUNNING" = false ]; then
    wait $FRONTEND_PID
  fi
else
  # If we didn't start any servers, just exit successfully
  echo "All servers were already running. Exiting script."
  exit 0
fi