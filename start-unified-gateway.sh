#!/bin/bash

# Unified GraphQL Gateway Startup Script
# This script starts a unified GraphQL gateway that combines features from multiple gateways

# Load configuration from gateway-config.js if possible
if [ -f ./gateway-config.js ]; then
  echo "🔍 Loading configuration from gateway-config.js..."
  
  # Extract service names from the configuration file
  POSTGRAPHILE_SERVICE=$(grep -o "POSTGRAPHILE: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  
  # Extract ports from the configuration file
  POSTGRAPHILE_PORT=$(grep -o "POSTGRAPHILE: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  
  # Extract endpoint from configuration file
  POSTGRAPHILE_ENDPOINT=$(grep -o "POSTGRAPHILE: \`[^}]*\`" ./gateway-config.js | head -1 | cut -d '`' -f 2)
  
  # Default configuration from extracted values
  PORT="${PORT:-5007}"
  API_ENDPOINT="${API_ENDPOINT:-$POSTGRAPHILE_ENDPOINT}"
  SERVICE_NAME="${SERVICE_NAME:-UnifiedGraphQLGateway}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-$POSTGRAPHILE_SERVICE}"
else
  echo "⚠️ gateway-config.js not found, using default configuration..."
  
  # Default configuration
  PORT="${PORT:-5007}"
  API_ENDPOINT="${API_ENDPOINT:-http://localhost:3003/postgraphile/graphql}"
  SERVICE_NAME="${SERVICE_NAME:-UnifiedGraphQLGateway}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-PostGraphile}"
fi

# Client configuration
CLIENT_VERSION="${CLIENT_VERSION:-1.0.0}"
CLIENT_PLATFORM="${CLIENT_PLATFORM:-web}"
CLIENT_FEATURES="${CLIENT_FEATURES:-mood-tracking,friend-moods,theme-support,streak-tracking}"

echo "🚀 Starting ${SERVICE_NAME}..."

# Set environment variables
export PORT=$PORT
export API_ENDPOINT=$API_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES
export SERVICE_NAME=$SERVICE_NAME
export UPSTREAM_SERVICE=$UPSTREAM_SERVICE

# Kill any existing node processes that might be using the port
echo "🔪 Cleaning up any existing processes on port $PORT..."
fuser -k $PORT/tcp 2>/dev/null || echo "lsof not available, skipping port cleanup"

# Wait a moment to ensure the port is fully released
sleep 1

# Start the gateway server
echo "🌐 Starting gateway on http://0.0.0.0:$PORT/graphql..."
exec node unified-gateway.js