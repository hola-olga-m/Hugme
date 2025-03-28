# GraphQL Mesh SDK

This SDK provides type-safe access to the HugMeNow GraphQL API.

## Usage

### In TypeScript/ES Module environments:

```javascript
import { getSdk } from './mesh-sdk/index.js';
import { fetch } from 'cross-fetch';

// Create a client
const client = getSdk({
  baseUrl: 'http://localhost:5000/graphql',
  fetchFn: fetch,
  token: localStorage.getItem('authToken')  // Optional auth token
});

// Example: Fetch public moods
async function getPublicMoods() {
  const result = await client.PublicMoods();
  console.log(result.publicMoods);
  return result.publicMoods;
}
```

### In CommonJS environments:

```javascript
const { getSdk } = require('./mesh-sdk');
const fetch = require('cross-fetch');

// Create a client
const client = getSdk({
  baseUrl: 'http://localhost:5000/graphql',
  fetchFn: fetch,
  token: process.env.AUTH_TOKEN  // Optional auth token
});

// Example: Fetch public moods
async function getPublicMoods() {
  const result = await client.PublicMoods();
  console.log(result.publicMoods);
  return result.publicMoods;
}
```
