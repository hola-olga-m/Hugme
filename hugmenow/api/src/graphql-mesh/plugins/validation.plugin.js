const { Logger } = require('@nestjs/common');
const { 
  GraphQLError, 
  ValidationContext,
  getOperationRootNode,
  Kind
} = require('graphql');

/**
 * GraphQL Mesh plugin for enhanced validation rules and error handling
 */
class ValidationPlugin {
  constructor(options = {}) {
    this.logger = new Logger('GraphQLValidation');
    this.options = {
      maxDepth: options.maxDepth || 10,
      maxAliases: options.maxAliases || 20,
      disableIntrospection: options.disableIntrospection || false,
      ...options
    };
    
    this.validationErrors = [];
    this.errorCounts = {};
  }

  onInit() {
    return [{
      name: 'GraphQLValidationPlugin'
    }];
  }

  onExecute(execute) {
    return async (options) => {
      const { document, schema } = options;
      
      try {
        // Create custom validation rules
        const customRules = [
          this.createMaxDepthValidationRule(this.options.maxDepth),
          this.createMaxAliasesValidationRule(this.options.maxAliases),
        ];
        
        // Add introspection rule if needed
        if (this.options.disableIntrospection) {
          customRules.push(this.createDisableIntrospectionRule(true));
        }
        
        // Add custom rules to validation
        options.validationRules = [
          ...(options.validationRules || []),
          ...customRules
        ];
        
        // Proceed with execution
        return execute(options);
      } catch (error) {
        // Format the error
        const formattedError = this.formatError(error);
        
        // Log error
        this.logger.error(`Validation error: ${formattedError.message}`);
        
        // Add to error counts
        const errorCode = this.getErrorCode(error);
        this.errorCounts[errorCode] = (this.errorCounts[errorCode] || 0) + 1;
        
        throw formattedError;
      }
    };
  }

  /**
   * Create validation rule to limit query depth
   */
  createMaxDepthValidationRule(maxDepth) {
    return function maxDepthValidationRule(context) {
      return {
        Field: {
          enter: (node, key, parent, path, ancestors) => {
            const depth = this.getDepth(node, ancestors);
            if (depth > maxDepth) {
              context.reportError(
                new GraphQLError(
                  `Query exceeds maximum depth of ${maxDepth}. Current depth is ${depth}.`,
                  { nodes: [node], extensions: { code: 'MAX_DEPTH_EXCEEDED' } }
                )
              );
            }
          }
        },
        
        getDepth(node, ancestors) {
          let depth = 0;
          let currentNode = node;
          
          // Count the depth by walking up the ancestors
          for (let i = ancestors.length - 1; i >= 0; i--) {
            const ancestor = ancestors[i];
            if (ancestor.kind === Kind.FIELD) {
              depth++;
            }
          }
          
          return depth;
        }
      };
    }.bind(this);
  }

  /**
   * Create validation rule to limit field aliases
   */
  createMaxAliasesValidationRule(maxAliases) {
    return function maxAliasesValidationRule(context) {
      let aliasCount = 0;
      
      return {
        Alias(node) {
          aliasCount++;
          if (aliasCount > maxAliases) {
            context.reportError(
              new GraphQLError(
                `Query contains too many aliases (${aliasCount}). Maximum allowed is ${maxAliases}.`,
                { nodes: [node], extensions: { code: 'MAX_ALIASES_EXCEEDED' } }
              )
            );
          }
        }
      };
    };
  }

  /**
   * Create validation rule to disable introspection
   */
  createDisableIntrospectionRule(disableIntrospection) {
    return function disableIntrospectionRule(context) {
      return {
        Field(node) {
          const fieldName = node.name.value;
          
          // Check for introspection queries (starting with __ or exactly 'schema')
          if (disableIntrospection && 
              (fieldName.startsWith('__') || fieldName === 'schema')) {
            context.reportError(
              new GraphQLError(
                'GraphQL introspection is not allowed in production, but the query contained a field that is part of the introspection system.',
                { nodes: [node], extensions: { code: 'INTROSPECTION_DISABLED' } }
              )
            );
          }
        }
      };
    };
  }

  /**
   * Format an error with enhanced details
   */
  formatError(error) {
    const code = this.getErrorCode(error);
    const userMessage = this.getUserFriendlyMessage(error, code);
    
    if (error instanceof GraphQLError) {
      return new GraphQLError(
        userMessage,
        {
          nodes: error.nodes,
          source: error.source,
          positions: error.positions,
          path: error.path,
          extensions: {
            ...error.extensions,
            code: code,
            internalMessage: error.message
          }
        }
      );
    }
    
    return new GraphQLError(userMessage, {
      extensions: {
        code: code,
        internalMessage: error.message
      }
    });
  }

  /**
   * Get standardized error code
   */
  getErrorCode(error) {
    if (error.extensions && error.extensions.code) {
      return error.extensions.code;
    }
    
    // Try to extract code from error message
    if (error.message.includes('Syntax Error')) {
      return 'GRAPHQL_SYNTAX_ERROR';
    }
    
    if (error.message.includes('validation error')) {
      return 'GRAPHQL_VALIDATION_ERROR';
    }
    
    if (error.message.includes('introspection')) {
      return 'INTROSPECTION_DISABLED';
    }
    
    if (error.message.includes('depth')) {
      return 'MAX_DEPTH_EXCEEDED';
    }
    
    if (error.message.includes('aliases')) {
      return 'MAX_ALIASES_EXCEEDED';
    }
    
    return 'INTERNAL_SERVER_ERROR';
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error, code) {
    const messages = {
      'GRAPHQL_SYNTAX_ERROR': 'There is a syntax error in your GraphQL query. Please check the query and try again.',
      'GRAPHQL_VALIDATION_ERROR': 'The GraphQL query failed validation. Please check the format and try again.',
      'INTROSPECTION_DISABLED': 'GraphQL introspection is disabled in production.',
      'MAX_DEPTH_EXCEEDED': 'Your query is too nested. Please simplify it and try again.',
      'MAX_ALIASES_EXCEEDED': 'Your query has too many aliases. Please reduce the number of aliases and try again.',
      'INTERNAL_SERVER_ERROR': 'An internal server error occurred. The team has been notified.'
    };
    
    return messages[code] || error.message;
  }

  /**
   * Get validation statistics
   */
  getValidationStats() {
    return {
      errorCounts: this.errorCounts,
      topErrors: Object.entries(this.errorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([code, count]) => ({ code, count }))
    };
  }
}

module.exports = ValidationPlugin;