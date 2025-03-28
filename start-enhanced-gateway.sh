#!/bin/bash

# Start Enhanced GraphQL Gateway
# This script starts the enhanced gateway that uses GraphQL Shield and Schema Merger

# Load configuration from gateway-config.js
echo "🔍 Loading configuration from gateway-config.js..."
# Using hardcoded values for now since we have module import issues
GATEWAY_PORT=5004
API_ENDPOINT="http://localhost:3003/postgraphile/graphql"

# Display startup info
echo "🚀 Starting EnhancedGraphQLGateway..."
echo "🔪 Cleaning up any existing processes on port $GATEWAY_PORT..."

# Kill any process running on the port
fuser -k $GATEWAY_PORT/tcp 2>/dev/null || true

# Set the port for the gateway
export PORT=$GATEWAY_PORT
# Set API endpoint for the gateway to connect to
export API_ENDPOINT=$API_ENDPOINT

echo "🌐 Starting gateway on http://0.0.0.0:$GATEWAY_PORT/graphql..."

# Start the gateway
node enhanced-gateway.js