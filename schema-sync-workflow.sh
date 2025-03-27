#!/bin/bash

# GraphQL Schema Synchronization Workflow Script
# This script automates fetching, analyzing, and validating GraphQL schemas
# to maintain compatibility between client and server.

set -e  # Exit on any error

# Configuration
GRAPHQL_ENDPOINT="${GRAPHQL_ENDPOINT:-http://localhost:5000/graphql}"
AUTH_TOKEN="${GRAPHQL_AUTH_TOKEN:-}"
OUTPUT_DIR="./hugmenow/web/src/generated"
SCHEMA_PATH="$OUTPUT_DIR/schema.graphql"
ANALYSIS_DIR="./schema-analysis"
ANALYSIS_REPORT="$ANALYSIS_DIR/mismatch-report.md"

# Ensure needed directories exist
mkdir -p "$OUTPUT_DIR"
mkdir -p "$ANALYSIS_DIR"

echo "🔧 Setting up environment for schema synchronization..."
if [ -z "$AUTH_TOKEN" ]; then
  echo "⚠️ No authentication token found, proceeding without authentication"
  echo "⚠️ Set GRAPHQL_AUTH_TOKEN environment variable if schema fetching fails"
fi

echo "📡 Using GraphQL endpoint: $GRAPHQL_ENDPOINT"

# Function to check if GraphQL server is accessible
check_server() {
  echo "🚀 Starting GraphQL schema synchronization workflow..."
  
  # Simple health check to see if the server is up
  if curl -s -o /dev/null -w "%{http_code}" "$GRAPHQL_ENDPOINT" | grep -q "200\|400"; then
    echo "✅ GraphQL server is accessible"
    return 0
  else
    echo "❌ GraphQL server is not accessible at $GRAPHQL_ENDPOINT"
    return 1
  fi
}

# Function to download schema using custom script
fetch_schema() {
  echo "🔄 Fetching schema and generating TypeScript types..."
  
  # Use our custom schema download script
  node download-schema.js
  
  if [ $? -ne 0 ]; then
    echo "❌ Schema download failed"
    return 1
  fi
  
  return 0
}

# Function to generate TypeScript types with GraphQL Code Generator
generate_types() {
  # Check if schema file exists
  if [ ! -f "$SCHEMA_PATH" ]; then
    echo "❌ Schema file not found at $SCHEMA_PATH"
    return 1
  fi
  
  # Run GraphQL Code Generator
  npx graphql-codegen --config codegen.yml
  
  if [ $? -ne 0 ]; then
    echo "❌ Generating TypeScript types failed"
    return 1
  fi
  
  return 0
}

# Function to analyze schema mismatches
analyze_schema() {
  echo "🔍 Analyzing schema mismatches..."
  
  # Run our custom analysis script
  node fix-schema-mismatches.js
  
  if [ $? -ne 0 ]; then
    echo "❌ Schema mismatch analysis failed"
    return 1
  fi
  
  # Check if any mismatches were found
  if grep -q "No schema mismatches found" "$ANALYSIS_REPORT"; then
    echo "✅ No schema mismatches found"
  else
    echo "⚠️ Schema mismatches found, check $ANALYSIS_REPORT for details"
  fi
  
  return 0
}

# Main workflow execution
main() {
  # Check for analysis-only mode
  if [ "$1" = "--analyze" ]; then
    analyze_schema
    exit $?
  fi
  
  # Run the full workflow
  if check_server; then
    if fetch_schema; then
      if generate_types; then
        echo "✅ Schema synchronization completed successfully"
        
        # Run analysis at the end if requested
        if [ "$1" = "--with-analysis" ]; then
          analyze_schema
        fi
        
        exit 0
      else
        echo "❌ Schema synchronization failed during type generation"
      fi
    else
      echo "❌ Schema synchronization failed during schema fetching"
    fi
  else
    echo "❌ Schema synchronization failed: GraphQL server not accessible"
  fi
  
  exit 1
}

# Execute the main function with any passed arguments
main "$@"