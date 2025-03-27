#!/bin/bash

# Make script executable
chmod +x start-postgraphile.sh

# Start the PostGraphile server
echo "Starting PostGraphile server..."
node postgraphile-server.js