# HugMeNow GraphQL Gateway Architecture

This document outlines the gateway architecture for the HugMeNow application, detailing the various GraphQL gateways available and their specific purposes.

## Gateway Overview

HugMeNow implements multiple GraphQL gateway options to provide flexibility in how clients interact with our API:

1. **PostGraphile API** - A direct GraphQL API auto-generated from the PostgreSQL schema
2. **Simple GraphQL Gateway** - Basic proxy with minimal virtual fields
3. **Custom GraphQL Gateway** - Enhanced gateway with field name transformations and permissions
4. **Apollo Mesh Gateway** - Comprehensive gateway with mesh-like capabilities without requiring the full GraphQL Mesh library

## Service Configuration

All gateways and services have standardized configurations in `gateway-config.js`, which includes:

- Service names
- Port assignments
- Endpoint URLs
- Default client information

## Gateway Comparison

| Feature | PostGraphile | Simple Gateway | Custom Gateway | Apollo Mesh Gateway |
|---------|-------------|----------------|----------------|---------------------|
| Port | 3003 | 5000 | 5002 | 5003 |
| Schema transformation | None | Minimal | Extensive | Comprehensive |
| Field naming | PostgreSQL-based | Custom virtual fields | Client-compatible | Flexible mapping |
| Authentication | Basic | Pass-through | Enhanced | Full context support |
| Virtual fields | No | Limited | Yes | Extensive |
| Field-level permissions | No | No | Yes | Yes |
| Error handling | Basic | Basic | Enhanced | Comprehensive |
| Module format | CommonJS | ESM | CommonJS | ESM |

## Apollo Mesh Gateway

### Overview

The Apollo Mesh Gateway provides mesh-like transformation capabilities without requiring the full GraphQL Mesh library, which can have module compatibility issues. It's designed to be more reliable and easier to deploy than the full GraphQL Mesh implementation.

### Key Features

1. **Field Naming Compatibility**: Maps from PostGraphile's naming conventions to client-friendly names
2. **Virtual Fields**: Adds client-specific fields like `score` to mood entries and `read` to hugs
3. **Field Aliases**: Supports multiple field names for the same data (e.g., `isRead` and `read`)
4. **Enhanced Client Info**: Provides comprehensive version and platform information
5. **Transparent Authentication**: Passes auth tokens to the underlying API
6. **Intuitive Resolvers**: Maps complex queries to simpler client-facing fields

### Implementation Details

The Apollo Mesh Gateway is implemented as a standard Apollo Server with custom resolvers that:

1. Map client queries to backend fields
2. Transform response data to match client expectations
3. Add virtual fields not present in the original data
4. Handle authentication and context passing

## Starting Gateways

Each gateway has its own startup script:

- PostGraphile: `bash start-postgraphile.sh`
- Simple Gateway: `bash start-simple-gateway.sh`
- Custom Gateway: `bash start-custom-gateway.sh`
- Apollo Mesh Gateway: `bash start-apollo-mesh.sh`

These scripts automatically load configuration from `gateway-config.js` and set appropriate environment variables.

## Choosing a Gateway

- For development with automatic schema updates: Use **PostGraphile API**
- For basic production use: Use **Simple GraphQL Gateway**
- For enhanced security and permissions: Use **Custom GraphQL Gateway**
- For comprehensive field transformation without module issues: Use **Apollo Mesh Gateway**

## Extending the Gateways

To add new fields or types to any gateway:

1. Add the type definition to the schema
2. Add any necessary resolvers
3. Update tests to verify the new functionality

For virtual fields that don't exist in the underlying API, add a field resolver to the appropriate type.

## Future Improvements

1. Add caching to improve performance
2. Implement subscription support for real-time updates
3. Add more comprehensive error handling and logging
4. Create typed SDKs for client usage