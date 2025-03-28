# HugMeNow Live Query Guide

## Overview

Live Queries are a simpler alternative to GraphQL Subscriptions for implementing real-time updates in your application. This guide explains how to use Live Queries in the HugMeNow application.

## What are Live Queries?

Live Queries allow you to receive real-time updates to your query results without manually implementing complex subscription logic. By simply adding the `@live` directive to your queries, the gateway will automatically push updated results when the underlying data changes.

## Benefits of Live Queries

1. **Simplified Client Code**: Just add `@live` to your queries - no complex subscription setup required
2. **Automatic Updates**: Receive updates when mutations affect query results
3. **No Subscription Management**: No need to manually create, manage, and cancel subscriptions
4. **Works with Existing Queries**: Reuse your existing query code - just add the `@live` directive
5. **Easier Testing**: Mock authentication simplifies testing user-specific data

## How It Works

Behind the scenes, Live Queries use a combination of:

1. GraphQL directives (`@live`) to identify queries that should receive real-time updates
2. A special execution mechanism that keeps track of these queries
3. Smart caching to detect when data has changed and needs to be refreshed
4. WebSockets or Server-Sent Events (SSE) to push updates to clients

## Using Live Queries

### Basic Example

```graphql
query PublicMoods @live {
  publicMoods(limit: 5) {
    id
    mood
    intensity
    message
    createdAt
    user {
      id
      username
    }
  }
}
```

This query will automatically refresh whenever new public moods are created.

### Client Implementation

```javascript
import { gql, useQuery } from '@apollo/client';

const PUBLIC_MOODS_QUERY = gql`
  query PublicMoods @live {
    publicMoods(limit: 5) {
      id
      mood
      intensity
      message
      createdAt
      user {
        id
        username
      }
    }
  }
`;

function PublicMoodsComponent() {
  const { loading, error, data } = useQuery(PUBLIC_MOODS_QUERY);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      <h2>Latest Public Moods</h2>
      <ul>
        {data.publicMoods.map(mood => (
          <li key={mood.id}>
            {mood.user.username} is feeling {mood.mood} ({mood.intensity}/10)
            <p>{mood.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Technical Implementation

Live Queries are implemented in HugMeNow using a lightweight polling approach that:

1. Detects the `@live` directive on incoming queries
2. Sets up a polling mechanism that re-executes the query at regular intervals
3. Pushes updated results to the client when changes are detected
4. Automatically cleans up when the client disconnects

This approach achieves real-time updates without the complexity of GraphQL Subscriptions or WebSockets.

## Live Query vs. Subscriptions

| Feature | Live Queries | Subscriptions |
|---------|-------------|--------------|
| Client Complexity | Low (just add `@live`) | High (subscription setup, management) |
| Server Implementation | Simpler | More complex (WebSockets, PubSub) |
| Update Mechanism | Polling with optimizations | Event-based |
| Resource Usage | Slightly higher | More efficient for many clients |
| Client Code Changes | Minimal | Requires separate subscription code |
| GraphQL Compatibility | Works with standard clients | Requires subscription support |

## Supported Endpoints for Live Queries

The following endpoints support the `@live` directive:

- `publicMoods`: Get real-time updates on public moods
- `userMoods`: Get real-time updates on a user's moods
- `receivedHugs`: Get real-time updates when a user receives new hugs
- `sentHugs`: Get real-time updates on hugs sent by a user

## Testing with Mock Authentication

The HugMeNow Live Query Gateway includes support for mock authentication, which simplifies testing user-specific endpoints and functionality without requiring a real user account. This is especially useful for:

1. **Automated Tests**: Run integration tests without needing to create real user accounts
2. **Development**: Test user-specific features locally without logging in
3. **Demo Purposes**: Demonstrate user-specific features without requiring login

### How to Use Mock Authentication

1. Add a special mock authentication token to your requests:

```javascript
// JavaScript example with Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:5006/graphql',
  headers: {
    authorization: 'Bearer mock-auth-token-for-testing'
  }
});
```

2. Use queries and mutations as normal, and the gateway will automatically:
   - Create a mock user context
   - Simulate user-specific responses
   - Process mutations with mock data

### Mock Testing Limitations

While mock authentication is useful for testing, there are some limitations:

1. **Persistence**: Mock data is not stored in the database
2. **Relationships**: Mock objects may not have all relationships populated
3. **Validation**: Some database-level validations might be bypassed

For production-grade testing, you should use real authentication and test against a proper test database.