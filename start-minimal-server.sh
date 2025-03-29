#!/bin/bash

echo "Starting minimal server on port 5000..."

# Kill any existing processes on port 5000
if netstat -tulpn 2>/dev/null | grep ":5000 " > /dev/null; then
  echo "Clearing port 5000..."
  fuser -k 5000/tcp 2>/dev/null
  sleep 1
fi

# Start the minimal server
node minimal-server.js