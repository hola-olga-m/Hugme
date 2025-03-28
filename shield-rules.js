const { rule, and, or, not, allow, deny } = require('graphql-shield');

// Enhanced error logging for authentication issues
const logAuthError = (errorMessage, context) => {
  console.error(`[Shield] Authentication error: ${errorMessage}`, {
    path: context.path,
    user: context.user?.id || 'anonymous',
    ip: context.headers['x-forwarded-for'] || context.ip || 'unknown',
    userAgent: context.headers['user-agent'] || 'unknown'
  });
  return false;
};

// Base authentication rule with improved caching and error handling
const isAuthenticated = rule({ 
  cache: 'contextual',
  fragmentable: true 
})(
  async (parent, args, context, info) => {
    try {
      // Check if there's an authorization header
      const authHeader = context.headers?.authorization;
      if (!authHeader) {
        return logAuthError('No authorization header present', context);
      }

      // Extract token
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        return logAuthError('Empty token', context);
      }

      // In a real application, this would fully verify the token
      // For dev/test environments, we consider any non-empty token valid
      context.userId = extractUserIdFromToken(token);
      context.user = { id: context.userId };
      context.isAuthenticated = true;
      
      return true;
    } catch (error) {
      return logAuthError(`Authentication error: ${error.message}`, context);
    }
  }
);

// Extract a user ID from a token (simplified for development)
function extractUserIdFromToken(token) {
  // In a real app, this would decode and validate a JWT
  // For now, if token contains 'user-', treat it as a user ID
  if (token.includes('user-')) {
    return token;
  }
  
  // For demo tokens, generate a consistent user ID
  return `user-${token.substring(0, 8)}`;
}

// Higher-level permission rules
const isOwner = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    // Check if user is authenticated
    if (!context.isAuthenticated) return false;
    
    // Check if the requested resource belongs to the user
    const userId = args.userId || args.input?.userId || parent?.userId;
    return userId === context.userId;
  }
);

const hasAdminRole = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    // This is a placeholder for role-based access control
    // In a real app, you would check for admin roles in the token
    return context.headers?.authorization?.includes('admin');
  }
);

// Combine rules for complex authorization scenarios
const isAuthenticatedOrPublic = or(
  isAuthenticated, 
  rule({ cache: 'contextual' })(
    async (parent, args, context, info) => {
      // Allow if the data is marked as public
      return parent?.public === true || parent?.isPublic === true;
    }
  )
);

// Export all rules
module.exports = {
  isAuthenticated,
  isOwner,
  hasAdminRole,
  isAuthenticatedOrPublic,
  allow,
  deny
};