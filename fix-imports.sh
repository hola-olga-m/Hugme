#!/bin/bash

# Find all JavaScript/JSX files with imports from the old context directory
FILES=$(grep -l "from '.*context/" --include="*.js*" -r hugmenow/web/src/)

# Loop through each file and update the import path
for file in $FILES; do
  echo "Updating $file"
  # Replace "../context/AuthContext" with "../contexts/AuthContext"
  sed -i "s|from '\(.*\)context/AuthContext'|from '\1contexts/AuthContext'|g" "$file"
done

echo "Import paths updated successfully!"