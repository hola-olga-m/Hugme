import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchSchemas } from '@graphql-tools/stitch';
import { createPostGraphileSchema } from 'postgraphile';
import { Pool } from 'pg';
import { GraphQLSchema, printSchema } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { envelop, useEngine, useSchema } from '@envelop/core';
import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { useDepthLimit } from '@envelop/depth-limit';
import { useResponseCache } from '@envelop/response-cache';
import { wrapSchema } from '@graphql-tools/wrap';
import * as path from 'path';
import * as fs from 'fs';

// Local plugin imports
import AuthPlugin from './plugins/auth.plugin';
import CachePlugin from './plugins/cache.plugin';
import LoggerPlugin from './plugins/logger.plugin';
import ValidationPlugin from './plugins/validation.plugin';
import DirectivesPlugin from './plugins/directives.plugin';

@Injectable()
export class GraphQLMeshService implements OnModuleInit {
  private readonly logger = new Logger(GraphQLMeshService.name);
  private mesh: any;
  private sdl: string;
  private schema: any;
  private enhancedSchema: any;
  private dbPool: Pool;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.logger.log('Initializing GraphQL Mesh service...');
      
      // Create DB connection pool
      this.dbPool = new Pool({
        connectionString: this.configService.get<string>('DATABASE_URL'),
      });
      
      // Create base PostGraphile schema
      const pgSchema = await this.createBaseSchema();
      
      // Create enhanced schema with additional types and resolvers
      this.enhancedSchema = await this.enhanceSchema(pgSchema);
      
      // Set up envelop with plugins
      await this.setupEnvelop();
      
      // Generate and save SDL
      this.generateSDL();
      
      this.logger.log('GraphQL Mesh service successfully initialized');
    } catch (error) {
      this.logger.error('Failed to initialize GraphQL Mesh service', error.stack);
      throw error;
    }
  }

  /**
   * Creates the base PostGraphile schema from the database
   */
  private async createBaseSchema(): Promise<any> {
    this.logger.log('Creating base PostGraphile schema...');
    
    const pgSchema = await createPostGraphileSchema(
      this.dbPool,
      'public',
      {
        subscriptions: true,
        dynamicJson: true,
        setofFunctionsContainNulls: false,
        ignoreRBAC: false,
        ignoreIndexes: true,
        includeExtensionResources: false,
        appendPlugins: [
          require('postgraphile-plugin-connection-filter')
        ]
      }
    );
    
    this.schema = pgSchema;
    return pgSchema;
  }

  /**
   * Enhances the schema with additional types, directives, and resolvers
   */
  private async enhanceSchema(baseSchema: any): Promise<any> {
    this.logger.log('Enhancing schema with additional capabilities...');
    
    // Create extension schema with custom types and resolvers
    const extensionSchema = makeExecutableSchema({
      typeDefs: `
        # Custom directives
        directive @authenticated on FIELD_DEFINITION
        directive @cacheControl(maxAge: Int, scope: String) on FIELD_DEFINITION
        directive @deprecated(reason: String) on FIELD_DEFINITION
        
        # Additional types
        type MeshInfo {
          version: String!
          sources: [String!]!
          transforms: [String!]!
          plugins: [String!]!
        }
        
        # Query extension
        extend type Query {
          _meshInfo: MeshInfo!
          _sdl: String!
          _health: Boolean!
        }
      `,
      resolvers: {
        Query: {
          _meshInfo: () => ({
            version: '1.0.0',
            sources: ['PostgreSQL'],
            transforms: ['NamingConvention'],
            plugins: ['Auth', 'Cache', 'Logger', 'Validation', 'Directives']
          }),
          _sdl: () => this.sdl,
          _health: () => true
        }
      }
    });
    
    // Use schema stitching to combine the schemas
    const stitchedSchema = stitchSchemas({
      subschemas: [
        // Wrap the PostgreSQL schema to add metadata
        {
          schema: baseSchema,
          merge: true as any
        },
        // Add our extension schema
        {
          schema: extensionSchema,
          merge: true as any
        }
      ],
      mergeDirectives: true
    });
    
    return stitchedSchema;
  }

  /**
   * Sets up Envelop with plugins
   */
  private async setupEnvelop() {
    this.logger.log('Setting up Envelop with plugins...');
    
    // Create plugin instances
    const authPlugin = new AuthPlugin({ 
      jwtSecret: this.configService.get<string>('JWT_SECRET')
    });
    const cachePlugin = new CachePlugin({ ttl: 60000 }); // 1 minute TTL
    const loggerPlugin = new LoggerPlugin();
    const validationPlugin = new ValidationPlugin();
    const directivesPlugin = new DirectivesPlugin();
    
    // Initialize envelop with plugins
    const getEnveloped = envelop({
      plugins: [
        // Schema plugin must be first
        useSchema(this.enhancedSchema),
        
        // Standard performance plugins
        useParserCache(),
        useValidationCache(),
        useDepthLimit({ maxDepth: 10 }),
        
        // Custom plugins - these will be properly initialized
        // with the onInit method later
        ...authPlugin.onInit({}),
        ...cachePlugin.onInit({}),
        ...loggerPlugin.onInit({}),
        ...validationPlugin.onInit({}),
        ...directivesPlugin.onInit({})
      ]
    });
    
    // Store the enveloped instance
    this.mesh = getEnveloped;
  }

  /**
   * Generates SDL and saves it to a file
   */
  private generateSDL() {
    this.logger.log('Generating SDL...');
    
    // Print the schema to SDL
    this.sdl = printSchema(this.enhancedSchema);
    
    // Save to file
    const sdlPath = path.join(process.cwd(), 'generated-schema.graphql');
    fs.writeFileSync(sdlPath, this.sdl);
    
    this.logger.log(`Schema SDL saved to ${sdlPath}`);
  }

  /**
   * Gets the raw GraphQL schema
   */
  getSchema(): any {
    return this.enhancedSchema;
  }

  /**
   * Gets the SDL representation of the schema
   */
  getSDL(): string {
    return this.sdl;
  }

  /**
   * Executes a GraphQL operation
   */
  async execute({ query, variables, context }: { 
    query: string; 
    variables?: Record<string, any>; 
    context?: Record<string, any> 
  }) {
    try {
      // Get runtime objects from envelop
      const { parse, validate, execute, schema } = this.mesh.getParseFns();
      
      // Parse the document
      const document = parse(query);
      
      // Validate the document 
      const validationErrors = validate(schema, document);
      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }
      
      // Prepare the context with data sources
      const enrichedContext = {
        ...context,
        dataSources: {
          // Include data sources that permissions rules might need
          postgresPool: this.dbPool,
        }
      };
      
      // Execute the document
      return await execute({
        schema,
        document,
        rootValue: {},
        contextValue: enrichedContext,
        variableValues: variables,
      });
    } catch (error) {
      this.logger.error(`Error executing GraphQL query: ${error.message}`, error.stack);
      throw error;
    }
  }
}