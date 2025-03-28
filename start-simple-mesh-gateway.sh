#!/bin/bash

echo "🔍 Loading configuration..."
echo "🚀 Starting Live Query Gateway..."

# Kill any existing processes on the port
echo "🔪 Cleaning up any existing processes on port 5006..."
if command -v lsof &> /dev/null; then
    PORT_PID=$(lsof -t -i:5006 2>/dev/null)
    if [[ ! -z "$PORT_PID" ]]; then
        echo "Killing process $PORT_PID on port 5006"
        kill -9 $PORT_PID
    fi
else
    echo "lsof not available, skipping port cleanup"
fi

# Set environment variables
export API_ENDPOINT="http://localhost:3003/postgraphile/graphql"
export PORT=5006
export NODE_ENV=development
export CLIENT_VERSION="2.0.0"
export CLIENT_PLATFORM="web"
export CLIENT_FEATURES="mood-tracking,friend-moods,theme-customization,mood-streaks,notifications,live-queries"

# Start the Live Query Gateway instead (simpler implementation)
echo "🌐 Starting gateway on http://0.0.0.0:5006/graphql..."
node live-query-gateway.js