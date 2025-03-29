#!/bin/bash

# Script to only build the Vite application (without serving)
echo "====================================================="
echo "Building Vite Application"
echo "====================================================="

# Navigate to the web directory
cd hugmenow/web || { echo "Failed to navigate to hugmenow/web directory"; exit 1; }

# Clear previous build if it exists
if [ -d "dist" ]; then
  echo "🧹 Clearing previous build..."
  rm -rf dist
fi

# Make sure the node_modules directory exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Execute the build
echo "🔨 Building the application with Vite..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful. The application can now be served with 'serve-built-app.sh'"
  exit 0
else
  echo "❌ Build failed. Check the error messages above."
  exit 1
fi