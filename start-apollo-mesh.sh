#!/bin/bash

# Enhanced Apollo Mesh Gateway Startup Script
# This script starts the Apollo Mesh Gateway with advanced GraphQL Mesh capabilities

# Import the gateway configuration
source ./gateway-config.js 2>/dev/null || true

# Set environment and operating mode
NODE_ENV="${NODE_ENV:-development}"
ENABLE_CACHE="${ENABLE_CACHE:-true}"
CACHE_TTL="${CACHE_TTL:-300}"
DEBUG_MODE="${DEBUG_MODE:-true}"
USE_MIDDLEWARE="${USE_MIDDLEWARE:-true}"

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
  GRAPHQL_API_ENDPOINT="${GRAPHQL_API_ENDPOINT:-$POSTGRAPHILE_ENDPOINT}"
  SERVICE_NAME="${SERVICE_NAME:-$APOLLO_MESH_SERVICE}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-$POSTGRAPHILE_SERVICE}"
else
  echo "⚠️ gateway-config.js not found, using default configuration..."
  
  # Default configuration
  PORT="${PORT:-5003}"
  GRAPHQL_API_ENDPOINT="${GRAPHQL_API_ENDPOINT:-http://localhost:3003/postgraphile/graphql}"
  SERVICE_NAME="${SERVICE_NAME:-ApolloMeshGateway}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-PostGraphile}"
fi

# Enhanced client configuration with expanded feature set
CLIENT_VERSION="${CLIENT_VERSION:-2.0.0}"
CLIENT_PLATFORM="${CLIENT_PLATFORM:-web}"
CLIENT_FEATURES="${CLIENT_FEATURES:-mood-tracking,friend-moods,theme-customization,mood-streaks,notifications}"

# Output enhanced configuration
echo "🔧 Starting Enhanced $SERVICE_NAME with configuration:"
echo "  Environment: $NODE_ENV"
echo "  Port: $PORT"
echo "  Target API: $GRAPHQL_API_ENDPOINT"
echo "  Cache: ${ENABLE_CACHE}, TTL: ${CACHE_TTL}s"
echo "  Client Version: $CLIENT_VERSION"
echo "  Platform: $CLIENT_PLATFORM"
echo "  Features: $CLIENT_FEATURES"
echo "  Debug Mode: $DEBUG_MODE"

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
export NODE_ENV=$NODE_ENV
export GRAPHQL_API_ENDPOINT=$GRAPHQL_API_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES
export SERVICE_NAME=$SERVICE_NAME
export UPSTREAM_SERVICE=$UPSTREAM_SERVICE
export DEBUG_MODE=$DEBUG_MODE
export DISABLE_CACHE=$([ "$ENABLE_CACHE" = "false" ] && echo "true" || echo "false")
export CACHE_TTL=$CACHE_TTL
export USE_MIDDLEWARE=$USE_MIDDLEWARE

# Check if the gateway file exists
if [ ! -f "apollo-mesh-gateway.js" ]; then
  echo "❌ Error: apollo-mesh-gateway.js file not found!"
  exit 1
fi

# Use the simplified implementation that doesn't depend on GraphQL Mesh
echo "🌐 Starting Apollo Mesh Gateway on http://0.0.0.0:$PORT/graphql..."
exec node apollo-mesh-gateway.js