#!/bin/bash

# Simple GraphQL Gateway Startup Script
# This script starts a simple GraphQL gateway to proxy requests to PostGraphile

# Configuration
PORT=5000
TARGET_API="http://localhost:3003/postgraphile/graphql"
CLIENT_VERSION="1.0.0"

echo "🚀 Starting Simple GraphQL Gateway..."

# Set environment variables
export PORT=$PORT
export TARGET_API=$TARGET_API
export CLIENT_VERSION=$CLIENT_VERSION

# Start the Gateway
echo "🌐 Starting Gateway on http://0.0.0.0:$PORT/graphql..."
exec node simple-gateway.js