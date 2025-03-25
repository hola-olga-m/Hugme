import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { MapperKind, mapSchema } from '@graphql-tools/utils';

export default class DirectivesPlugin implements MeshPlugin {
  onInit(options: GetMeshOptions): GetMeshOptions {
    if (!options.transforms) {
      options.transforms = [];
    }

    // Add a transform that will process our custom directives
    options.transforms.push({
      transformSchema: (schema: GraphQLSchema) => {
        return mapSchema(schema, {
          // Apply directive logic to Object fields
          [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            // Process @upperCase directive
            const upperCase = this.getDirective(schema, fieldConfig, 'upperCase');
            if (upperCase) {
              const { resolve = defaultFieldResolver } = fieldConfig;
              fieldConfig.resolve = async (source, args, context, info) => {
                const result = await resolve(source, args, context, info);
                if (typeof result === 'string') {
                  return result.toUpperCase();
                }
                return result;
              };
              return fieldConfig;
            }
            
            // Process @deprecated directive (already built into GraphQL)
            // Just showing as an example of how to handle standard directives
            const deprecated = this.getDirective(schema, fieldConfig, 'deprecated');
            if (deprecated) {
              fieldConfig.deprecationReason = deprecated['reason'];
              return fieldConfig;
            }
            
            // Process @auth directive
            const auth = this.getDirective(schema, fieldConfig, 'auth');
            if (auth) {
              const { resolve = defaultFieldResolver } = fieldConfig;
              fieldConfig.resolve = async (source, args, context, info) => {
                if (!context.user) {
                  throw new Error('Authentication required');
                }
                
                // Check for specific roles if provided
                if (auth.roles && auth.roles.length > 0) {
                  const userRoles = context.user.roles || [];
                  const hasRequiredRole = auth.roles.some(role => userRoles.includes(role));
                  if (!hasRequiredRole) {
                    throw new Error(`Requires one of the following roles: ${auth.roles.join(', ')}`);
                  }
                }
                
                return resolve(source, args, context, info);
              };
              return fieldConfig;
            }
            
            // Process @formatDate directive
            const formatDate = this.getDirective(schema, fieldConfig, 'formatDate');
            if (formatDate) {
              const { resolve = defaultFieldResolver } = fieldConfig;
              fieldConfig.resolve = async (source, args, context, info) => {
                const result = await resolve(source, args, context, info);
                if (result instanceof Date || typeof result === 'string') {
                  const date = new Date(result);
                  const format = formatDate.format || 'ISO';
                  
                  switch (format) {
                    case 'ISO':
                      return date.toISOString();
                    case 'UTC':
                      return date.toUTCString();
                    case 'short':
                      return date.toLocaleDateString();
                    case 'long':
                      return date.toLocaleString();
                    default:
                      return date.toISOString();
                  }
                }
                return result;
              };
              return fieldConfig;
            }
            
            return fieldConfig;
          },
        });
      },
    });
    
    return options;
  }

  onExecute(execute: ExecuteMeshFn): ExecuteMeshFn {
    return execute;
  }
  
  private getDirective(schema: GraphQLSchema, object: any, directiveName: string) {
    const directives = object.astNode?.directives || [];
    const directive = directives.find(
      (directive: any) => directive.name.value === directiveName
    );
    
    if (!directive) {
      return null;
    }
    
    // Extract directive arguments
    const args: any = {};
    directive.arguments?.forEach((arg: any) => {
      const argName = arg.name.value;
      const value = arg.value;
      
      // Handle different types of values
      if (value.kind === 'StringValue') {
        args[argName] = value.value;
      } else if (value.kind === 'IntValue') {
        args[argName] = parseInt(value.value, 10);
      } else if (value.kind === 'BooleanValue') {
        args[argName] = value.value;
      } else if (value.kind === 'ListValue') {
        args[argName] = value.values.map((v: any) => v.value);
      }
    });
    
    return args;
  }
}