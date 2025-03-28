#!/bin/bash

# Direct Apollo Server Startup Script
# This script starts a simplified Apollo Server that proxies to PostGraphile

# Import the gateway configuration
source ./gateway-config.js 2>/dev/null || true

# Default configuration
PORT="${PORT:-5001}"
API_ENDPOINT="${API_ENDPOINT:-http://localhost:3003/graphql}"
CLIENT_VERSION="${CLIENT_VERSION:-1.0.0}"
CLIENT_PLATFORM="${CLIENT_PLATFORM:-web}"
CLIENT_FEATURES="${CLIENT_FEATURES:-mood-tracking,friend-moods}"
SERVICE_NAME="${SERVICE_NAME:-DirectApolloGateway}"
UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-PostGraphile}"

# Output configuration
echo "🔧 Starting $SERVICE_NAME with configuration:"
echo "  Port: $PORT"
echo "  API Endpoint: $API_ENDPOINT"
echo "  Client Version: $CLIENT_VERSION"
echo "  Platform: $CLIENT_PLATFORM"
echo "  Features: $CLIENT_FEATURES"

# Clean up any existing processes on the port
function cleanup_port() {
  local port="$1"
  echo "🔪 Cleaning up any existing processes on port $port..."
  
  # Find and kill any processes listening on the port
  lsof -i :$port -t | xargs kill -9 2>/dev/null || true
}

# Cleanup the port
cleanup_port $PORT

# Export environment variables for the Node.js process
export PORT=$PORT
export GRAPHQL_API_ENDPOINT=$API_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES
export SERVICE_NAME=$SERVICE_NAME
export UPSTREAM_SERVICE=$UPSTREAM_SERVICE

# Make sure we have the schema file
if [ ! -f "postgraphile-schema.graphql" ]; then
  echo "⚠️ Schema file not found, downloading..."
  node download-postgraphile-schema.js
fi

# Start the Apollo Server
echo "🌐 Starting Direct Apollo Server on http://0.0.0.0:$PORT/graphql..."
exec node mesh-apollo-direct.js