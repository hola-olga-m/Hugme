#!/bin/bash

echo "🔍 Starting Basic Live Query Tests..."

# Check if gateway is running
if curl -s http://localhost:5006/health > /dev/null; then
  echo "✅ Gateway is running. Starting tests..."
  node test-live-query-basic.js
else
  echo "❌ Gateway is not running. Please start the gateway first."
  exit 1
fi

# Display key benefits of Live Query
echo "✅ Live Query tests completed!"
echo "🔎 Using the @live directive, clients can receive automatic updates without subscriptions."
echo "💡 Key benefits:"
echo "   - Simpler client code (just add @live to your queries)"
echo "   - Automatic updates when data changes"
echo "   - No need to manually manage subscriptions"
echo "   - Works with existing query code"