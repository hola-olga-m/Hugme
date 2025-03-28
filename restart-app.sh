
#!/bin/bash

echo "🔄 Restarting HugMeNow application..."

# Kill any existing app processes
echo "🛑 Stopping running processes..."
pkill -f "node.*hugmenow" || true
pkill -f "bash start-hugmenow.sh" || true
sleep 2

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
