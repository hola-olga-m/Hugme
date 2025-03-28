const { rule } = require('graphql-shield');

// Define an authentication rule 
const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    // Check if there's an authorization header
    const authHeader = context.headers.authorization;
    if (!authHeader) {
      return false;
    }

    // In a real application, this would verify the token
    // For now, just check if a token exists
    const token = authHeader.replace('Bearer ', '');
    return !!token;
  }
);

module.exports = {
  isAuthenticated
};