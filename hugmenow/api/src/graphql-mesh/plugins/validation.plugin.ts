import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
import { GraphQLError, ValidationContext } from 'graphql';
import { Logger } from '@nestjs/common';

export default class ValidationPlugin implements MeshPlugin {
  private readonly logger = new Logger('GraphQLValidation');
  
  onInit(options: GetMeshOptions): GetMeshOptions {
    // Add custom validation rules
    if (!options.validationRules) {
      options.validationRules = [];
    }
    
    // Add custom validation rules
    options.validationRules.push(
      this.createMaxDepthValidationRule(10), // Prevent deeply nested queries
      this.createMaxAliasesValidationRule(20), // Limit number of aliases to prevent abuse
      this.createDisableIntrospectionRule(false), // Can enable in production for security
    );
    
    return options;
  }

  onExecute(execute: ExecuteMeshFn): ExecuteMeshFn {
    return async (options) => {
      try {
        const result = await execute(options);
        
        // Process errors to make them more user-friendly
        if (result.errors) {
          result.errors = result.errors.map(error => this.formatError(error));
        }
        
        return result;
      } catch (error) {
        // Format unhandled errors
        const formattedError = this.formatError(error);
        return { errors: [formattedError] };
      }
    };
  }
  
  // Custom validation rule to limit query depth
  private createMaxDepthValidationRule(maxDepth: number) {
    return function maxDepthValidationRule(context: ValidationContext) {
      return {
        Field(node) {
          const depth = this.getDepth(node, context);
          if (depth > maxDepth) {
            context.reportError(
              new GraphQLError(
                `Query exceeds maximum depth of ${maxDepth}`,
                [node]
              )
            );
          }
        },
        getDepth(node: any, context: any) {
          let depth = 0;
          let currentNode = node;
          
          while (currentNode.kind !== 'Document') {
            if (currentNode.kind === 'Field' || currentNode.kind === 'InlineFragment') {
              depth++;
            }
            const parentType = context.getParentType();
            if (!parentType) break;
            const parentNode = context.getParentNode();
            if (!parentNode) break;
            currentNode = parentNode;
          }
          
          return depth;
        }
      };
    };
  }
  
  // Custom validation rule to limit number of aliases
  private createMaxAliasesValidationRule(maxAliases: number) {
    return function maxAliasesValidationRule(context: ValidationContext) {
      let aliasCount = 0;
      
      return {
        Alias() {
          aliasCount++;
          if (aliasCount > maxAliases) {
            context.reportError(
              new GraphQLError(
                `Query exceeds maximum number of aliases (${maxAliases})`
              )
            );
          }
        }
      };
    };
  }
  
  // Validation rule to disable introspection in production
  private createDisableIntrospectionRule(disableIntrospection: boolean) {
    return function disableIntrospectionRule(context: ValidationContext) {
      if (!disableIntrospection) return {};
      
      return {
        Field(node) {
          const fieldName = node.name.value;
          if (fieldName === '__schema' || fieldName === '__type') {
            context.reportError(
              new GraphQLError(
                'GraphQL introspection is disabled in production environment',
                [node]
              )
            );
          }
        }
      };
    };
  }
  
  // Format errors to make them more user-friendly and secure
  private formatError(error: any): GraphQLError {
    this.logger.error(`GraphQL error: ${error.message}`, error.stack);
    
    // For security reasons, don't expose internal errors details to clients
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // In production, hide implementation details
      const errorCode = this.getErrorCode(error);
      return new GraphQLError(
        this.getUserFriendlyMessage(error, errorCode),
        error.nodes,
        error.source,
        error.positions,
        error.path,
        error.originalError,
        {
          code: errorCode,
          // Don't include the full stack trace in production
        }
      );
    } else {
      // In development, provide full error details
      return new GraphQLError(
        error.message,
        error.nodes,
        error.source,
        error.positions,
        error.path,
        error.originalError,
        {
          code: this.getErrorCode(error),
          stacktrace: error.stack,
          details: error.originalError?.details,
        }
      );
    }
  }
  
  // Derive error code from error message or type
  private getErrorCode(error: any): string {
    if (error.extensions?.code) {
      return error.extensions.code;
    }
    
    if (error.originalError?.name) {
      return error.originalError.name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
    }
    
    if (error.message.includes('not found')) {
      return 'NOT_FOUND';
    }
    
    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return 'FORBIDDEN';
    }
    
    if (error.message.includes('authentication') || error.message.includes('unauthenticated')) {
      return 'UNAUTHENTICATED';
    }
    
    if (error.message.includes('validation')) {
      return 'VALIDATION_ERROR';
    }
    
    return 'INTERNAL_SERVER_ERROR';
  }
  
  // Provide user-friendly error messages
  private getUserFriendlyMessage(error: any, code: string): string {
    switch (code) {
      case 'NOT_FOUND':
        return 'The requested resource could not be found';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action';
      case 'UNAUTHENTICATED':
        return 'Authentication is required to access this resource';
      case 'VALIDATION_ERROR':
        return 'The provided data is invalid';
      case 'INTERNAL_SERVER_ERROR':
      default:
        return 'An unexpected error occurred';
    }
  }
}