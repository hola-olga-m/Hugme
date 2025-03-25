import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
import { JwtService } from '@nestjs/jwt';

export default class AuthPlugin implements MeshPlugin {
  constructor(private jwtService: JwtService) {}

  onInit(options: GetMeshOptions): GetMeshOptions {
    return {
      ...options,
      context: async (initialContext) => {
        const { req } = initialContext;
        let user = null;
        
        // Extract token from authorization header
        const authHeader = req?.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          try {
            // Verify and decode JWT token
            user = this.jwtService.verify(token);
          } catch (error) {
            console.error('Invalid JWT token', error.message);
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

  onExecute(execute: ExecuteMeshFn): ExecuteMeshFn {
    return async (options) => {
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
  
  private requiresAuth(operation: any): boolean {
    // Implement logic to determine if operation requires authentication
    // For example, check operation name, fields, etc.
    const operationName = operation.name?.value;
    const nonAuthOperations = ['login', 'register', 'anonymousLogin', 'publicQuery'];
    
    return !nonAuthOperations.includes(operationName);
  }
}