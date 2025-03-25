const { Logger } = require('@nestjs/common');
const jwt = require('jsonwebtoken');

class AuthPlugin {
  constructor(options = {}) {
    this.logger = new Logger('GraphQLAuth');
    this.jwtSecret = options.jwtSecret || process.env.JWT_SECRET;
  }

  onInit() {
    return [{
      name: 'GraphQLAuthPlugin',
      onContextBuilding: async ({ context }) => {
        // Return early if context already has auth info
        if (context.user) {
          return { ...context };
        }

        try {
          // Handle both regular authorization header and WebSocket connection params
          const token = this.extractToken(context);
          
          if (token) {
            // Verify and decode the token
            const decodedToken = this.verifyToken(token);
            
            // Add user info to context
            return {
              ...context,
              user: decodedToken,
              isAuthenticated: true
            };
          }
        } catch (error) {
          this.logger.warn(`Authentication error: ${error.message}`);
        }

        // Return context without auth info if no valid token found
        return {
          ...context,
          isAuthenticated: false
        };
      }
    }];
  }

  onExecute(execute) {
    return async (options) => {
      const { context, document } = options;
      
      // Check if operation requires authentication
      if (this.requiresAuth(document) && !context.isAuthenticated) {
        throw new Error('Authentication required for this operation');
      }
      
      return execute(options);
    };
  }

  // Extract token from various sources (HTTP headers, WebSocket connection params)
  extractToken(context) {
    // Extract from HTTP headers
    if (context.req) {
      const authHeader = context.req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }
    }
    
    // Extract from WebSocket connection params
    if (context.connectionParams && context.connectionParams.authorization) {
      const authHeader = context.connectionParams.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }
    }
    
    return null;
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      this.logger.warn(`Token verification failed: ${error.message}`);
      throw error;
    }
  }

  // Check if the operation requires authentication based on directives
  requiresAuth(document) {
    if (!document) return false;
    
    // Check for @authenticated directive
    const hasAuthDirective = document.definitions.some(definition => {
      if (definition.kind === 'OperationDefinition') {
        // Check operation directives
        if (definition.directives && definition.directives.some(d => d.name.value === 'authenticated')) {
          return true;
        }
        
        // Check selection set directives
        if (definition.selectionSet && definition.selectionSet.selections) {
          return definition.selectionSet.selections.some(selection => {
            return selection.directives && selection.directives.some(d => d.name.value === 'authenticated');
          });
        }
      }
      return false;
    });
    
    return hasAuthDirective;
  }
}

module.exports = AuthPlugin;