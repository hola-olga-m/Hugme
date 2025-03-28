#!/bin/bash

# Ultra simple proxy for testing without version conflicts
echo "🚀 Starting Ultra Simple PostGraphile Proxy..."

# Kill any existing processes on our port
pkill -f "node ultra-simple-postgraphile-proxy.js" || echo "No existing process found"

# Wait for port to be free
sleep 1

# Start the proxy
node ultra-simple-postgraphile-proxy.js