#!/bin/bash

# Custom GraphQL Gateway Startup Script (CommonJS)
# This script starts a custom GraphQL gateway that provides field compatibility
# between client and server schemas

# Load configuration from gateway-config.js if possible
if [ -f ./gateway-config.js ]; then
  echo "🔍 Loading configuration from gateway-config.js..."
  
  # Extract service names from the configuration file
  CUSTOM_GATEWAY_SERVICE=$(grep -o "CUSTOM_GATEWAY: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  POSTGRAPHILE_SERVICE=$(grep -o "POSTGRAPHILE: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  
  # Extract ports from the configuration file
  CUSTOM_GATEWAY_PORT=$(grep -o "CUSTOM_GATEWAY: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  POSTGRAPHILE_PORT=$(grep -o "POSTGRAPHILE: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  
  # Extract endpoint from configuration file
  POSTGRAPHILE_ENDPOINT=$(grep -o "POSTGRAPHILE: \`[^}]*\`" ./gateway-config.js | head -1 | cut -d '`' -f 2)
  
  # Default configuration from extracted values
  PORT="${PORT:-$CUSTOM_GATEWAY_PORT}"
  API_ENDPOINT="${API_ENDPOINT:-$POSTGRAPHILE_ENDPOINT}"
  SERVICE_NAME="${SERVICE_NAME:-$CUSTOM_GATEWAY_SERVICE}"
  UPSTREAM_SERVICE="${UPSTREAM_SERVICE:-$POSTGRAPHILE_SERVICE}"
else
  echo "⚠️ gateway-config.js not found, using default configuration..."
  
  # Default configuration
  PORT="${PORT:-5002}"
  API_ENDPOINT="${API_ENDPOINT:-http://localhost:3003/graphql}"
  SERVICE_NAME="${SERVICE_NAME:-CustomGraphQLGateway}"
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
fuser -k $PORT/tcp 2>/dev/null || true

# Wait a moment to ensure the port is fully released
sleep 1

# Make the script executable
chmod +x custom-gateway.cjs

# Start the gateway server
echo "🌐 Starting gateway on http://0.0.0.0:$PORT/graphql..."
exec node custom-gateway.cjs