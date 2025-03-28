# HugMeNow Live Query Guide

This document explains how to use Live Queries in the HugMeNow application, a powerful alternative to traditional GraphQL subscriptions that provides real-time updates with less complexity.

## What Are Live Queries?

Live Queries are a real-time data feature that allows you to:

1. Automatically receive updates when data changes
2. Avoid complex subscription handling
3. Keep UI components synchronized with your data
4. Reduce boilerplate code in your front-end

Live Queries work by adding a simple `@live` directive to your GraphQL queries, which then automatically refresh when relevant data changes.

## How to Use Live Queries

### Basic Example

```javascript
import { useQuery, gql } from '@apollo/client';

// 1. Add the @live directive to your query
const LIVE_MOODS_QUERY = gql`
  query GetPublicMoods($limit: Int!) @live {
    publicMoods(limit: $limit) {
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

// 2. Use it just like a regular query
function PublicMoodsFeed() {
  const { loading, error, data } = useQuery(LIVE_MOODS_QUERY, {
    variables: { limit: 10 }
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  // 3. The data automatically refreshes when new moods are created
  return (
    <div className="moods-feed">
      <h2>Public Moods</h2>
      {data.publicMoods.map(mood => (
        <MoodCard key={mood.id} mood={mood} />
      ))}
    </div>
  );
}
```

### With Authentication

Live Queries work seamlessly with authenticated requests:

```javascript
const USER_MOODS_QUERY = gql`
  query GetUserMoods($userId: ID!, $limit: Int!) @live {
    userMoods(userId: $userId, limit: $limit) {
      id
      mood
      intensity
      message
      createdAt
    }
  }
`;

function UserMoodHistory() {
  const { user } = useAuth();
  const { loading, error, data } = useQuery(USER_MOODS_QUERY, {
    variables: { 
      userId: user.id,
      limit: 5
    }
  });
  
  // Component rendering logic...
}
```

## How It Works

1. The `@live` directive marks a query for real-time updates
2. The gateway keeps track of active live queries
3. When mutations occur (e.g., creating a mood), the gateway identifies affected queries
4. Affected queries are re-executed and updated results are sent to clients
5. The React components automatically re-render with the latest data

## Server Configuration

Live Queries are configured on the server with invalidation rules:

```yaml
plugins:
  - liveQuery:
      invalidations:
        - field: Mutation.createMood
          invalidate:
            - Query.friendsMoods
            - Query.userMoods
            - Mood:{args.input.userId}
        - field: Mutation.sendHug
          invalidate:
            - User:{args.to}.hugs
            - Query.userHugs
```

This configuration tells the server which queries should be refreshed when specific mutations occur.

## Benefits Over Traditional Subscriptions

| Feature | Live Queries | Traditional Subscriptions |
|---------|-------------|--------------------------|
| Client implementation | Simple `@live` directive | Complex subscription handlers |
| State management | Automatic with existing cache | Manual merging with query results |
| Network overhead | Only sends data when it changes | Continuous WebSocket connection |
| Developer experience | Query-like syntax and usage | Different syntax and patterns |
| Error handling | Uses standard query error handling | Requires separate error handling |

## Testing Live Queries

### Using Mock Authentication

For testing purposes, HugMeNow provides a mock authentication mechanism:

```javascript
// Create Apollo client with mock authentication
const client = new ApolloClient({
  uri: 'http://localhost:5006/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: 'Bearer mock-auth-token-for-testing'
  }
});

// Use live queries with mock auth
const { loading, data, error } = useQuery(gql`
  query TestMoods($userId: ID!, $limit: Int!) @live {
    userMoods(userId: $userId, limit: $limit) {
      id
      mood
      intensity
      message
    }
  }
`, {
  variables: {
    userId: "mock-user-123",
    limit: 5
  }
});
```

### Testing Script

We provide a testing script that demonstrates mock authentication with Live Queries:

```bash
./run-mock-auth-demo.sh
```

## Best Practices

1. **Add @live only to queries that need real-time updates**
   Large or complex queries may impact performance if made live unnecessarily

2. **Keep live queries focused and specific**
   Query only the fields you need for real-time updates

3. **Use fragments to share structure between queries**
   This helps maintain consistency between live and non-live queries

4. **Consider caching strategies**
   The Apollo cache policy affects how live updates are handled

5. **Handle loading and error states**
   Live queries may transition between states as updates occur

## Troubleshooting

**Issue**: Live updates not occurring
**Solution**: Ensure the mutation matches an invalidation rule in the gateway configuration

**Issue**: Excessive updates
**Solution**: Check invalidation rules for over-broad patterns and refine them

**Issue**: Performance issues
**Solution**: Make sure you're not using @live on large or expensive queries

## Resources

- [GraphQL Live Query Specification](https://github.com/graphql/graphql-spec/issues/386)
- [GraphQL Mesh Documentation](https://the-guild.dev/graphql/mesh/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)