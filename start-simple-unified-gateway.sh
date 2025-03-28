#!/bin/bash

# Enhanced Simple Unified GraphQL Gateway Startup Script
# This script starts a unified GraphQL gateway with HTTP-based delegation
# to avoid GraphQL version conflicts between different services.

# Load configuration from gateway-config.js if possible
if [ -f ./gateway-config.js ]; then
  echo "🔍 Loading configuration from gateway-config.js..."
  
  # Extract service names from the configuration file
  POSTGRAPHILE_SERVICE=$(grep -o "POSTGRAPHILE: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  AUTH_SERVICE=$(grep -o "AUTH_SERVICE: '[^']*'" ./gateway-config.js | cut -d "'" -f 2 2>/dev/null || echo "$POSTGRAPHILE_SERVICE")
  
  # Extract ports from the configuration file
  POSTGRAPHILE_PORT=$(grep -o "POSTGRAPHILE: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  AUTH_PORT=$(grep -o "AUTH_SERVICE: [0-9]*" ./gateway-config.js | grep -o "[0-9]*" 2>/dev/null || echo "$POSTGRAPHILE_PORT")
  
  # Extract endpoints from configuration file
  POSTGRAPHILE_ENDPOINT=$(grep -o "POSTGRAPHILE: \`[^}]*\`" ./gateway-config.js | head -1 | cut -d '`' -f 2)
  AUTH_ENDPOINT=$(grep -o "AUTH_SERVICE: \`[^}]*\`" ./gateway-config.js | head -1 | cut -d '`' -f 2 2>/dev/null || echo "$POSTGRAPHILE_ENDPOINT")
  
  # Default configuration from extracted values
  PORT="${PORT:-5007}"
  POSTGRAPHILE_ENDPOINT="${POSTGRAPHILE_ENDPOINT:-http://localhost:3003/postgraphile/graphql}"
  AUTH_ENDPOINT="${AUTH_ENDPOINT:-$POSTGRAPHILE_ENDPOINT}"
  SERVICE_NAME="${SERVICE_NAME:-UnifiedGraphQLGateway}"
else
  echo "⚠️ gateway-config.js not found, using default configuration..."
  
  # Default configuration
  PORT="${PORT:-5007}"
  POSTGRAPHILE_ENDPOINT="${POSTGRAPHILE_ENDPOINT:-http://localhost:3003/postgraphile/graphql}"
  AUTH_ENDPOINT="${AUTH_ENDPOINT:-$POSTGRAPHILE_ENDPOINT}"
  SERVICE_NAME="${SERVICE_NAME:-UnifiedGraphQLGateway}"
fi

# Client configuration
CLIENT_VERSION="${CLIENT_VERSION:-1.0.0}"
CLIENT_PLATFORM="${CLIENT_PLATFORM:-web}"
CLIENT_FEATURES="${CLIENT_FEATURES:-mood-tracking,friend-moods,theme-support,streak-tracking}"

echo "🚀 Starting Enhanced ${SERVICE_NAME}..."
echo "📦 Using pure HTTP-based GraphQL delegation to avoid version conflicts"

# Set environment variables
export PORT=$PORT
export POSTGRAPHILE_ENDPOINT=$POSTGRAPHILE_ENDPOINT
export AUTH_ENDPOINT=$AUTH_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES
export SERVICE_NAME=$SERVICE_NAME

# Kill any existing node processes that might be using the port
echo "🔪 Cleaning up any existing processes on port $PORT..."
fuser -k $PORT/tcp 2>/dev/null || echo "lsof not available, skipping port cleanup"

# Wait a moment to ensure the port is fully released
sleep 1

# Start the gateway server
echo "🌐 Starting enhanced gateway on http://0.0.0.0:$PORT/graphql..."
echo "🔗 Upstream GraphQL API: $POSTGRAPHILE_ENDPOINT"
echo "🔐 Upstream Auth API: $AUTH_ENDPOINT"
echo "🧩 WebSocket endpoint: ws://0.0.0.0:$PORT/graphql"

exec node simple-unified-gateway.js