#!/bin/bash

echo "🔍 Starting Unified Live Query Tests..."

# Ensure the Simple Unified Gateway is running
if ! curl -s http://localhost:5007/health > /dev/null; then
  echo "⚠️  Simple Unified Gateway is not running. Attempting to start it..."
  
  # Start the PostGraphile server if needed
  if ! curl -s http://localhost:3003/postgraphile/graphql > /dev/null; then
    echo "⚠️  PostGraphile is not running. Starting it first..."
    bash start-postgraphile.sh &
    sleep 5
  fi
  
  # Start the Simple Unified Gateway
  bash start-simple-unified-gateway.sh &
  echo "⏳ Waiting for gateway to start..."
  sleep 5
fi

# Wait for the gateway to be ready
attempt=0
while ! curl -s http://localhost:5007/health > /dev/null; do
  attempt=$((attempt+1))
  if [ $attempt -gt 10 ]; then
    echo "❌ Failed to start the Simple Unified Gateway. Tests cannot run."
    exit 1
  fi
  echo "⏳ Waiting for gateway ($attempt/10)..."
  sleep 2
done

echo "✅ Gateway is running. Starting tests..."

# Run the live query tests
node test-unified-live-query.js

# Display completion message
echo "✅ Unified Live Query tests completed!"
echo "🔎 Using the @live directive, clients can receive automatic updates without subscriptions."
echo "💡 Key benefits:"
echo "   - Simpler client code (just add @live to your queries)"
echo "   - Automatic updates when data changes"
echo "   - No need to manually manage subscriptions"
echo "   - Works with existing query code"
echo "   - Supports both HTTP and WebSocket interfaces"
echo ""
echo "📘 How to use in your client application:"
echo "  1. HTTP Approach (for simpler clients):"
echo "     POST to /live-query endpoint with query containing @live directive"
echo "     Set up a polling mechanism in your client to re-fetch periodically"
echo ""
echo "  2. WebSocket Approach (for real-time applications):"
echo "     Connect to ws://localhost:5007/graphql"
echo "     Initialize connection with connection_init message"
echo "     Send start message with query containing @live directive"
echo "     Receive updates automatically when data changes"