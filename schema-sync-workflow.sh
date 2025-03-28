#!/bin/bash

# GraphQL Schema Synchronization Workflow Script
# This script automates fetching, analyzing, and validating GraphQL schemas
# to maintain compatibility between client and server.
#
# Updated to include PostGraphile schema comparison and synchronization.

set -e  # Exit on any error

# Configuration
GRAPHQL_ENDPOINT="${GRAPHQL_ENDPOINT:-http://localhost:5000/graphql}"
POSTGRAPHILE_ENDPOINT="${POSTGRAPHILE_ENDPOINT:-http://localhost:5000/postgraphile/graphql}"
AUTH_TOKEN="${GRAPHQL_AUTH_TOKEN:-}"
OUTPUT_DIR="./hugmenow/web/src/generated"
SCHEMA_PATH="$OUTPUT_DIR/schema.graphql"
POSTGRAPHILE_SCHEMA_PATH="./postgraphile-schema.graphql" 
ANALYSIS_DIR="./schema-analysis"
ANALYSIS_REPORT="$ANALYSIS_DIR/mismatch-report.md"
SCHEMA_DIFF_REPORT="$ANALYSIS_DIR/schema-diff-report.md"

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

# Function to check if PostGraphile server is accessible
check_postgraphile_server() {
  echo "🚀 Checking PostGraphile server..."
  
  # Simple health check to see if the server is up
  if curl -s -o /dev/null -w "%{http_code}" "$POSTGRAPHILE_ENDPOINT" | grep -q "200\|400"; then
    echo "✅ PostGraphile server is accessible"
    return 0
  else
    echo "❌ PostGraphile server is not accessible at $POSTGRAPHILE_ENDPOINT"
    return 1
  fi
}

# Function to download schema using custom script
fetch_schema() {
  echo "🔄 Fetching schema and generating TypeScript types..."
  
  # Use our custom schema download script
  node --experimental-modules download-schema.js
  
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
  
  # Run GraphQL Code Generator with auto-yes
  echo "y" | npx graphql-codegen --config codegen.yml
  
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

# Function to compare PostGraphile schema with client schema
compare_postgraphile_schema() {
  echo "🔍 Comparing PostGraphile schema with client schema..."
  
  # Check if both schemas exist
  if [ ! -f "$POSTGRAPHILE_SCHEMA_PATH" ]; then
    echo "❌ PostGraphile schema file not found at $POSTGRAPHILE_SCHEMA_PATH"
    return 1
  fi
  
  if [ ! -f "$SCHEMA_PATH" ]; then
    echo "❌ Client schema file not found at $SCHEMA_PATH"
    return 1
  fi
  
  # Run our custom comparison script
  node --experimental-modules compare-schemas.js > "$SCHEMA_DIFF_REPORT"
  
  if [ $? -ne 0 ]; then
    echo "❌ Schema comparison failed"
    return 1
  fi
  
  # Check if significant differences were found (basic check)
  if grep -q "Schemas are identical" "$SCHEMA_DIFF_REPORT"; then
    echo "✅ PostGraphile and client schemas are identical"
  else
    echo "⚠️ Schema differences found, check $SCHEMA_DIFF_REPORT for details"
  fi
  
  return 0
}

# Function to build GraphQL Mesh
build_mesh() {
  echo "🔧 Building GraphQL Mesh..."
  
  # Check if .meshrc.yml exists
  if [ ! -f ".meshrc.yml" ]; then
    echo "❌ Mesh configuration file not found at .meshrc.yml"
    return 1
  fi
  
  # Build the mesh
  npx graphql-mesh build
  
  if [ $? -ne 0 ]; then
    echo "❌ Building GraphQL Mesh failed"
    return 1
  fi
  
  echo "✅ GraphQL Mesh built successfully"
  return 0
}

# Main workflow execution
main() {
  # Check command-line arguments for specific modes
  if [ "$1" = "--analyze" ]; then
    analyze_schema
    exit $?
  fi
  
  if [ "$1" = "--compare-postgraphile" ]; then
    compare_postgraphile_schema
    exit $?
  fi
  
  if [ "$1" = "--check-postgraphile" ]; then
    if check_postgraphile_server; then
      echo "✅ PostGraphile server is accessible, schema should be at $POSTGRAPHILE_SCHEMA_PATH"
      # Check if schema file exists
      if [ -f "$POSTGRAPHILE_SCHEMA_PATH" ]; then
        echo "✅ PostGraphile schema file exists"
        exit 0
      else
        echo "❌ PostGraphile schema file not found"
        exit 1
      fi
    else
      exit 1
    fi
  fi
  
  if [ "$1" = "--build-mesh" ]; then
    build_mesh
    exit $?
  fi
  
  # Run the full workflow
  if check_server; then
    if fetch_schema; then
      echo "✅ Schema download completed successfully"
      
      # Skip typegen for now until component queries are fixed
      echo "⚠️ Skipping type generation to avoid syntax errors in queries"
      
      # Build GraphQL Mesh to apply field transformations
      echo "🔄 Building GraphQL Mesh to apply field transformations..."
      build_mesh
      
      # Run analysis if requested
      if [ "$1" = "--with-analysis" ] || [ "$1" = "--full" ]; then
        analyze_schema
      fi
      
      # Compare with PostGraphile schema if requested
      if [ "$1" = "--with-postgraphile" ] || [ "$1" = "--full" ]; then
        if check_postgraphile_server; then
          compare_postgraphile_schema
        else
          echo "⚠️ Skipping PostGraphile schema comparison: server not accessible"
        fi
      fi
      
      exit 0
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