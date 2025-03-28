#!/bin/bash

echo "Running GraphQL Live Query Tests for HugMeNow"
echo "====================================================="
echo ""

# Default port is 5003, but can be overridden with GATEWAY_PORT env var
PORT=${GATEWAY_PORT:-5003}

# Ensure the Gateway is running on the specified port
if ! curl -s http://localhost:$PORT/health > /dev/null; then
  echo "GraphQL Gateway is not running on port $PORT!"
  echo "Please start the gateway with the appropriate start script."
  exit 1
fi

# Ensure PostGraphile is running
if ! curl -s http://localhost:3003/postgraphile/graphql -X POST -H "Content-Type: application/json" -d '{"query":"{ __typename }"}' > /dev/null; then
  echo "PostGraphile is not running on port 3003!"
  echo "Please start PostGraphile with: bash start-postgraphile.sh"
  exit 1
fi

echo "Running Live Query tests against gateway on port $PORT..."
echo ""

# Run the test script, passing the gateway port as environment variable
node test-live-query.js