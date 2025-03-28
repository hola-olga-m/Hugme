#!/bin/bash

echo "Running GraphQL Subscription Tests for HugMeNow"
echo "====================================================="
echo ""

# Ensure Apollo Mesh Gateway is running
if ! curl -s http://localhost:5003/health > /dev/null; then
  echo "Apollo Mesh Gateway is not running on port 5003!"
  echo "Please start the gateway with: bash start-apollo-mesh.sh"
  exit 1
fi

# Ensure PostGraphile is running
if ! curl -s http://localhost:3003/postgraphile/graphql -X POST -H "Content-Type: application/json" -d '{"query":"{ __typename }"}' > /dev/null; then
  echo "PostGraphile is not running on port 3003!"
  echo "Please start PostGraphile with: bash start-postgraphile.sh"
  exit 1
fi

echo "Running subscription tests..."
echo ""

# Run the test script
node test-subscriptions.js