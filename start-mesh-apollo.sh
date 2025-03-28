#!/bin/bash

# GraphQL Mesh with Apollo Server Startup Script
# This script starts a GraphQL Mesh instance integrated with Apollo Server

# Configuration
PORT=5000
API_ENDPOINT="http://localhost:3002/graphql"
CLIENT_VERSION="1.0.0"

echo "🚀 Starting GraphQL Mesh with Apollo integration..."

# Set environment variables
export PORT=$PORT
export API_ENDPOINT=$API_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION

# Kill any existing processes that might be using the port
echo "🔪 Cleaning up any existing processes on port $PORT..."
fuser -k $PORT/tcp 2>/dev/null || true

# Wait a moment to ensure the port is fully released
sleep 2

# Start the Mesh+Apollo server
echo "🌐 Starting Mesh+Apollo on http://0.0.0.0:$PORT/graphql..."
exec node mesh-apollo-server.js