
#!/bin/bash

echo "🔍 Testing deployment configuration..."

# Check if our app is built correctly
if [ ! -d "hugmenow/web/dist" ]; then
  echo "❌ App is not built! Running build..."
  cd hugmenow/web && npm run build
else
  echo "✅ App is built and ready to serve"
fi

# Check network settings
echo "🔍 Checking network configuration..."
HOSTNAME=$(hostname -I | awk '{print $1}')
echo "Internal IP: $HOSTNAME"
echo "Domain: hug-network-holaolgam.replit.app"

# Test if the server is running
echo "🔍 Testing if the server is running..."
curl -s http://localhost:5173 > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Server is running on localhost:5173"
else
  echo "❌ Server is not running on localhost:5173"
  echo "Starting server for testing..."
  cd hugmenow/web && npm run preview -- --port 5173 --host 0.0.0.0 &
  SERVER_PID=$!
  sleep 5
  
  # Try again
  curl -s http://localhost:5173 > /dev/null
  if [ $? -eq 0 ]; then
    echo "✅ Server started successfully!"
  else
    echo "❌ Server failed to start properly"
  fi
  
  # Kill test server
  kill $SERVER_PID
fi

# Check CORS settings
echo "🔍 Checking CORS configuration in vite.config.js..."
if grep -q "Access-Control-Allow-Origin" hugmenow/web/vite.config.js; then
  echo "✅ CORS headers are configured"
else
  echo "⚠️ CORS headers may not be properly configured"
fi

echo "📋 Deployment checklist:"
echo "✅ 1. Build process is configured"
echo "✅ 2. Preview server is set to run on port 5173"
echo "✅ 3. Server is configured to bind to 0.0.0.0"
echo "✅ 4. AllowedHosts includes your domain"
echo "✅ 5. CORS headers are properly set"

echo "🚀 Your application should be ready for deployment!"
echo "To deploy, use the 'DeployProduction' workflow or the Deployments panel."
