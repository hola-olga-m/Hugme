const { 
  mapSchema, 
  getDirective, 
  MapperKind 
} = require('@graphql-tools/utils');
const { 
  defaultFieldResolver, 
  GraphQLSchema,
  GraphQLString,
  GraphQLScalarType,
  GraphQLNonNull,
  GraphQLError
} = require('graphql');

/**
 * GraphQL Mesh plugin for handling custom directives
 */
class DirectivesPlugin {
  onInit() {
    return [{
      name: 'GraphQLDirectivesPlugin',
      onSchemaChange: ({ schema }) => {
        return this.transformSchema(schema);
      }
    }];
  }

  /**
   * Apply schema transformations based on custom directives
   */
  transformSchema(schema) {
    if (!(schema instanceof GraphQLSchema)) {
      return schema;
    }

    return mapSchema(schema, {
      // Map over all types and fields to handle directives
      [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
        // Handle @authenticated directive
        const authenticatedDirective = this.getDirective(schema, fieldConfig, 'authenticated');
        if (authenticatedDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = async (source, args, context, info) => {
            if (!context.user) {
              throw new GraphQLError('Authentication required', {
                extensions: { code: 'UNAUTHENTICATED' }
              });
            }
            return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
        
        // Handle @requireScope directive
        const requireScopeDirective = this.getDirective(schema, fieldConfig, 'requireScope');
        if (requireScopeDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          const requiredScope = requireScopeDirective.scope;
          
          fieldConfig.resolve = async (source, args, context, info) => {
            if (!context.user) {
              throw new GraphQLError('Authentication required', {
                extensions: { code: 'UNAUTHENTICATED' }
              });
            }
            
            const userScopes = context.user.scopes || [];
            if (!userScopes.includes(requiredScope)) {
              throw new GraphQLError(`Required scope '${requiredScope}' not found`, {
                extensions: { code: 'FORBIDDEN' }
              });
            }
            
            return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
        
        // Handle @trimString directive
        const trimDirective = this.getDirective(schema, fieldConfig, 'trimString');
        if (trimDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          
          fieldConfig.resolve = async (source, args, context, info) => {
            const result = await resolve(source, args, context, info);
            if (typeof result === 'string') {
              return result.trim();
            }
            return result;
          };
          return fieldConfig;
        }
        
        // Handle @deprecated directive - already built into GraphQL
        
        // Handle @cacheControl directive
        const cacheControlDirective = this.getDirective(schema, fieldConfig, 'cacheControl');
        if (cacheControlDirective) {
          const { maxAge = 60, scope = 'PUBLIC' } = cacheControlDirective;
          
          // Store cache hints for the Apollo Cache Control extension to use
          fieldConfig.extensions = {
            ...fieldConfig.extensions,
            cacheControl: {
              maxAge,
              scope
            }
          };
          
          return fieldConfig;
        }
        
        // Handle @rateLimit directive
        const rateLimitDirective = this.getDirective(schema, fieldConfig, 'rateLimit');
        if (rateLimitDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          const { max, window, message = 'Rate limit exceeded' } = rateLimitDirective;
          
          // Create rate limiting state (simple in-memory version)
          const limits = new Map();
          
          fieldConfig.resolve = async (source, args, context, info) => {
            const user = context.user?.id || context.req?.ip || 'anonymous';
            const key = `${typeName}:${fieldName}:${user}`;
            
            const now = Date.now();
            const userLimits = limits.get(key) || { count: 0, resetAt: now + this.parseTimeWindow(window) };
            
            // Reset if window has passed
            if (now > userLimits.resetAt) {
              userLimits.count = 0;
              userLimits.resetAt = now + this.parseTimeWindow(window);
            }
            
            // Increment count and check against max
            userLimits.count++;
            limits.set(key, userLimits);
            
            if (userLimits.count > max) {
              throw new GraphQLError(message, {
                extensions: {
                  code: 'RATE_LIMITED',
                  retryAfter: Math.ceil((userLimits.resetAt - now) / 1000)
                }
              });
            }
            
            return resolve(source, args, context, info);
          };
          
          return fieldConfig;
        }
        
        return fieldConfig;
      },
      
      // Apply directives to input fields
      [MapperKind.INPUT_OBJECT_FIELD]: (inputFieldConfig, fieldName, typeName) => {
        // Handle @trimString directive on input fields
        const trimDirective = this.getDirective(schema, inputFieldConfig, 'trimString');
        if (trimDirective && inputFieldConfig.type instanceof GraphQLScalarType) {
          // Create a modified scalar that trims string inputs
          const originalType = inputFieldConfig.type;
          const trimmedType = new GraphQLScalarType({
            name: `Trimmed${originalType.name}`,
            description: `${originalType.description} (auto-trimmed)`,
            serialize: originalType.serialize,
            parseValue: (value) => {
              if (typeof value === 'string') {
                return originalType.parseValue(value.trim());
              }
              return originalType.parseValue(value);
            },
            parseLiteral: (ast) => {
              const parsed = originalType.parseLiteral(ast);
              if (typeof parsed === 'string') {
                return parsed.trim();
              }
              return parsed;
            }
          });
          
          // If it was non-null, preserve that
          if (inputFieldConfig.type instanceof GraphQLNonNull) {
            inputFieldConfig.type = new GraphQLNonNull(trimmedType);
          } else {
            inputFieldConfig.type = trimmedType;
          }
        }
        
        return inputFieldConfig;
      }
    });
  }

  /**
   * Helper to get directive from schema object
   */
  getDirective(schema, object, directiveName) {
    const directive = getDirective(schema, object, directiveName);
    if (directive && directive.length > 0) {
      return directive[0];
    }
    return null;
  }

  /**
   * Parse time window string (e.g. "10s", "5m", "1h") to milliseconds
   */
  parseTimeWindow(window) {
    const match = window.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 60000; // Default: 1 minute
    }
    
    const [, amount, unit] = match;
    const value = parseInt(amount, 10);
    
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 60000;
    }
  }
}

module.exports = DirectivesPlugin;