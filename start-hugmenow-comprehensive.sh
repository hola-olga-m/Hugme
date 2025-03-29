#!/bin/bash

# Comprehensive startup script for HugMeNow application
echo "====================================================="
echo "Starting HugMeNow Comprehensive Application Services"
echo "====================================================="

# Kill ALL Node.js processes to clean up environment completely
echo "🧹 Killing all Node.js processes..."
pkill -f "node" || echo "No Node.js processes found"

# Wait to ensure ports are freed
echo "⏱️ Waiting for ports to be released..."
sleep 2

# Clear any cache folders
echo "🗑️ Clearing caches..."
rm -rf .cache || echo "No .cache directory found"
rm -rf hugmenow/web/.cache || echo "No frontend cache directory found"
rm -rf hugmenow/web/node_modules/.vite || echo "No Vite cache found"
rm -rf .mesh/.cache || echo "No Mesh cache found"

# Define all service ports
POSTGRAPHILE_PORT=3003
DIRECT_POSTGRES_PROXY_PORT=3006
API_PORT=3004
FRONTEND_DEV_PORT=3000
FRONTEND_PROD_PORT=5000

# Check all ports to make sure they're not in use
echo "🔍 Checking ports availability..."
for port in $POSTGRAPHILE_PORT $DIRECT_POSTGRES_PROXY_PORT $API_PORT $FRONTEND_DEV_PORT $FRONTEND_PROD_PORT; do
  if lsof -i:$port > /dev/null 2>&1; then
    echo "⚠️ Warning: Port $port is still in use. Attempting to free it..."
    fuser -k $port/tcp || echo "Could not free port $port"
    sleep 1
  fi
done

# Start PostGraphile server
echo "🚀 Starting PostGraphile server on port $POSTGRAPHILE_PORT..."
node postgraphile-server.js &
POSTGRAPHILE_PID=$!
echo "✅ PostGraphile started with PID: $POSTGRAPHILE_PID"

# Wait for PostGraphile to start
sleep 2

# Start Direct Postgres Proxy
echo "🚀 Starting Direct Postgres Proxy on port $DIRECT_POSTGRES_PROXY_PORT..."
node direct-postgres-proxy.js &
DIRECT_PROXY_PID=$!
echo "✅ Direct Postgres Proxy started with PID: $DIRECT_PROXY_PID"

# Wait for Direct Postgres Proxy to start
sleep 1

# Start API Server (using simplified server)
echo "🚀 Starting API server on port $API_PORT..."
cd hugmenow/api && PORT=$API_PORT node simplified-server.mjs &
API_PID=$!
cd ../..
echo "✅ API Server started with PID: $API_PID"

# Wait for API server to initialize
sleep 2

# Start Vite dev server in the background
echo "🚀 Starting Vite development server on port $FRONTEND_DEV_PORT..."
cd hugmenow/web && PORT=$FRONTEND_DEV_PORT npm run dev &
VITE_PID=$!
cd ../..
echo "✅ Vite dev server started with PID: $VITE_PID"

# Start the production frontend server
echo "🚀 Starting production frontend server on port $FRONTEND_PROD_PORT..."

# Check if build exists, if not create it
if [ ! -d "hugmenow/web/dist" ]; then
  echo "📦 Building frontend for production..."
  cd hugmenow/web && npm run build && cd ../..
else
  echo "📦 Using existing production build..."
fi

cd hugmenow/web && PORT=$FRONTEND_PROD_PORT node express-server.js &
FRONTEND_PID=$!
cd ../..
echo "✅ Production frontend server started with PID: $FRONTEND_PID"

# Display service information
echo ""
echo "🎯 HugMeNow is now running with the following services:"
echo "-----------------------------------------------------"
echo "📊 PostGraphile API:       http://localhost:$POSTGRAPHILE_PORT/postgraphile/graphql (PID: $POSTGRAPHILE_PID)"
echo "📊 Direct Postgres Proxy:  http://localhost:$DIRECT_POSTGRES_PROXY_PORT/query (PID: $DIRECT_PROXY_PID)"
echo "📊 API Server:             http://localhost:$API_PORT/graphql (PID: $API_PID)"
echo "📊 Vite Dev Server:        http://localhost:$FRONTEND_DEV_PORT (PID: $VITE_PID)"
echo "📊 Production Frontend:    http://localhost:$FRONTEND_PROD_PORT (PID: $FRONTEND_PID)"
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
export VITE_PID
export FRONTEND_PID

# Wait for all background processes
wait