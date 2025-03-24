/**
 * GraphQL Mesh Auth Plugin
 * 
 * Provides unified authentication and authorization across all GraphQL services
 * in the HugMood application.
 */

const jwt = require('jsonwebtoken');

module.exports = {
  async onRequest(request, context) {
    // Extract token from Authorization header
    const token = request.headers.authorization?.split(' ')[1] || '';
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production'
        );
        
        // Attach user data to context for use in resolvers
        context.user = decoded;
        
      } catch (error) {
        console.error('Token verification error:', error.message);
        // Token invalid - but we'll still allow the request to go through
        // so that public resources can be accessed
      }
    }
    
    return request;
  },
  
  // Hook for checking permissions on specific operations
  async onOperation(executionArgs, context) {
    // Get operation metadata for permission checks
    const { operationName, operation } = executionArgs;
    
    // Define resources requiring authentication
    const protectedOperations = [
      // User operations
      'updateUser', 'deleteUser', 'updateProfile',
      // Mood operations
      'createMood', 'updateMood', 'deleteMood', 'setupMoodReminder',
      // Hug operations
      'sendHug', 'requestHug', 'createGroupHug', 'joinGroupHug',
      // Dashboard operations
      'wellnessDashboard'
    ];
    
    // Check if operation requires authentication
    if (protectedOperations.includes(operationName) && !context.user) {
      throw new Error('Authentication required for this operation');
    }
    
    return executionArgs;
  },
  
  // Optional: Hook for customizing the result of operations
  async onResult(result, executionArgs, context) {
    // Process result if needed (e.g., add global metadata)
    if (result.data) {
      return {
        ...result,
        extensions: {
          ...result.extensions,
          requestId: context.requestId,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    return result;
  },
  
  // Error handler
  async onError(error, executionArgs, context) {
    // Log and process error
    console.error('GraphQL Error:', error.message);
    
    // You can modify the error before it's returned to the client
    return error;
  }
};