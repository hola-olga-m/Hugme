#!/bin/bash

# Custom GraphQL Gateway Startup Script (CommonJS)
# This script starts a custom GraphQL gateway that provides field compatibility
# between client and server schemas

# Configuration
PORT=5000
API_ENDPOINT="http://localhost:3002/graphql"
CLIENT_VERSION="1.0.0"

echo "🚀 Starting Custom GraphQL Gateway..."

# Set environment variables
export PORT=$PORT
export API_ENDPOINT=$API_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION

# Kill any existing node processes that might be using the port
echo "🔪 Cleaning up any existing processes on port $PORT..."
fuser -k $PORT/tcp 2>/dev/null || true

# Wait a moment to ensure the port is fully released
sleep 2

# Make the script executable
chmod +x custom-gateway.cjs

# Start the gateway server
echo "🌐 Starting gateway on http://0.0.0.0:$PORT/graphql..."
exec node custom-gateway.cjs