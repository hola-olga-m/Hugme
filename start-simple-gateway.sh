#!/bin/bash

# Simple GraphQL Gateway Startup Script
# This script starts a simple GraphQL gateway to proxy requests to PostGraphile

# Service Names (from gateway-config.js)
SERVICE_NAME="SimpleGraphQLGateway"
UPSTREAM_SERVICE="PostGraphileAPI" 

# Configuration (from gateway-config.js)
PORT=5000  # SimpleGraphQLGateway port
TARGET_API="http://localhost:3003/graphql"  # PostGraphileAPI endpoint
CLIENT_VERSION="1.0.0"
CLIENT_PLATFORM="web"
CLIENT_FEATURES="mood-tracking,friend-moods,theme-support,streak-tracking"

echo "🚀 Starting ${SERVICE_NAME}..."

# Kill any existing processes on this port
echo "🔪 Cleaning up any existing processes on port ${PORT}..."
fuser -k $PORT/tcp 2>/dev/null || true

# Set environment variables
export PORT=$PORT
export TARGET_API=$TARGET_API
export CLIENT_VERSION=$CLIENT_VERSION
export CLIENT_PLATFORM=$CLIENT_PLATFORM
export CLIENT_FEATURES=$CLIENT_FEATURES
export SERVICE_NAME=$SERVICE_NAME
export UPSTREAM_SERVICE=$UPSTREAM_SERVICE

# Start the Gateway
echo "🌐 Starting Gateway on http://0.0.0.0:$PORT/graphql..."
exec node simple-gateway.js