# GraphQL Schema Synchronization

This document outlines how GraphQL schema synchronization works in the HugMeNow project and how to use the tools we've implemented to maintain schema compatibility between the client and server.

## Overview

Schema synchronization is essential for maintaining data consistency between the client and server in GraphQL applications. Our solution implements industry best practices to automatically:

1. Fetch the latest schema from the server
2. Generate TypeScript types for client-side development
3. Validate client queries against the server schema
4. Identify and report schema mismatches

## Tools and Configuration

We use the following tools for schema synchronization:

- **GraphQL Code Generator**: Generates TypeScript types from GraphQL schema and operations
- **GraphQL Inspector**: Validates client operations against the server schema
- **GraphQL Mesh** (fallback): Alternative method for schema fetching with advanced features

## Usage

### Automatic Schema Synchronization

To synchronize the schema and generate types:

```bash
./schema-sync-workflow.sh
```

This script:
1. Checks if the GraphQL server is accessible
2. Fetches the latest schema
3. Generates TypeScript types and operations
4. Validates client operations against the schema

### Schema Mismatch Analysis

To analyze schema mismatches between client operations and server schema:

```bash
./schema-sync-workflow.sh --analyze
```

Or run the analysis tool directly:

```bash
node fix-schema-mismatches.js
```

This generates a detailed report in `./schema-analysis/mismatch-report.md` with:
- List of mismatches by file and operation
- Suggestions for fixing each mismatch
- Next steps for resolving issues

## Generated Files

The schema synchronization process generates the following files:

- `./hugmenow/web/src/generated/graphql.tsx`: TypeScript types and React hooks
- `./hugmenow/web/src/generated/schema.graphql`: The server schema in GraphQL SDL format

## Continuous Integration

The schema synchronization workflow can be integrated into CI/CD pipelines to:

1. Validate schema compatibility on pull requests
2. Prevent merging code with schema mismatches
3. Automatically generate updated types when the schema changes

## Troubleshooting

### Common Issues

1. **Schema Fetch Fails**:
   - Ensure the GraphQL server is running
   - Check the GraphQL endpoint URL in `codegen.yml`
   - If authentication is required, set the `GRAPHQL_AUTH_TOKEN` environment variable

2. **Type Generation Fails**:
   - Check for syntax errors in GraphQL operations
   - Ensure operations are compatible with the schema
   - Review the mismatch report for detailed information

3. **Validation Errors**:
   - Use the mismatch report to identify and fix incompatible operations
   - Update client operations to match the server schema or vice versa

## Best Practices

1. **Run schema sync after schema changes**: Whenever the server schema changes, run the schema sync workflow to update types.

2. **Use generated types**: Always use the generated TypeScript types and React hooks for type safety.

3. **Fix mismatches promptly**: Address schema mismatches as soon as they're identified to prevent runtime errors.

4. **Test after schema changes**: After updating the schema or operations, test the application to ensure compatibility.

5. **Document schema evolution**: Keep track of significant schema changes in the project documentation.

## Configuration Files

- `codegen.yml`: Configuration for GraphQL Code Generator
- `.graphqlrc.yml`: GraphQL configuration file
- `.meshrc.yml`: Configuration for GraphQL Mesh (alternative method)

## Additional Resources

- [GraphQL Code Generator Documentation](https://the-guild.dev/graphql/codegen/docs/getting-started)
- [GraphQL Inspector Documentation](https://graphql-inspector.com/docs)
- [GraphQL Mesh Documentation](https://the-guild.dev/graphql/mesh/docs/getting-started/introduction)