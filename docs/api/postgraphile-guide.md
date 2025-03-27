# PostGraphile Integration Guide

## Overview

PostGraphile automatically creates a GraphQL API from your PostgreSQL database schema. This document explains how to use and interact with the PostGraphile GraphQL API in the HugMeNow application.

## Getting Started

The PostGraphile server is automatically started when you run the main application. It provides a GraphQL API at:

- Direct URL: `http://localhost:3003/postgraphile/graphql`
- Proxy URL: `http://localhost:5000/postgraphile/graphql` (recommended)
- GraphiQL Interface: `http://localhost:5000/postgraphile/graphiql`

## Key Endpoints

1. GraphQL API: `/postgraphile/graphql` - The main endpoint for executing GraphQL queries
2. GraphiQL: `/postgraphile/graphiql` - An interactive web interface for exploring the schema and executing queries
3. Status: `/postgraphile/status` - A simple health check endpoint

## GraphQL Schema

The schema is automatically generated from your PostgreSQL database and includes:

- Tables: Mapped as GraphQL types (e.g., `User`, `Mood`, `Hug`)
- Relationships: Mapped as nested fields
- Queries: For fetching data (e.g., `allUsers`, `userById`, `moodsByUserId`)
- Mutations: For modifying data (e.g., `createUser`, `updateMood`)

## Connection Patterns

PostGraphile uses a connection pattern for lists, which provides pagination:

```graphql
{
  allUsers {
    nodes {     # The actual user objects
      id
      name
    }
    totalCount  # Total number of records
    pageInfo {  # Pagination metadata
      hasNextPage
      endCursor
    }
  }
}
```

## Common Issues

### Multiple GraphQL Instances

If you see errors like:

```
Cannot use GraphQLObjectType "UsersConnection" from another module or realm.
Ensure that there is only one instance of "graphql" in the node_modules directory.
```

This happens when two different versions of the GraphQL library are loaded. To fix it:

1. Use the direct PostGraphile endpoint when testing with the example script
2. Ensure the same GraphQL version is used in all dependencies
3. Add a resolution in package.json:

```json
"resolutions": {
  "graphql": "^16.0.0"
}
```

### Authentication

PostGraphile does not use the same authentication system as the main API. When using PostGraphile directly:

1. For read operations on public data, no authentication is required
2. For sensitive data or mutations, you'll need to implement row-level security in PostgreSQL
3. Learn more about [PostGraphile authentication strategies](https://www.graphile.org/postgraphile/postgresql-schema-design/#authentication-and-authorization)

## Best Practices

1. **Use Conditions**: Filter data at the database level

```graphql
{
  moodsConnection(condition: { userId: "123", isPublic: true }) {
    nodes {
      id
      score
    }
  }
}
```

2. **Order Results**: Use the orderBy parameter

```graphql
{
  allUsers(orderBy: USERNAME_ASC) {
    nodes {
      username
    }
  }
}
```

3. **Pagination**: Limit large result sets

```graphql
{
  allMoods(first: 10, offset: 0) {
    nodes {
      id
      score
    }
  }
}
```

## Example Code

See `postgraphile-example.js` for examples of how to interact with the PostGraphile API from Node.js.

## Further Reading

- [PostGraphile Documentation](https://www.graphile.org/postgraphile/introduction/)
- [PostgreSQL Schema Design for PostGraphile](https://www.graphile.org/postgraphile/postgresql-schema-design/)
- [GraphQL Spec](https://spec.graphql.org/)