#!/bin/bash

# Apollo Mesh Gateway Startup Script
# This script starts the Apollo Mesh Gateway that transforms and proxies GraphQL requests

# Import the gateway configuration
source ./gateway-config.js 2>/dev/null || true

# Load configuration from gateway-config.js if possible
if [ -f ./gateway-config.js ]; then
  echo "🔍 Loading configuration from gateway-config.js..."
  
  # Extract service names from the configuration file
  APOLLO_MESH_SERVICE=$(grep -o "APOLLO_MESH: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  POSTGRAPHILE_SERVICE=$(grep -o "POSTGRAPHILE: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  
  # Extract ports from the configuration file
  APOLLO_MESH_PORT=$(grep -o "APOLLO_MESH: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  POSTGRAPHILE_PORT=$(grep -o "POSTGRAPHILE: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  
  # Extract endpoint from configuration file
  POSTGRAPHILE_ENDPOINT=$(grep -o "POSTGRAPHILE: \`[^}]*\`" ./gateway-config.js | head -1 | cut -d '`' -f 2)
  
  # Default configuration from extracted values
  PORT="${PORT:-$APOLLO_MESH_PORT}"
  TARGET_API="${TARGET_API:-$POSTGRAPHILE_ENDPOINT}"
  SERVICE_NAME="${SERVICE_NAME:-$APOLLO_MESH_SERVICE}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-$POSTGRAPHILE_SERVICE}"
else
  echo "⚠️ gateway-config.js not found, using default configuration..."
  
  # Default configuration
  PORT="${PORT:-5003}"
  TARGET_API="${TARGET_API:-http://localhost:3003/graphql}"
  SERVICE_NAME="${SERVICE_NAME:-ApolloMeshGateway}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-PostGraphile}"
fi

# Client configuration
CLIENT_VERSION="${CLIENT_VERSION:-1.0.0}"
CLIENT_PLATFORM="${CLIENT_PLATFORM:-web}"
CLIENT_FEATURES="${CLIENT_FEATURES:-mood-tracking,friend-moods}"

# Output configuration
echo "🔧 Starting $SERVICE_NAME with configuration:"
echo "  Port: $PORT"
echo "  Target API: $TARGET_API"
echo "  Client Version: $CLIENT_VERSION"
echo "  Platform: $CLIENT_PLATFORM"
echo "  Features: $CLIENT_FEATURES"

# Clean up any existing processes on the port
function cleanup_port() {
  local port="$1"
  echo "🔪 Cleaning up any existing processes on port $port..."
  
  # Find and kill any processes listening on the port
  if command -v lsof &> /dev/null; then
    lsof -i :$port -t | xargs kill -9 2>/dev/null || true
  else
    echo "lsof not available, skipping port cleanup"
  fi
}

# Cleanup the port
cleanup_port $PORT

# Export environment variables for the Node.js process
export PORT=$PORT
export TARGET_API=$TARGET_API
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES
export SERVICE_NAME=$SERVICE_NAME
export UPSTREAM_SERVICE=$UPSTREAM_SERVICE

# Start the Apollo Mesh Gateway
echo "🌐 Starting Apollo Mesh Gateway on http://0.0.0.0:$PORT/graphql..."
exec node apollo-mesh-gateway.js