# Mock Authentication for HugMeNow Testing

This document explains how to use the mock authentication feature in HugMeNow for testing and development purposes.

## What is Mock Authentication?

Mock authentication is a development and testing feature that allows you to:

1. Test authenticated GraphQL operations without real user accounts
2. Simulate user-specific features during development
3. Run automated tests for protected resources
4. Demonstrate functionality in demos without requiring login flows

## How to Use Mock Authentication

### HTTP Requests

To use mock authentication in HTTP requests, simply add the special authentication header:

```javascript
fetch('http://localhost:5006/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mock-auth-token-for-testing'
  },
  body: JSON.stringify({
    query: `query { userMoods(userId: "mock-user-123", limit: 5) { id mood message } }`
  })
})
```

### With Apollo Client

For React applications using Apollo Client:

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create an HTTP link
const httpLink = createHttpLink({
  uri: 'http://localhost:5006/graphql',
});

// Add mock authentication to requests
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: 'Bearer mock-auth-token-for-testing',
    }
  };
});

// Create the Apollo Client with mock auth
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

### In Component Tests

```javascript
import { MockedProvider } from '@apollo/client/testing';

// Define mocked responses with mock auth
const mocks = [
  {
    request: {
      query: USER_MOODS_QUERY,
      variables: { userId: 'mock-user-123', limit: 5 },
      context: {
        headers: {
          authorization: 'Bearer mock-auth-token-for-testing'
        }
      }
    },
    result: {
      data: {
        userMoods: [
          { id: 'mock-1', mood: 'happy', message: 'Test mood' }
        ]
      }
    }
  }
];

// Use in your test component
const wrapper = (
  <MockedProvider mocks={mocks}>
    <UserMoodsList userId="mock-user-123" />
  </MockedProvider>
);
```

## Mock User Data

When using the mock authentication token, the server creates a mock user with the following details:

```javascript
{
  id: 'mock-user-123',
  username: 'mockuser',
  email: 'mock@example.com'
}
```

You should use these values in your queries and mutations when testing with mock authentication.

## Testing Different Features

### Testing User-Specific Queries

```javascript
// Query a user's moods with mock authentication
const { loading, data } = useQuery(gql`
  query MyMoods($userId: ID!, $limit: Int!) {
    userMoods(userId: $userId, limit: $limit) {
      id
      mood
      intensity
      message
    }
  }
`, {
  variables: {
    userId: 'mock-user-123',
    limit: 5
  }
});
```

### Testing Authenticated Mutations

```javascript
// Create a mood with mock authentication
const [createMood] = useMutation(gql`
  mutation CreateMood($input: MoodInput!) {
    createMood(input: $input) {
      mood {
        id
        mood
        intensity
        message
      }
    }
  }
`);

// Call the mutation
createMood({
  variables: {
    input: {
      mood: {
        userId: 'mock-user-123',
        mood: 'excited',
        intensity: 8,
        message: 'Testing with mock authentication',
        isPublic: true
      }
    }
  }
});
```

### Testing Live Queries

Mock authentication works seamlessly with Live Queries:

```javascript
// Live query with mock authentication
const { loading, data } = useQuery(gql`
  query LiveMoods($userId: ID!, $limit: Int!) @live {
    userMoods(userId: $userId, limit: $limit) {
      id
      mood
      intensity
      message
    }
  }
`, {
  variables: {
    userId: 'mock-user-123',
    limit: 5
  }
});
```

## Command Line Testing

We provide a demo script for testing mock authentication from the command line:

```bash
./run-mock-auth-demo.sh
```

This script demonstrates:
1. Querying user-specific data with mock auth
2. Creating entities with mock auth
3. Using Live Queries with mock auth

## How It Works

The HugMeNow gateway includes special middleware that:

1. Detects the `mock-auth-token-for-testing` token in the Authorization header
2. Creates a mock user context with predefined user data
3. For specific operations with the mock user ID, returns mock data responses
4. For other operations, passes the request through to the underlying API

## Best Practices

1. **Use only in development and testing environments**
   Mock authentication should never be used in production

2. **Keep mock auth code separate from production code**
   Use environment variables or configuration to enable/disable mock auth

3. **Test with real authentication in pre-production**
   While mock auth is great for development, always verify with real auth before deployment

4. **Be aware of limitations**
   Mock auth may not simulate all aspects of your authentication system

## Considerations and Limitations

- Mock auth is simplified and doesn't fully simulate all security aspects
- It does not test actual token validation or expiration
- Mock data is predefined and doesn't reflect real database state
- Not all API features may be supported with mock authentication

## Resources

- [Jest Testing Documentation](https://jestjs.io/docs/tutorial-react)
- [Apollo Client Testing](https://www.apollographql.com/docs/react/development-testing/testing/)
- [GraphQL Testing Best Practices](https://the-guild.dev/blog/graphql-testing-best-practices)