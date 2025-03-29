#!/bin/bash

# Comprehensive startup script for HugMeNow application
echo "====================================================="
echo "Starting HugMeNow Comprehensive Application Services"
echo "====================================================="

# Kill specific Node.js processes to clean up environment
echo "🧹 Killing relevant Node.js processes..."
pkill -f "node.*PORT=3002" || true
pkill -f "node.*PORT=3003" || true
pkill -f "node.*PORT=3004" || true
pkill -f "node.*PORT=3006" || true
pkill -f "node.*PORT=5000" || true
pkill -f "node.*PORT=5003" || true
pkill -f "node.*PORT=5006" || true
pkill -f "node.*postgraphile-server.js" || true
pkill -f "node.*direct-postgres-proxy.js" || true
pkill -f "node.*simplified-server.mjs" || true
pkill -f "node.*express-server.js" || true
pkill -f "vite" || true

# Wait to ensure ports are freed
echo "⏱️ Waiting for ports to be released..."
sleep 2

# Clear Vite cache to ensure clean startup
echo "🗑️ Clearing Vite cache..."
rm -rf hugmenow/web/node_modules/.vite || echo "No Vite cache found"

# Define all service ports - modified to avoid conflicts with workflows
POSTGRAPHILE_PORT=5003
DIRECT_POSTGRES_PROXY_PORT=5006
API_PORT=3004
FRONTEND_PORT=5000

# Check if ports are available
echo "🔍 Checking ports availability..."
netstat -tuln | grep -E "$POSTGRAPHILE_PORT|$DIRECT_POSTGRES_PROXY_PORT|$API_PORT|$FRONTEND_PORT" || echo "All ports are available"

# Start PostGraphile server
echo "🚀 Starting PostGraphile server on port $POSTGRAPHILE_PORT..."
POSTGRAPHILE_PORT=$POSTGRAPHILE_PORT node postgraphile-server.js &
POSTGRAPHILE_PID=$!
echo "✅ PostGraphile started with PID: $POSTGRAPHILE_PID"

# Wait for PostGraphile to start
sleep 2

# Start Direct Postgres Proxy
echo "🚀 Starting Direct Postgres Proxy on port $DIRECT_POSTGRES_PROXY_PORT..."
DIRECT_PROXY_PORT=$DIRECT_POSTGRES_PROXY_PORT node direct-postgres-proxy.js &
DIRECT_PROXY_PID=$!
echo "✅ Direct Postgres Proxy started with PID: $DIRECT_PROXY_PID"

# Wait for Direct Postgres Proxy to start
sleep 1

# Start API Server (using simplified server)
echo "🚀 Starting API server on port $API_PORT..."
cd hugmenow/api 
PORT=$API_PORT node simplified-server.mjs &
API_PID=$!
cd ../..
echo "✅ API Server started with PID: $API_PID"

# Wait for API server to initialize
sleep 2

# Start the development frontend server on port 5000 (for Replit)
echo "🚀 Starting development frontend server on port $FRONTEND_PORT..."
cd hugmenow/web
# Setting host to 0.0.0.0 makes it accessible from outside the container
# Using PORT=$FRONTEND_PORT to set environment variable for Vite
PORT=$FRONTEND_PORT npm run dev -- --host 0.0.0.0 --port $FRONTEND_PORT &
FRONTEND_PID=$!
cd ../..
echo "✅ Development frontend server started with PID: $FRONTEND_PID"

# Display service information
echo ""
echo "🎯 HugMeNow is now running with the following services:"
echo "-----------------------------------------------------"
echo "📊 PostGraphile API:       http://localhost:$POSTGRAPHILE_PORT/postgraphile/graphql (PID: $POSTGRAPHILE_PID)"
echo "📊 Direct Postgres Proxy:  http://localhost:$DIRECT_POSTGRES_PROXY_PORT/query (PID: $DIRECT_PROXY_PID)"
echo "📊 API Server:             http://localhost:$API_PORT/graphql (PID: $API_PID)"
echo "📊 Development Frontend:   http://localhost:$FRONTEND_PORT (PID: $FRONTEND_PID)"
echo ""
echo "🌐 Public URLs:"
echo "-----------------------------------------------------"
echo "📱 Frontend:               https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "📱 API:                    https://${REPL_SLUG}.${REPL_OWNER}.repl.co/api"
echo "📱 GraphQL:                https://${REPL_SLUG}.${REPL_OWNER}.repl.co/graphql"
echo "📱 PostGraphile Interface: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/postgraphile/graphiql"
echo ""
echo "⌨️ Press Ctrl+C to stop all services"
echo "====================================================="

# Export PIDs for potential future use
export POSTGRAPHILE_PID
export DIRECT_PROXY_PID
export API_PID
export FRONTEND_PID

# Wait for all background processes
wait