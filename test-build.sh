
#!/bin/bash

echo "Testing the build process for deployment..."
cd hugmenow/web
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful! Testing preview server..."
  npm run preview -- --port 5173 --host 0.0.0.0 &
  preview_pid=$!
  sleep 5
  
  # Test if the server is responding
  curl -s http://localhost:5173 > /dev/null
  if [ $? -eq 0 ]; then
    echo "✅ Preview server is running correctly!"
  else
    echo "❌ Preview server is not responding properly."
  fi
  
  # Kill the preview server
  kill $preview_pid
else
  echo "❌ Build failed"
fi
