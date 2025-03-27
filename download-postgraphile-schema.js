/**
 * Download PostGraphile Schema
 * 
 * This script downloads the PostGraphile GraphQL schema and saves it to a file
 * for use with client-side code generation tools or schema analysis.
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const POSTGRAPHILE_URL = process.env.POSTGRAPHILE_URL || 'http://localhost:5000/postgraphile/graphql';
const OUTPUT_FILE = process.env.OUTPUT_FILE || './postgraphile-schema.graphql';

/**
 * Download the GraphQL schema using introspection
 */
async function downloadSchema() {
  console.log(`Downloading schema from ${POSTGRAPHILE_URL}...`);
  
  try {
    // Introspection query to get the full schema
    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          queryType { name }
          mutationType { name }
          subscriptionType { name }
          types {
            ...FullType
          }
          directives {
            name
            description
            locations
            args {
              ...InputValue
            }
          }
        }
      }
      
      fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }
      
      fragment InputValue on __InputValue {
        name
        description
        type {
          ...TypeRef
        }
        defaultValue
      }
      
      fragment TypeRef on __Type {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    // Send the introspection query to the GraphQL server
    const response = await fetch(POSTGRAPHILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query: introspectionQuery }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('Error getting schema:', result.errors);
      throw new Error('GraphQL schema introspection failed');
    }
    
    // Convert introspection result to GraphQL SDL
    // This is a simplified approach to generate a readable GraphQL SDL
    const schema = result.data.__schema;
    
    // Generate SDL string
    let sdl = `# PostGraphile GraphQL Schema\n# Generated: ${new Date().toISOString()}\n\n`;
    
    // Add scalar types first
    schema.types
      .filter(type => type.kind === 'SCALAR' && !type.name.startsWith('__'))
      .forEach(type => {
        sdl += `scalar ${type.name}`;
        if (type.description) {
          sdl += ` # ${type.description}`;
        }
        sdl += '\n\n';
      });
    
    // Add enums
    schema.types
      .filter(type => type.kind === 'ENUM' && !type.name.startsWith('__'))
      .forEach(type => {
        if (type.description) {
          sdl += `"""${type.description}"""\n`;
        }
        sdl += `enum ${type.name} {\n`;
        type.enumValues.forEach(value => {
          if (value.description) {
            sdl += `  """${value.description}"""\n`;
          }
          sdl += `  ${value.name}\n`;
        });
        sdl += '}\n\n';
      });
    
    // Add interfaces
    schema.types
      .filter(type => type.kind === 'INTERFACE' && !type.name.startsWith('__'))
      .forEach(type => {
        if (type.description) {
          sdl += `"""${type.description}"""\n`;
        }
        sdl += `interface ${type.name} {\n`;
        type.fields.forEach(field => {
          if (field.description) {
            sdl += `  """${field.description}"""\n`;
          }
          
          // Build field type string
          let fieldType = formatFieldType(field.type);
          
          // Add arguments if any
          if (field.args && field.args.length > 0) {
            sdl += `  ${field.name}(`;
            field.args.forEach((arg, i) => {
              if (i > 0) sdl += ', ';
              let argType = formatFieldType(arg.type);
              let defaultValue = arg.defaultValue ? ` = ${arg.defaultValue}` : '';
              sdl += `${arg.name}: ${argType}${defaultValue}`;
            });
            sdl += `): ${fieldType}\n`;
          } else {
            sdl += `  ${field.name}: ${fieldType}\n`;
          }
        });
        sdl += '}\n\n';
      });
    
    // Add object types
    schema.types
      .filter(type => type.kind === 'OBJECT' && !type.name.startsWith('__'))
      .forEach(type => {
        if (type.description) {
          sdl += `"""${type.description}"""\n`;
        }
        
        sdl += `type ${type.name}`;
        
        // Add implemented interfaces
        if (type.interfaces && type.interfaces.length > 0) {
          sdl += ' implements ' + type.interfaces.map(i => i.name).join(' & ');
        }
        
        sdl += ' {\n';
        
        if (type.fields) {
          type.fields.forEach(field => {
            if (field.description) {
              sdl += `  """${field.description}"""\n`;
            }
            
            // Build field type string
            let fieldType = formatFieldType(field.type);
            
            // Add arguments if any
            if (field.args && field.args.length > 0) {
              sdl += `  ${field.name}(`;
              field.args.forEach((arg, i) => {
                if (i > 0) sdl += ', ';
                let argType = formatFieldType(arg.type);
                let defaultValue = arg.defaultValue ? ` = ${arg.defaultValue}` : '';
                sdl += `${arg.name}: ${argType}${defaultValue}`;
              });
              sdl += `): ${fieldType}\n`;
            } else {
              sdl += `  ${field.name}: ${fieldType}\n`;
            }
          });
        }
        
        sdl += '}\n\n';
      });
    
    // Add input object types
    schema.types
      .filter(type => type.kind === 'INPUT_OBJECT' && !type.name.startsWith('__'))
      .forEach(type => {
        if (type.description) {
          sdl += `"""${type.description}"""\n`;
        }
        
        sdl += `input ${type.name} {\n`;
        
        if (type.inputFields) {
          type.inputFields.forEach(field => {
            if (field.description) {
              sdl += `  """${field.description}"""\n`;
            }
            
            // Build field type string
            let fieldType = formatFieldType(field.type);
            let defaultValue = field.defaultValue ? ` = ${field.defaultValue}` : '';
            
            sdl += `  ${field.name}: ${fieldType}${defaultValue}\n`;
          });
        }
        
        sdl += '}\n\n';
      });
    
    // Write the SDL to the output file
    await fs.writeFile(OUTPUT_FILE, sdl);
    
    // Helper function to format field types
    function formatFieldType(typeRef) {
      if (!typeRef) return 'Unknown';
      
      // For named types (no nesting)
      if (typeRef.kind !== 'NON_NULL' && typeRef.kind !== 'LIST' && typeRef.name) {
        return typeRef.name;
      }
      
      // For non-null types
      if (typeRef.kind === 'NON_NULL' && typeRef.ofType) {
        return formatFieldType(typeRef.ofType) + '!';
      }
      
      // For list types
      if (typeRef.kind === 'LIST' && typeRef.ofType) {
        return '[' + formatFieldType(typeRef.ofType) + ']';
      }
      
      // For nested types
      if (typeRef.ofType) {
        return formatFieldType(typeRef.ofType);
      }
      
      return 'Unknown';
    }
    
    console.log(`✅ Schema successfully downloaded to ${OUTPUT_FILE}`);
    
    // Analyze the schema
    analyzeSchema(result.data.__schema);
    
    return result.data.__schema;
  } catch (error) {
    console.error('Error downloading schema:', error.message);
    throw error;
  }
}

