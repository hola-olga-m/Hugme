#!/bin/bash
echo "Starting simple test server on port 5000..."
echo "Killing any existing processes on port 5000"
pkill -f "node.*simple-test.js" || true
pkill -f "node.*PORT=5000" || true
sleep 1
node simple-test.js