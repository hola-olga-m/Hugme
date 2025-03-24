/**
 * GraphQL Mesh Authentication Plugin
 * 
 * This plugin handles authentication for the GraphQL Mesh gateway,
 * integrating with the HugMood authentication system.
 */

const jwt = require('jsonwebtoken');

module.exports = {
  onContext(context, options) {
    // Extract token from authorization header
    const authHeader = context.req.headers.authorization;
    let user = null;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      
      try {
        // Verify token
        user = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production'
        );
      } catch (error) {
        console.error('Token verification error:', error.message);
      }
    }

    // Add authentication data to context
    return {
      ...context,
      user,
      token,
      authHeader
    };
  },

  onOperation(operationContext, options) {
    // Skip authentication check if operation is not protected
    if (!options.protectedOperations.includes(operationContext.operationName)) {
      return operationContext;
    }

    // Check if user is authenticated
    if (!operationContext.contextValue.user) {
      throw new Error('Authentication required for this operation');
    }

    return operationContext;
  }
};