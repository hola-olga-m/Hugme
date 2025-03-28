#!/bin/bash

# Make script executable
chmod +x start-postgraphile.sh

# Load configuration from gateway-config.js if possible
if [ -f ./gateway-config.js ]; then
  echo "🔍 Loading configuration from gateway-config.js..."
  
  # Extract service name from the configuration file
  POSTGRAPHILE_SERVICE=$(grep -o "POSTGRAPHILE: '[^']*'" ./gateway-config.js | cut -d "'" -f 2)
  
  # Extract port from the configuration file
  POSTGRAPHILE_PORT=$(grep -o "POSTGRAPHILE: [0-9]*" ./gateway-config.js | grep -o "[0-9]*")
  
  # Set environment variables from config
  export POSTGRAPHILE_PORT="${POSTGRAPHILE_PORT:-$POSTGRAPHILE_PORT}"
  export SERVICE_NAME="${SERVICE_NAME:-$POSTGRAPHILE_SERVICE}"
  
  echo "📊 Using configuration from gateway-config.js:"
  echo "  Service: $SERVICE_NAME"
  echo "  Port: $POSTGRAPHILE_PORT"
else
  echo "⚠️ gateway-config.js not found, using default configuration..."
  
  # Default configuration
  export POSTGRAPHILE_PORT="${POSTGRAPHILE_PORT:-3003}"
  export SERVICE_NAME="${SERVICE_NAME:-PostGraphile}"
  
  echo "📊 Using default configuration:"
  echo "  Service: $SERVICE_NAME"
  echo "  Port: $POSTGRAPHILE_PORT"
fi

# Start the PostGraphile server
echo "🚀 Starting $SERVICE_NAME server on port $POSTGRAPHILE_PORT..."
node postgraphile-server.js