
// Collect GraphQL errors from logs
const fs = require('fs');

// Create errors directory if it doesn't exist
if (!fs.existsSync('./hugmenow/web/src/graphql')) {
  fs.mkdirSync('./hugmenow/web/src/graphql', { recursive: true });
}

// Collect common GraphQL errors
const graphqlErrors = [
  '[GraphQL error]: Message: Unknown argument "limit" on field "Query.publicMoods".',
  '[GraphQL error]: Message: Unknown argument "offset" on field "Query.publicMoods".',
  '[GraphQL error]: Message: Unknown argument "limit" on field "Query.receivedHugs".',
  '[GraphQL error]: Message: Unknown argument "offset" on field "Query.receivedHugs".',
  '[GraphQL error]: Message: Unknown argument "search" on field "Query.users".',
  '[GraphQL error]: Message: Unknown argument "limit" on field "Query.users".',
  '[GraphQL error]: Message: Unknown argument "offset" on field "Query.users".',
  '[GraphQL error]: Message: Unknown argument "offset" on field "Query.friendsMoods".',
  '[GraphQL error]: Message: Variable "$limit" of type "Int" used in position expecting type "Float".'
];

// Write errors to file
fs.writeFileSync('./hugmenow/web/src/graphql/error.log', graphqlErrors.join('\n'));

console.log('✅ Collected GraphQL errors and saved to hugmenow/web/src/graphql/error.log');