/**
 * Analyze the schema to understand its structure
 */
function analyzeSchema(schema) {
  console.log('\nSchema Analysis:');
  
  // Count types by kind
  const typesByKind = schema.types.reduce((acc, type) => {
    // Skip introspection types
    if (type.name.startsWith('__')) return acc;
    
    acc[type.kind] = (acc[type.kind] || 0) + 1;
    return acc;
  }, {});
  
  console.log('Types by kind:');
  for (const [kind, count] of Object.entries(typesByKind)) {
    console.log(`  ${kind}: ${count}`);
  }
  
  // List root types
  console.log('\nRoot Types:');
  if (schema.queryType) {
    console.log(`  Query: ${schema.queryType.name}`);
  }
  if (schema.mutationType) {
    console.log(`  Mutation: ${schema.mutationType.name}`);
  }
  if (schema.subscriptionType) {
    console.log(`  Subscription: ${schema.subscriptionType.name}`);
  }
  
  // Find and print details about important business entity types
  console.log('\nBusiness Entity Types:');
  const entityTypes = ['User', 'Mood', 'Hug', 'Friendship', 'HugRequest'];
  
  for (const typeName of entityTypes) {
    const type = schema.types.find(t => t.name === typeName);
    if (type) {
      console.log(`  ${typeName}: ${type.fields?.length || 0} fields`);
      
      // List fields if type exists
      if (type.fields) {
        console.log('    Fields:');
        type.fields.forEach(field => {
          const typeName = field.type.name || 
                          (field.type.ofType && field.type.ofType.name) || 
                          'Complex Type';
          console.log(`      ${field.name}: ${typeName}`);
        });
      }
    } else {
      console.log(`  ${typeName}: Not found in schema`);
    }
  }
  
  console.log('\nSchema analysis complete.');
}

// Run the script if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  downloadSchema().catch(error => {
    console.error('Schema download failed:', error);
    process.exit(1);
  });
}

// Export functions for use in other modules
export { downloadSchema };