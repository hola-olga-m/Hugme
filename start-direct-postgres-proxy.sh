#!/bin/bash

# Direct Postgres proxy that bypasses GraphQL entirely
echo "🚀 Starting Direct Postgres Proxy..."

# Kill any existing processes on our port
pkill -f "node direct-postgres-proxy.js" || echo "No existing process found"

# Wait for port to be free
sleep 1

# Start the proxy
node direct-postgres-proxy.js