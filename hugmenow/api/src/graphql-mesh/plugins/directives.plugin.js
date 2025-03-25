const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver, GraphQLSchema } = require('graphql');

class DirectivesPlugin {
  onInit() {
    return [{
      name: 'GraphQLDirectivesPlugin',
      onSchemaChange({ schema, replaceSchema }) {
        const enhancedSchema = this.transformSchema(schema);
        replaceSchema(enhancedSchema);
      }
    }];
  }
  
  // Implement custom directives by transforming the schema
  transformSchema(schema) {
    return mapSchema(schema, {
      // Apply directive transformations to fields
      [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        // @deprecated directive (built-in support, just for example)
        const deprecatedDirective = this.getDirective(schema, fieldConfig, 'deprecated');
        if (deprecatedDirective) {
          const reason = deprecatedDirective.reason || 'No longer supported';
          fieldConfig.deprecationReason = reason;
          return fieldConfig;
        }
        
        // @authenticated directive
        const authenticatedDirective = this.getDirective(schema, fieldConfig, 'authenticated');
        if (authenticatedDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = async (source, args, context, info) => {
            // Check for authenticated user in context
            if (!context.user || !context.isAuthenticated) {
              throw new Error('Access denied: You must be authenticated');
            }
            return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
        
        // @requireScope directive
        const requireScopeDirective = this.getDirective(schema, fieldConfig, 'requireScope');
        if (requireScopeDirective) {
          const requiredScope = requireScopeDirective.scope;
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = async (source, args, context, info) => {
            // Check for authentication and scope
            if (!context.user || !context.isAuthenticated) {
              throw new Error('Access denied: You must be authenticated');
            }
            
            // Check if user has the required scope
            const userScopes = context.user.scopes || [];
            if (!userScopes.includes(requiredScope)) {
              throw new Error(`Access denied: Required scope '${requiredScope}' not found`);
            }
            
            return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
        
        // @cacheControl directive
        const cacheControlDirective = this.getDirective(schema, fieldConfig, 'cacheControl');
        if (cacheControlDirective) {
          const maxAge = cacheControlDirective.maxAge || 60; // Default: 60 seconds
          const scope = cacheControlDirective.scope || 'PUBLIC';
          
          // Use extensions to store cache metadata for later use by cache plugins
          if (!fieldConfig.extensions) {
            fieldConfig.extensions = {};
          }
          
          fieldConfig.extensions.cacheControl = {
            maxAge,
            scope
          };
          
          return fieldConfig;
        }
        
        // @trimString directive
        const trimStringDirective = this.getDirective(schema, fieldConfig, 'trimString');
        if (trimStringDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = async (source, args, context, info) => {
            const result = await resolve(source, args, context, info);
            // If result is a string, trim it
            if (typeof result === 'string') {
              return result.trim();
            }
            return result;
          };
          return fieldConfig;
        }
        
        // @rateLimit directive
        const rateLimitDirective = this.getDirective(schema, fieldConfig, 'rateLimit');
        if (rateLimitDirective) {
          const max = rateLimitDirective.max || 60; // Default: 60 requests
          const window = rateLimitDirective.window || '1m'; // Default: 1 minute
          const message = rateLimitDirective.message || 'Rate limit exceeded';
          
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = async (source, args, context, info) => {
            // Simple rate limiting implementation
            // In a real app, use a proper rate limiter with Redis
            const clientId = context.user ? context.user.id : context.clientIp || 'anonymous';
            const key = `rateLimit:${typeName}:${info.fieldName}:${clientId}`;
            
            // Check if rate limited
            // This is a placeholder - actual implementation would use Redis or similar
            if (context.rateLimit && typeof context.rateLimit.check === 'function') {
              const canProceed = await context.rateLimit.check(key, max, window);
              if (!canProceed) {
                throw new Error(message);
              }
            }
            
            return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
        
        return fieldConfig;
      },
      
      // Apply directive transformations to arguments
      [MapperKind.ARGUMENT]: (argConfig) => {
        // @trimString directive for arguments
        const trimStringDirective = this.getDirective(schema, argConfig, 'trimString');
        if (trimStringDirective) {
          const originalType = argConfig.type;
          // Wrap the type with a custom parsing function
          argConfig.type = {
            ...originalType,
            parseValue: (value) => {
              if (typeof value === 'string') {
                return value.trim();
              }
              return value;
            }
          };
        }
        
        return argConfig;
      }
    });
  }
  
  // Helper function to get directive from object
  getDirective(schema, object, directiveName) {
    const directive = getDirective(schema, object, directiveName);
    if (directive && directive.length > 0) {
      return directive[0];
    }
    return null;
  }
}

module.exports = DirectivesPlugin;