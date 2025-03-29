
#!/bin/bash

# Simple script to test if CORS and host allowance is working properly
echo "Testing deployment host configuration..."
echo "Checking if hug-network-holaolgam.replit.app is properly allowed in vite.config.js"

# Check if vite.config.js contains the hostname
if grep -q "hug-network-holaolgam.replit.app" hugmenow/web/vite.config.js; then
  echo "✅ Host is properly configured in vite.config.js"
else
  echo "❌ Host is not properly configured. Please check vite.config.js"
  exit 1
fi

echo "Configuration looks good. You can rebuild and deploy the application now."
echo "To rebuild: cd hugmenow/web && npm run build"
echo "To deploy: Use the deployment feature in the Replit interface"
