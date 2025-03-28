
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

# Run the GraphQL fixes to ensure all queries are compatible
echo "🔧 Applying GraphQL fixes..."
node fix-graphql.js

# Clear error logs 
echo "🧹 Clearing application error logs..."
mkdir -p ./hugmenow/web/src/graphql/
> ./hugmenow/web/src/graphql/error.log

# Start the application
echo "🚀 Starting application..."
bash start-hugmenow.sh
