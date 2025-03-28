#!/bin/bash

# GraphQL Mesh with CLI Startup Script
# This script starts a GraphQL Mesh instance using the CLI

# Configuration
PORT=5001  # Using a different port to avoid conflicts
API_ENDPOINT="http://localhost:3002/graphql"
CLIENT_VERSION="1.0.0"

echo "🚀 Starting GraphQL Mesh with CLI..."

# Set environment variables
export PORT=$PORT
export GRAPHQL_API_ENDPOINT=$API_ENDPOINT
export CLIENT_VERSION=$CLIENT_VERSION

# Start the Mesh gateway using the CLI
echo "🌐 Starting Mesh on http://0.0.0.0:$PORT/graphql..."
exec npx mesh dev --port $PORT --host 0.0.0.0 --require ./mesh-resolvers.js