#!/bin/bash

echo "🚀 Starting Live Query Demo Server..."

# Kill any existing processes
pkill -f "node serve-demo.js" || true
pkill -f "node fix-demo-server.js" || true

# Start the demo server
node fix-demo-server.js