#!/bin/bash

# GraphQL Mesh with Apollo Server Startup Script
# This script starts a GraphQL Mesh with Apollo Server integration

# Service Names (from gateway-config.js)
SERVICE_NAME="GraphQLMeshApollo"
UPSTREAM_SERVICE="PostGraphileAPI"

# Configuration (from gateway-config.js)
PORT=5001  # GraphQLMeshApollo port
API_ENDPOINT="http://localhost:3003/graphql"  # PostGraphileAPI endpoint
CLIENT_VERSION="1.0.0"
CLIENT_PLATFORM="web"
CLIENT_FEATURES="mood-tracking,friend-moods,theme-support,streak-tracking"

echo "🚀 Starting ${SERVICE_NAME}..."

# Kill any existing processes on this port
echo "🔪 Cleaning up any existing processes on port ${PORT}..."
fuser -k $PORT/tcp 2>/dev/null || true

# Wait a moment to ensure the port is fully released
sleep 1

# Set environment variables
export PORT=$PORT
export GRAPHQL_API_ENDPOINT=$API_ENDPOINT
export API_ENDPOINT=$API_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES
export SERVICE_NAME=$SERVICE_NAME
export UPSTREAM_SERVICE=$UPSTREAM_SERVICE

# Copy the required mesh configuration files
cp .meshrc.yml ./mesh-apollo.yml 2>/dev/null || true

# Start the Mesh Apollo Server using ES modules
echo "🌐 Starting Mesh Apollo Server on http://0.0.0.0:$PORT/graphql..."
exec node mesh-apollo-server.mjs