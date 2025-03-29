#!/bin/bash

# Script to build the Vite application only
echo "====================================================="
echo "Building Vite Application"
echo "====================================================="

# Navigate to the web directory
cd hugmenow/web || { echo "Failed to navigate to hugmenow/web directory"; exit 1; }

# Build the application with the existing npm script
echo "🔨 Building the application with Vite..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build completed successfully"
  echo "Application is built in the dist directory"
else
  echo "❌ Build failed"
  exit 1
fi

echo "====================================================="
echo "To start the built application, run:"
echo "./start-vite-app.sh"
echo "====================================================="