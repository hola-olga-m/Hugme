# Apollo Mesh Gateway

## Overview

The Apollo Mesh Gateway is a lightweight GraphQL gateway implementation that provides mesh-like transformation capabilities without requiring the full GraphQL Mesh library. It's designed to address compatibility issues with ESM/CommonJS modules while still providing powerful schema transformation features.

## Implementation Details

### Key Components

- **apollo-mesh-gateway.js**: Main gateway implementation using Apollo Server
- **start-apollo-mesh.sh**: Startup script that configures and runs the gateway
- **gateway-config.js**: Central configuration for service names, ports, and endpoints

### Architecture

1. The gateway runs on port 5003 (configurable in gateway-config.js)
2. It proxies GraphQL requests to the PostGraphile API running on port 3003
3. It transforms field names and adds virtual fields not present in the original API
4. It adds client-specific information and enhanced error handling
5. It maintains compatibility with client expectations while allowing backend schema to evolve

### Schema Transformations

The gateway implements several schema transformations:

1. **Field Mappings**: 
   - `friendsMoods` ⟷ `publicMoods`
   - `userMoods` ⟷ `moods` 
   - `sentHugs` ⟷ `hugs(type: "sent")`
   - `receivedHugs` ⟷ `hugs(type: "received")`

2. **Virtual Fields**:
   - `MoodEntry.score` - Derived from `intensity`
   - `PublicMood.score` - Derived from `intensity`
   - `Hug.fromUser` - Alias for `sender`
   - `Hug.toUser` - Alias for `recipient`
   - `Hug.read` - Alias for `isRead`

3. **Enhanced Types**:
   - `ClientInfo` - Contains version, platform, and feature information

## Usage

### Starting the Gateway

```bash
# Start with default configuration
bash start-apollo-mesh.sh

# Start with custom port
PORT=5005 bash start-apollo-mesh.sh

# Start with custom target API
TARGET_API=http://other-api:4000/graphql bash start-apollo-mesh.sh
```

### Example Queries

#### Get Client Information

```graphql
query {
  clientInfo {
    version
    buildDate
    platform
    features
  }
}
```

#### Get Friend Moods (Transformed Query)

```graphql
query {
  friendsMoods(limit: 5) {
    id
    intensity
    emoji
    message
    score
    user {
      id
      name
    }
  }
}
```

#### Send a Hug (Mutation)

```graphql
mutation {
  sendHug(input: {
    senderId: "123",
    recipientId: "456",
    message: "Thinking of you!"
  }) {
    id
    message
    fromUser {
      name
    }
    toUser {
      name
    }
    read
  }
}
```

## Extending the Gateway

To add new fields or types:

1. Add the type definition to the `typeDefs` in apollo-mesh-gateway.js
2. Add any necessary resolvers to the `resolvers` object
3. For virtual fields, add field resolvers to the appropriate type

Example:

```javascript
// Add to typeDefs
type User {
  // ... existing fields
  fullName: String  // New virtual field
}

// Add field resolver
User: {
  fullName: (parent) => `${parent.firstName} ${parent.lastName}`
}
```

## Troubleshooting

If the gateway fails to start:

1. Check if PostGraphile API is running on the expected port
2. Verify there are no port conflicts
3. Look for syntax errors in any recent changes
4. Check the logs for specific error messages

## Benefits Over GraphQL Mesh

1. No ESM/CommonJS compatibility issues
2. Simpler deployment and configuration
3. More explicit control over field transformations
4. Easier to debug and understand
5. Faster startup time
6. No additional build steps required