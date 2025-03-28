# HugMeNow

An advanced emotional wellness platform providing personalized mental health support through intuitive mobile experiences.

## Features

- Track and share moods with friends
- Send and receive virtual "hugs" for emotional support
- View mood history and streaks
- Customize theme based on current mood
- Real-time updates with Live Queries

## Technical Architecture

HugMeNow uses a GraphQL microservice architecture with:

- React Native for cross-platform mobile development
- GraphQL Mesh for API gateway functionality
- PostgreSQL database with PostGraphile
- GraphQL Live Queries for real-time data updates

## Live Query Implementation

HugMeNow implements Live Queries as a simpler alternative to GraphQL Subscriptions:

1. **Simple Client Implementation**: Just add `@live` directive to any query
2. **Automatic Updates**: Data refreshes automatically when it changes
3. **No WebSocket Management**: No need to manage WebSocket connections
4. **Compatible with Existing Code**: Works with your existing query components

### Example Client Code

```javascript
const PUBLIC_MOODS_QUERY = gql`
  query PublicMoods @live {
    publicMoods(limit: 5) {
      id
      mood
      intensity
      message
      user {
        username
      }
    }
  }
`;

function PublicMoodsComponent() {
  const { loading, error, data } = useQuery(PUBLIC_MOODS_QUERY);
  
  // Component will automatically refresh when new data is available
  // No manual subscription handling needed!
}
```

## Mock Authentication for Testing

For testing purposes, HugMeNow supports mock authentication:

1. Add the mock authentication token to your GraphQL requests:
   ```
   Authorization: Bearer mock-auth-token-for-testing
   ```

2. This will authenticate you as a test user with ID `mock-user-123`

3. Use the mock user ID in your queries:
   ```graphql
   query UserMoods @live {
     userMoods(userId: "mock-user-123", limit: 5) {
       mood
       intensity
       message
     }
   }
   ```

## Gateway Implementations

HugMeNow provides several GraphQL gateway implementations:

1. **Simple Mesh Gateway**: Lightweight implementation with Live Query support
2. **Apollo Mesh Gateway**: Full-featured Apollo Server with advanced caching
3. **Custom GraphQL Gateway**: Specialized implementation with customized resolvers
4. **Enhanced GraphQL Gateway**: Implementation with GraphQL Shield for permissions

## Getting Started

1. Start the PostGraphile server:
   ```
   bash start-postgraphile.sh
   ```

2. Start the Simple Mesh Gateway:
   ```
   bash start-simple-mesh-gateway.sh
   ```

3. Access the GraphiQL playground at http://localhost:5006/graphql

4. Try a Live Query by adding the `@live` directive:
   ```graphql
   query PublicMoods @live {
     publicMoods(limit: 5) {
       mood
       intensity
       message
       user {
         username
       }
     }
   }
   ```

## Testing

### Basic Live Query Tests

Run the basic Live Query tests:
```
bash run-live-query-basic-tests.sh
```

This will verify:
- Basic Live Query functionality
- Client information endpoints
- Mock authentication for user-specific data

### Testing with Mock Authentication

HugMeNow supports mock authentication for testing purposes, which lets you test user-specific functionality without creating real user accounts.

How to use mock authentication in your tests:
```javascript
// Add the mock auth token in your headers
const headers = {
  'Authorization': 'Bearer mock-auth-token-for-testing'
};

// Make requests as normal
fetch('http://localhost:5006/graphql', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    query: `query { userMoods(userId: "mock-user-123") { id mood } }`
  })
});
```

The gateway creates a mock user with the following details:
- ID: `mock-user-123`
- Username: `mockuser`
- Email: `mock@example.com`

## Documentation

For detailed information about HugMeNow's features, see:

- [Live Query Guide](docs/live-query-guide.md) - How to use real-time data updates
- [Mock Authentication Guide](docs/mock-authentication-guide.md) - How to test without real user accounts

## Demo Scripts

Try these scripts to explore HugMeNow's features:

1. **Live Query Demo:**
   ```
   bash run-live-query-basic-tests.sh
   ```

2. **Mock Authentication Demo:**
   ```
   bash run-mock-auth-demo.sh
   ```

3. **Send Hug Demo:**
   ```
   bash run-mutation-tests.sh
   ```

Each demo includes explanations and examples of how to use these features in your own applications.