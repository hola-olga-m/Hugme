#!/bin/bash

echo "🔍 Starting Basic Live Query Tests..."

# Restart the gateway with mock authentication support
echo "🔄 Restarting Simple Mesh Gateway with mock authentication support..."
bash start-simple-mesh-gateway.sh &

# Wait for gateway to start
echo "⏳ Waiting for gateway to start..."
sleep 5

# Check if gateway is running
for i in {1..10}; do
  if curl -s http://localhost:5006/health > /dev/null; then
    echo "✅ Gateway is running. Starting tests..."
    node test-live-query-basic.js
    break
  else
    echo "⏳ Waiting for gateway to start... (attempt $i/10)"
    sleep 2
    
    if [ $i -eq 10 ]; then
      echo "❌ Gateway failed to start after multiple attempts."
      exit 1
    fi
  fi
done

# Display key benefits of Live Query
echo "✅ Live Query tests completed!"
echo "🔎 Using the @live directive, clients can receive automatic updates without subscriptions."
echo "💡 Key benefits:"
echo "   - Simpler client code (just add @live to your queries)"
echo "   - Automatic updates when data changes"
echo "   - No need to manually manage subscriptions"
echo "   - Works with existing query code"