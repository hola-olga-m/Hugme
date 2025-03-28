/**
 * Schema Merger Utility for HugMeNow
 * 
 * This utility merges, extends, and transforms GraphQL schemas
 * to create a unified schema for the gateway.
 */

import { mergeSchemas, makeExecutableSchema } from '@graphql-tools/schema';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { UrlLoader } from '@graphql-tools/url-loader';
import { RenameTypes, RenameRootFields, wrapSchema } from '@graphql-tools/wrap';
import { gql } from 'apollo-server';
import fetch from 'cross-fetch';

/**
 * Load schema from a file path, URL, or schema string
 */
function loadSchema(source, options = {}) {
  console.log(`[Schema Merger] Loading schema from ${source}`);
  
  if (typeof source === 'string' && source.trim().startsWith('type ')) {
    // Direct schema string
    return makeExecutableSchema({
      typeDefs: source,
      ...options
    });
  } else if (source.startsWith('http')) {
    // URL schema source
    return loadSchemaSync(source, {
      loaders: [new UrlLoader()],
      ...options
    });
  } else {
    // File path
    return loadSchemaSync(source, {
      loaders: [new GraphQLFileLoader()],
      ...options
    });
  }
}

/**
 * Merge multiple schemas together
 */
function mergeMultipleSchemas(schemas, resolvers = {}) {
  console.log(`[Schema Merger] Merging ${schemas.length} schemas`);
  return mergeSchemas({
    schemas,
    resolvers
  });
}

/**
 * Add virtual fields to a schema
 */
function addVirtualFields(schema, virtualTypeDefs, virtualResolvers = {}) {
  console.log('[Schema Merger] Adding virtual fields to schema');
  
  const virtualSchema = makeExecutableSchema({
    typeDefs: virtualTypeDefs,
    resolvers: virtualResolvers
  });
  
  return mergeSchemas({
    schemas: [schema, virtualSchema],
    resolvers: virtualResolvers
  });
}

/**
 * Transform field names in a schema (e.g., camelCase to snake_case or vice versa)
 */
function transformFieldNames(schema, transformer) {
  console.log('[Schema Merger] Transforming field names');
  
  return wrapSchema({
    schema,
    transforms: [new RenameRootFields(transformer)]
  });
}

/**
 * Transform type names in a schema
 */
function transformTypeNames(schema, transformer) {
  console.log('[Schema Merger] Transforming type names');
  
  return wrapSchema({
    schema,
    transforms: [new RenameTypes(transformer)]
  });
}

/**
 * Create a executable schema from multiple sources
 */
function createMergedSchema({ 
  baseSchema, 
  additionalSchemas = [], 
  virtualTypeDefs = '',
  resolvers = {},
  transformers = [] 
}) {
  console.log('[Schema Merger] Creating merged schema');
  
  // Load the base schema
  let schema = baseSchema;
  if (typeof baseSchema === 'string') {
    schema = loadSchema(baseSchema);
  }
  
  // Load and merge additional schemas
  const schemaList = [schema];
  for (const schemaSource of additionalSchemas) {
    let additionalSchema = schemaSource;
    if (typeof schemaSource === 'string') {
      additionalSchema = loadSchema(schemaSource);
    }
    schemaList.push(additionalSchema);
  }
  
  // Merge all schemas
  let mergedSchema = mergeMultipleSchemas(schemaList, resolvers);
  
  // Add virtual fields if provided
  if (virtualTypeDefs) {
    mergedSchema = addVirtualFields(mergedSchema, virtualTypeDefs, resolvers);
  }
  
  // Apply transformers if any
  if (transformers.length > 0) {
    for (const transformer of transformers) {
      if (transformer.type === 'field') {
        mergedSchema = transformFieldNames(mergedSchema, transformer.transform);
      } else if (transformer.type === 'type') {
        mergedSchema = transformTypeNames(mergedSchema, transformer.transform);
      }
    }
  }
  
  return mergedSchema;
}

/**
 * Wrap a remote schema with local resolvers
 */
function wrapRemoteSchema(remoteSchemaUrl, transforms = []) {
  console.log(`[Schema Merger] Wrapping remote schema from ${remoteSchemaUrl}`);
  
  const executor = async ({ document, variables, context }) => {
    // Implementation to execute against the remote schema
    const query = document.loc.source.body;
    const response = await fetch(remoteSchemaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(context.authToken ? { 'Authorization': `Bearer ${context.authToken}` } : {})
      },
      body: JSON.stringify({ query, variables })
    });
    return response.json();
  };
  
  const remoteSchema = wrapSchema({
    schema: loadSchema(remoteSchemaUrl),
    executor,
    transforms
  });
  
  return remoteSchema;
}

// ES Module exports
export {
  loadSchema,
  mergeMultipleSchemas,
  addVirtualFields,
  transformFieldNames,
  transformTypeNames,
  createMergedSchema,
  wrapRemoteSchema
};