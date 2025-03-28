#!/bin/bash

# Simple GraphQL Gateway Startup Script
# This script starts a simple GraphQL gateway to proxy requests to PostGraphile

# Load configuration from gateway-config.js if possible
if [ -f ./gateway-config.js ]; then
  echo "🔍 Loading configuration from gateway-config.js..."
  
  # Extract service names from the configuration file
  SIMPLE_GATEWAY_SERVICE=$(grep -o "SIMPLE_GATEWAY: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  POSTGRAPHILE_SERVICE=$(grep -o "POSTGRAPHILE: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  
  # Extract ports from the configuration file
  SIMPLE_GATEWAY_PORT=$(grep -o "SIMPLE_GATEWAY: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  POSTGRAPHILE_PORT=$(grep -o "POSTGRAPHILE: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  
  # Extract endpoint from configuration file
  POSTGRAPHILE_ENDPOINT=$(grep -o "POSTGRAPHILE: \`[^}]*\`" ./gateway-config.js | head -1 | cut -d '`' -f 2)
  
  # Default configuration from extracted values
  PORT="${PORT:-$SIMPLE_GATEWAY_PORT}"
  TARGET_API="${TARGET_API:-$POSTGRAPHILE_ENDPOINT}"
  SERVICE_NAME="${SERVICE_NAME:-$SIMPLE_GATEWAY_SERVICE}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-$POSTGRAPHILE_SERVICE}"
else
  echo "⚠️ gateway-config.js not found, using default configuration..."
  
  # Default configuration
  PORT="${PORT:-5005}"
  TARGET_API="${TARGET_API:-http://localhost:3003/graphql}"
  SERVICE_NAME="${SERVICE_NAME:-SimpleGraphQLGateway}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-PostGraphile}"
fi

# Client configuration
CLIENT_VERSION="${CLIENT_VERSION:-1.0.0}"
CLIENT_PLATFORM="${CLIENT_PLATFORM:-web}"
CLIENT_FEATURES="${CLIENT_FEATURES:-mood-tracking,friend-moods,theme-support,streak-tracking}"

echo "🚀 Starting ${SERVICE_NAME}..."

# Kill any existing processes on this port
echo "🔪 Cleaning up any existing processes on port ${PORT}..."
fuser -k $PORT/tcp 2>/dev/null || true

# Set environment variables
export PORT=$PORT
export API_ENDPOINT=$TARGET_API
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES
export SERVICE_NAME=$SERVICE_NAME
export UPSTREAM_SERVICE=$UPSTREAM_SERVICE

# Start the Gateway using live-query-gateway.js instead
echo "🌐 Starting Gateway on http://0.0.0.0:$PORT/graphql..."
exec node live-query-gateway.js