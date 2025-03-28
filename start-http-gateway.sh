#!/bin/bash

echo "🔍 Loading configuration from gateway-config.js..."
echo "🚀 Starting HTTP GraphQL Gateway..."

# Kill any existing processes on the port
echo "🔪 Cleaning up any existing processes on port 5005..."
if command -v lsof &> /dev/null; then
    PORT_PID=$(lsof -t -i:5005 2>/dev/null)
    if [[ ! -z "$PORT_PID" ]]; then
        echo "Killing process $PORT_PID on port 5005"
        kill -9 $PORT_PID
    fi
else
    echo "lsof not available, skipping port cleanup"
fi

# Set environment variables
export API_ENDPOINT="http://localhost:3003/postgraphile/graphql"
export PORT=5005
export NODE_ENV=development
export CLIENT_VERSION="2.0.0"
export CLIENT_PLATFORM="web"
export CLIENT_FEATURES="mood-tracking,friend-moods,theme-customization,mood-streaks,notifications,live-queries"

# Start the HTTP Gateway
echo "🌐 Starting gateway on http://0.0.0.0:5005/graphql..."
node http-gateway.js