const { Logger } = require('@nestjs/common');
const { GraphQLError } = require('graphql');

class ValidationPlugin {
  constructor() {
    this.logger = new Logger('GraphQLValidation');
    this.statistics = {
      validQueries: 0,
      invalidQueries: 0,
      commonErrors: {}
    };
  }

  onInit() {
    return [{
      name: 'GraphQLValidationPlugin',
      onValidate: ({ params, setValidationFn }) => {
        // Replace the default validation function with our own custom validation
        setValidationFn((schema, documentAST, rules) => {
          // Add our custom validation rules to the standard rules
          const customRules = [
            // Maximum query depth rule
            this.createMaxDepthValidationRule(10),
            
            // Maximum aliases rule
            this.createMaxAliasesValidationRule(20),
            
            // Disable introspection in production rule 
            // (only if environment is production)
            process.env.NODE_ENV === 'production' ? 
              this.createDisableIntrospectionRule(true) : null
          ].filter(Boolean);
          
          // Combine standard rules with our custom rules
          const allRules = [...rules, ...customRules];
          
          // Use the default validate function with our enhanced rules
          const errors = params.validateFn(schema, documentAST, allRules);
          
          // Record statistics
          if (errors.length === 0) {
            this.statistics.validQueries++;
          } else {
            this.statistics.invalidQueries++;
            
            // Track common error types for analytics
            errors.forEach(error => {
              const code = this.getErrorCode(error);
              this.statistics.commonErrors[code] = (this.statistics.commonErrors[code] || 0) + 1;
            });
            
            // Enhance error messages with more context
            const enhancedErrors = errors.map(error => this.formatError(error));
            
            // Log validation errors
            this.logger.warn(`Validation errors: ${enhancedErrors.map(e => e.message).join(', ')}`);
            
            return enhancedErrors;
          }
          
          return errors;
        });
      }
    }];
  }

  // Create a validation rule that limits query depth
  createMaxDepthValidationRule(maxDepth) {
    return function maxDepthValidationRule(context) {
      return {
        Field: {
          enter(node, key, parent, path, ancestors) {
            const depth = ancestors.filter(node => node.kind === 'Field').length;
            if (depth > maxDepth) {
              context.reportError(
                new GraphQLError(
                  `Query exceeds maximum depth of ${maxDepth}. Got depth of ${depth}.`,
                  { nodes: [node] }
                )
              );
            }
          }
        }
      };
    };
  }

  // Create a validation rule that limits field aliases to prevent DoS attacks
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
                { nodes: [node] }
              )
            );
          }
        }
      };
    };
  }

  // Create a validation rule that disables introspection queries
  // Important for production to prevent schema information leakage
  createDisableIntrospectionRule(disableIntrospection) {
    return function disableIntrospectionRule(context) {
      return {
        Field(node) {
          if (disableIntrospection && 
              node.name.value.startsWith('__') && 
              node.name.value !== '__typename') {
            context.reportError(
              new GraphQLError(
                'GraphQL introspection has been disabled. Contact the API team for documentation.',
                { nodes: [node] }
              )
            );
          }
        }
      };
    };
  }

  // Format error with more context and a user-friendly message
  formatError(error) {
    // Get a more specific error code
    const code = this.getErrorCode(error);
    
    // Get a user-friendly error message
    const userMessage = this.getUserFriendlyMessage(error, code);
    
    // Create a new error with enhanced information
    return new GraphQLError(
      userMessage,
      {
        nodes: error.nodes,
        source: error.source,
        positions: error.positions,
        path: error.path,
        extensions: {
          ...error.extensions,
          code,
          classification: 'ValidationError'
        }
      }
    );
  }

  // Extract a specific error code from the error
  getErrorCode(error) {
    // If the error already has a code in extensions, use it
    if (error.extensions && error.extensions.code) {
      return error.extensions.code;
    }
    
    // Otherwise, derive a code from the error message
    const message = error.message || '';
    
    if (message.includes('depth')) return 'MAX_DEPTH_EXCEEDED';
    if (message.includes('aliases')) return 'MAX_ALIASES_EXCEEDED';
    if (message.includes('introspection')) return 'INTROSPECTION_DISABLED';
    if (message.includes('not exist')) return 'FIELD_DOES_NOT_EXIST';
    if (message.includes('Fragment')) return 'INVALID_FRAGMENT';
    if (message.includes('Variable')) return 'INVALID_VARIABLE';
    
    return 'VALIDATION_ERROR';
  }

  // Get a user-friendly error message based on error code
  getUserFriendlyMessage(error, code) {
    const baseMessage = error.message;
    
    // Add specific guidance based on the error code
    switch (code) {
      case 'MAX_DEPTH_EXCEEDED':
        return `${baseMessage} Please reduce the nesting level of your query.`;
      case 'MAX_ALIASES_EXCEEDED':
        return `${baseMessage} Please reduce the number of aliases in your query.`;
      case 'INTROSPECTION_DISABLED':
        return `${baseMessage} For API documentation, please refer to our developer portal.`;
      case 'FIELD_DOES_NOT_EXIST':
        return `${baseMessage} Check the schema documentation for available fields.`;
      case 'INVALID_FRAGMENT':
        return `${baseMessage} Make sure all fragments are used and properly defined.`;
      case 'INVALID_VARIABLE':
        return `${baseMessage} Check that all variables are properly defined and used.`;
      default:
        return baseMessage;
    }
  }

  // Get validation statistics for monitoring
  getValidationStats() {
    return {
      validQueries: this.statistics.validQueries,
      invalidQueries: this.statistics.invalidQueries,
      errorRate: this.statistics.validQueries + this.statistics.invalidQueries > 0 ?
        (this.statistics.invalidQueries / (this.statistics.validQueries + this.statistics.invalidQueries)).toFixed(2) : 0,
      mostCommonErrors: Object.entries(this.statistics.commonErrors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([code, count]) => `${code} (${count})`)
    };
  }

  // Reset statistics
  resetStats() {
    this.statistics = {
      validQueries: 0,
      invalidQueries: 0,
      commonErrors: {}
    };
  }
}

module.exports = ValidationPlugin;