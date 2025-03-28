#!/bin/bash

echo "🔍 Starting Live Query Tests..."

# Ensure the Simple Mesh Gateway is running
if ! curl -s http://localhost:5006/health > /dev/null; then
  echo "⚠️  Simple Mesh Gateway is not running. Attempting to start it..."
  
  # Start the PostGraphile server if needed
  if ! curl -s http://localhost:3003/postgraphile/graphql > /dev/null; then
    echo "⚠️  PostGraphile is not running. Starting it first..."
    bash start-postgraphile.sh &
    sleep 5
  fi
  
  # Start the Simple Mesh Gateway
  bash start-simple-mesh-gateway.sh &
  echo "⏳ Waiting for gateway to start..."
  sleep 5
fi

# Wait for the gateway to be ready
attempt=0
while ! curl -s http://localhost:5006/health > /dev/null; do
  attempt=$((attempt+1))
  if [ $attempt -gt 10 ]; then
    echo "❌ Failed to start the Simple Mesh Gateway. Tests cannot run."
    exit 1
  fi
  echo "⏳ Waiting for gateway ($attempt/10)..."
  sleep 2
done

echo "✅ Gateway is running. Starting tests..."

# Run the live query tests
node test-live-query.js

# Display completion message
echo "✅ Live Query tests completed!"
echo "🔎 Using the @live directive, clients can receive automatic updates without subscriptions."
echo "💡 Key benefits:"
echo "   - Simpler client code (just add @live to your queries)"
echo "   - Automatic updates when data changes"
echo "   - No need to manually manage subscriptions"
echo "   - Works with existing query code"