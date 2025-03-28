
#!/bin/bash

echo "🔄 Restarting HugMeNow application..."

# Kill any existing app processes
pkill -f "node.*hugmenow" || true
sleep 1

# Clear error logs
echo "🧹 Clearing application error logs..."
> ./hugmenow/web/src/graphql/error.log

# Start the application
echo "🚀 Starting application..."
bash start-hugmenow.sh
