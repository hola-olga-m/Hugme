#!/bin/bash

# Enhanced GraphQL Mesh Gateway Startup Script
# This script cleans, builds and starts a GraphQL Mesh gateway with robust error handling

# Configuration
MESH_PORT=5000
MESH_HOST="0.0.0.0"
MAX_RETRIES=3
RETRY_DELAY=5

# Don't exit on error immediately
set +e

echo "🚀 Starting GraphQL Mesh gateway..."

# Kill any existing mesh processes
echo "🔪 Killing any existing GraphQL Mesh processes..."
pkill -f "graphql-mesh" || true

# Clean any existing mesh artifacts completely
echo "🧹 Cleaning existing Mesh artifacts..."
rm -rf .mesh/* mesh-artifacts/* node_modules/.mesh/* 2>/dev/null

# Clear require cache for mesh modules
echo "🧼 Cleaning Node.js module cache..."
rm -rf node_modules/.cache 2>/dev/null

# Function to build the mesh with a clean environment
build_mesh() {
  echo "🔧 Building GraphQL Mesh..."
  NODE_ENV=development npx graphql-mesh build --require dotenv/config
  return $?
}

# Function to start the mesh
start_mesh() {
  echo "🌐 Starting Mesh gateway server on port $MESH_PORT..."
  NODE_ENV=production npx graphql-mesh serve --port $MESH_PORT --host $MESH_HOST --require dotenv/config
  return $?
}

# Main execution with simplified approach - build once, then start
echo "📦 Building GraphQL Mesh with clean environment..."
build_mesh

if [ $? -ne 0 ]; then
  echo "❌ Failed to build GraphQL Mesh"
  echo "🔄 Trying again with forced cleanup..."
  
  # Try forcing a clean build
  rm -rf .mesh node_modules/.mesh node_modules/.cache 2>/dev/null
  sleep 2
  
  build_mesh
  
  if [ $? -ne 0 ]; then
    echo "❌ Failed to build GraphQL Mesh after cleanup attempt"
    exit 1
  fi
fi

# Start the server with exec to replace this process
echo "✅ GraphQL Mesh built successfully"
echo "📝 Additional type definitions and resolvers applied"
echo "🌐 Starting Mesh server on http://$MESH_HOST:$MESH_PORT/graphql"

# Use exec to replace the current process
exec npx graphql-mesh serve --port $MESH_PORT --host $MESH_HOST --require dotenv/config