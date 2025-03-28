#!/bin/bash

echo "🔍 Starting Mock Authentication Demo..."

# Check if SimpleMeshGateway is running
curl -s http://localhost:5006/health > /dev/null
if [ $? -ne 0 ]; then
  echo "🔄 Starting Simple Mesh Gateway with mock authentication support..."
  bash start-simple-mesh-gateway.sh &
  
  # Wait for gateway to start
  echo "⏳ Waiting for gateway to start..."
  sleep 5
  
  for i in {1..10}; do
    if curl -s http://localhost:5006/health > /dev/null; then
      echo "✅ Gateway is running. Starting demo..."
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
else
  echo "✅ Gateway is already running. Starting demo..."
fi

# Run the demo script
node demo-mock-auth.js

echo "✅ Mock Authentication Demo completed!"
echo "🔎 Key benefits of mock authentication:"
echo "   - Test user-specific features without real accounts"
echo "   - Simplify automated testing"
echo "   - Demonstrate functionality in demos without login"
echo "   - Speed up development workflow"