#!/bin/bash

# GraphQL Mesh with Apollo Server Startup Script
# This script starts a GraphQL Mesh with Apollo Server integration

# Configuration
PORT=5001  # Using a different port to avoid conflicts
API_ENDPOINT="http://localhost:3003/graphql"  # PostGraphile port
CLIENT_VERSION="1.0.0"
CLIENT_PLATFORM="web"
CLIENT_FEATURES="mood-tracking,friend-moods,theme-support,streak-tracking"

echo "🚀 Starting GraphQL Mesh with Apollo Server..."

# Kill any existing processes on this port
fuser -k $PORT/tcp 2>/dev/null || true

# Set environment variables
export PORT=$PORT
export GRAPHQL_API_ENDPOINT=$API_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES

# Start the Mesh Apollo Server
echo "🌐 Starting Mesh Apollo Server on http://0.0.0.0:$PORT/graphql..."
exec node mesh-apollo-server.js