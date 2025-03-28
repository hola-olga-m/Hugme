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