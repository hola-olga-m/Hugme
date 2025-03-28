
#!/bin/bash

echo "🔄 Restarting HugMeNow application..."

# Kill any existing app processes
echo "🛑 Stopping running processes..."
pkill -f "node.*hugmenow" || true
pkill -f "bash start-hugmenow.sh" || true
pkill -f "node.*simple-server.js" || true
pkill -f "node.*simplified-server.mjs" || true
sleep 2

# Check if processes are still running
if pgrep -f "node.*hugmenow" > /dev/null || pgrep -f "node.*simple-server.js" > /dev/null || pgrep -f "node.*simplified-server.mjs" > /dev/null; then
  echo "⚠️ Some processes are still running. Trying stronger termination..."
  pkill -9 -f "node.*hugmenow" || true
  pkill -9 -f "node.*simple-server.js" || true
  pkill -9 -f "node.*simplified-server.mjs" || true
  sleep 1
fi

# Clear error logs and cache
echo "🧹 Clearing application error logs and cache..."
mkdir -p ./hugmenow/web/src/graphql/
> ./hugmenow/web/src/graphql/error.log

# Remove any cached data that might be causing issues
rm -rf ./hugmenow/web/.cache
rm -rf ./hugmenow/web/dist/cache
rm -rf ./hugmenow/web/node_modules/.cache

# Start the application
echo "🚀 Starting application..."
bash start-hugmenow.sh
