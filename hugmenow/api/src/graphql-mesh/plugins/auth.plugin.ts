import { Logger } from '@nestjs/common';
import { Plugin } from '@envelop/core';

export default class AuthPlugin {
  private readonly logger = new Logger('GraphQLAuth');
  private jwtSecret: string;

  constructor(options: { jwtSecret?: string } = {}) {
    this.jwtSecret = options.jwtSecret || process.env.JWT_SECRET || 'your-secret-key';
  }

  onInit(options: any): any {
    return {
      ...options,
      context: async (initialContext: any) => {
        const { req } = initialContext;
        let user: any = null;
        
        // Extract token from authorization header
        const authHeader = req?.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          try {
            // Simple JWT verification
            // In a real application, this should use proper JWT verification
            user = this.verifyToken(token);
            this.logger.debug(`User authenticated: ${user.username || user.sub}`);
          } catch (error) {
            this.logger.error(`Invalid JWT token: ${error.message}`);
          }
        }
        
        return {
          ...initialContext,
          user,
          isAuthenticated: !!user,
        };
      },
    };
  }

  onExecute(execute: any): any {
    return async (options: any) => {
      const { operation, context } = options;
      
      // Example of operation-based authorization
      const operationName = operation.name?.value;
      const isAuthRequired = this.requiresAuth(operation);
      
      if (isAuthRequired && !context.isAuthenticated) {
        throw new Error('Authentication required for this operation');
      }
      
      return execute(options);
    };
  }
  
  // Simple JWT verification
  // In production, use a proper JWT library
  private verifyToken(token: string): any {
    try {
      // Basic verification - in production use a proper JWT library
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error('Token expired');
      }
      
      return payload;
    } catch (error) {
      this.logger.error(`Error verifying token: ${error.message}`);
      throw new Error('Invalid token');
    }
  }
  
  private requiresAuth(operation: any): boolean {
    // Implement logic to determine if operation requires authentication
    // For example, check operation name, fields, etc.
    const operationName = operation.name?.value;
    const nonAuthOperations = ['login', 'register', 'anonymousLogin', 'publicQuery', '_health', '_sdl', '_meshInfo'];
    
    return !nonAuthOperations.includes(operationName);
  }
}