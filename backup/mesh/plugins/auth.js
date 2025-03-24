const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production';

module.exports = {
  name: 'AuthPlugin',
  onRequest: async ({ request, context }) => {
    // Extract token from headers
    const authHeader = request?.headers?.authorization;
    let user = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        // Verify token
        user = jwt.verify(token, JWT_SECRET);
        
        // Set user in context for resolvers
        context.user = user;
        context.token = token;
        
        // Add user ID to headers for downstream services
        request.headers['x-user-id'] = user.userId;
        if (user.isAnonymous) {
          request.headers['x-anonymous'] = 'true';
        }
      } catch (error) {
        console.error('Token verification error:', error.message);
      }
    }

    return { request, context };
  },

  onResponse: async ({ response, context }) => {
    // Log successful operations
    if (response?.data && !response?.errors) {
      const operationName = context.operationName || 'Unknown operation';
      if (context.user) {
        const userId = context.user.userId || 'anonymous';
        console.debug(`Successful operation "${operationName}" for user ${userId}`);
      } else {
        console.debug(`Successful unauthenticated operation "${operationName}"`);
      }
    }

    return { response, context };
  }
};