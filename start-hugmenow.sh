#!/bin/bash

# Startup script for HugMeNow application
echo "Starting HugMeNow application services..."

# This script is designed to simply launch the individual workflows
# It doesn't actually start the servers - the workflows do that
echo "Setting up workflows..."

# Display useful information
echo "HugMeNow is now configured with:"
echo "- API Server running on port 3001"
echo "- Frontend Server running on port 5000"
echo ""
echo "Use the following workflows to manage services:"
echo "- 'HugMeNow API Server': Manages the API and GraphQL server"
echo "- 'HugMeNow Frontend': Manages the frontend web server"
echo ""
echo "To restart individual services, use the workflow restart buttons"
echo "in the Replit interface."
echo ""
echo "The frontend is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo "The API is accessible at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/api"
echo "The GraphQL endpoint is at: https://${REPL_SLUG}.${REPL_OWNER}.repl.co/graphql"

# Script completed - the actual servers are managed by the workflows
exit 0