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

1. **Simple Unified Gateway**: HTTP-based implementation that avoids GraphQL version conflicts through pure HTTP request delegation, with support for Live Queries and field translation
2. **Simple Mesh Gateway**: Lightweight implementation with Live Query support
3. **Apollo Mesh Gateway**: Full-featured Apollo Server with advanced caching
4. **Custom GraphQL Gateway**: Specialized implementation with customized resolvers
5. **Enhanced GraphQL Gateway**: Implementation with GraphQL Shield for permissions

## Getting Started

1. Start the PostGraphile server:
   ```
   bash start-postgraphile.sh
   ```

2. Start the Simple Unified Gateway (recommended):
   ```
   bash start-simple-unified-gateway.sh
   ```
   
   Or alternatively, start the Simple Mesh Gateway:
   ```
   bash start-simple-mesh-gateway.sh
   ```

3. Access the GraphQL endpoints:
   - Simple Unified Gateway: http://localhost:5007/graphql
   - Simple Unified Gateway Live Queries: http://localhost:5007/live-query
   - Simple Unified Gateway Field Translation: http://localhost:5007/translate
   - Simple Mesh Gateway GraphiQL playground: http://localhost:5006/graphql

4. Try a Live Query by adding the `@live` directive:
   ```graphql
   query GetMoods @live {
     allMoods(first: 5) {
       nodes {
         id
         score
         note
         isPublic
         createdAt
       }
     }
   }
   ```

## Testing

### Live Query Tests

Run the basic Live Query tests:
```
bash run-live-query-basic-tests.sh
```

For testing the Simple Unified Gateway specifically:
```
bash run-unified-live-query-tests.sh
```

These tests verify:
- Basic Live Query functionality
- HTTP-based real-time updates
- WebSocket connections when available
- Field name translation
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
- [UI Versions](UI_VERSIONS.md) - Information about the simplified and comprehensive UI versions

### UI Versions

HugMeNow has two versions of the user interface:

1. **Simplified UI** (Current) - A streamlined version with core functionality
2. **Comprehensive UI** (Backup) - An advanced version with additional features

To switch to the comprehensive UI, run:
```bash
./restore-comprehensive-ui.sh
```

See [UI Versions](UI_VERSIONS.md) for more details.

## Demo Scripts

Try these scripts to explore HugMeNow's features:

1. **Unified Gateway Live Query Demo:**
   ```
   bash run-unified-live-query-tests.sh
   ```

2. **Basic Live Query Demo:**
   ```
   bash run-live-query-basic-tests.sh
   ```

3. **Mock Authentication Demo:**
   ```
   bash run-mock-auth-demo.sh
   ```

4. **Send Hug Demo:**
   ```
   bash run-mutation-tests.sh
   ```

5. **Data Subscription Demo:**
   ```
   bash run-subscription-tests.sh
   ```

Each demo includes explanations and examples of how to use these features in your own applications.