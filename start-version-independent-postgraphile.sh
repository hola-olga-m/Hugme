#!/bin/bash

# Simplify startup for workflow
echo "🚀 Starting Version-Independent PostGraphile Proxy..."

# Force kill existing node processes to avoid conflicts
pkill -f "node version-independent-postgraphile.js" || true

# Wait for ports to free up
sleep 2

# Set port environment variable explicitly for Replit workflow
export PORT=3004
# Get postgraphile port from config
export POSTGRAPHILE_PORT=3003

echo "🔗 Proxying to PostGraphile at port $POSTGRAPHILE_PORT"
echo "📊 Listening on port $PORT"

# Start server
node version-independent-postgraphile.js