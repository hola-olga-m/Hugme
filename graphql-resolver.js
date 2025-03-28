/**
 * GraphQL Version Resolver for HugMeNow
 * 
 * This file creates a unified GraphQL instance to resolve version conflicts
 * between different libraries using different GraphQL versions
 */

// Import the GraphQL library from a known central location
import * as graphql from 'graphql';

// Add missing subscribe function if needed (for compatibility with GraphQL Subscriptions)
if (!graphql.subscribe) {
  console.warn('GraphQL subscribe function not found in core graphql package. Creating a compatible implementation...');
  // Basic subscribe implementation that works with graphql-subscriptions
  graphql.subscribe = async function subscribe(args) {
    console.log('[graphql-resolver] Using custom subscribe implementation');
    // If args is an object with schema, document, etc.
    if (args && typeof args === 'object') {
      const { schema, document, rootValue, contextValue, variableValues, operationName } = args;
      // Use execute as a fallback for testing
      return graphql.execute({
        schema,
        document,
        rootValue,
        contextValue,
        variableValues,
        operationName
      });
    }
    // Legacy argument style (separate arguments)
    const [schema, document, rootValue, contextValue, variableValues, operationName] = args;
    return graphql.execute(
      schema,
      document,
      rootValue,
      contextValue,
      variableValues,
      operationName
    );
  };
}

// Export all named exports from GraphQL
export const {
  // Types
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLID,
  
  // Directives
  GraphQLDirective,
  GraphQLIncludeDirective,
  GraphQLSkipDirective,
  GraphQLDeprecatedDirective,
  
  // Execution
  execute,
  executeSync,
  defaultFieldResolver,
  subscribe,
  
  // Validation
  validate,
  ValidationContext,
  
  // Language
  parse,
  parseValue,
  parseType,
  print,
  
  // Utilities
  introspectionFromSchema,
  buildClientSchema,
  buildASTSchema,
  buildSchema,
  getOperationAST,
  
  // Type system
  isType,
  isScalarType,
  isObjectType,
  isInterfaceType,
  isUnionType,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isInputType,
  isOutputType,
  isLeafType,
  isCompositeType,
  isAbstractType,
  isWrappingType,
  isNullableType,
  isNamedType,
  
  // Type utilities
  assertType,
  assertScalarType,
  assertObjectType,
  assertInterfaceType,
  assertUnionType,
  assertEnumType,
  assertInputObjectType,
  assertListType,
  assertNonNullType,
  assertInputType,
  assertOutputType,
  assertLeafType,
  assertCompositeType,
  assertAbstractType,
  assertWrappingType,
  assertNullableType,
  assertNamedType,
  
  // GraphQL Error
  GraphQLError,
  formatError,
  printError,
  
  // Value Validation
  isValidJSValue,
  isValidLiteralValue,
  
  // Utilities
  TypeInfo,
  visitWithTypeInfo,
  Source,
  getLocation,
  visit,
  visitInParallel,
  Kind,
  TokenKind,
  DirectiveLocation,
  BREAK,
  specifiedRules,
  specifiedDirectives,
  printSchema,
  printIntrospectionSchema,
  printType
} = graphql;

// Also export default GraphQL for libraries that use default import
export default graphql;

// Export a version function to help with debugging
export function getGraphQLVersion() {
  return graphql.version || 'unknown';
}

// Function to help log version conflicts
export function logVersionConflict(source, importedVersion) {
  console.warn(`GraphQL version conflict detected in ${source}:`, {
    'Centralized GraphQL version': getGraphQLVersion(),
    'Imported version': importedVersion
  });
}