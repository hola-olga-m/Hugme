#!/bin/bash

# Startup script specifically for the web frontend
echo "Starting HugMeNow web frontend..."

# Use port 5000 for the frontend server
cd hugmenow/web && PORT=5000 node simple-server.js