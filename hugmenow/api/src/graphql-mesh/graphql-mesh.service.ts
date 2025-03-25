import { Injectable, Logger, OnModuleInit, Inject, forwardRef, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchSchemas } from '@graphql-tools/stitch';
import { createPostGraphileSchema } from 'postgraphile';
import { Pool } from 'pg';
import { 
  GraphQLSchema, 
  printSchema, 
  GraphQLScalarType,
  Kind,
  parse,
  validate,
  execute as graphqlExecute,
  GraphQLError
} from 'graphql';
import { createYoga } from 'graphql-yoga';
import { envelop, useEngine, useSchema } from '@envelop/core';
import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { useDepthLimit } from '@envelop/depth-limit';
import { useResponseCache } from '@envelop/response-cache';
import { wrapSchema } from '@graphql-tools/wrap';
import * as path from 'path';
import * as fs from 'fs';
import { ShieldMiddleware } from '../permissions/shield.middleware';
import { PermissionsService } from '../permissions/permissions.service';
import { MoodsService } from '../moods/moods.service';
import { HugsService } from '../hugs/hugs.service';

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

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => ShieldMiddleware))
    private shieldMiddleware: ShieldMiddleware,
    @Inject(forwardRef(() => PermissionsService))
    private permissionsService: PermissionsService
  ) {}

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
        directive @authenticated on FIELD_DEFINITION | OBJECT
        directive @cacheControl(maxAge: Int, scope: String) on FIELD_DEFINITION | OBJECT
        directive @deprecated(reason: String) on FIELD_DEFINITION
        directive @requireAuth on FIELD_DEFINITION
        directive @requireScope(scope: String!) on FIELD_DEFINITION
        directive @trimString on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION
        directive @rateLimit(
          max: Int!
          window: String!
          message: String
        ) on FIELD_DEFINITION
        directive @noIntrospection on FIELD_DEFINITION
        
        # Standard scalars
        scalar DateTime
        scalar JSON
        scalar JSONObject
        
        # Custom validation scalars
        ${this.permissionsService.getCustomScalarTypeDefs()}
        
        # Additional types
        type MeshInfo {
          version: String!
          sources: [String!]!
          transforms: [String!]!
          plugins: [String!]!
          usesShield: Boolean!
          cacheEnabled: Boolean!
          performanceMetrics: PerformanceMetrics!
        }
        
        type PerformanceMetrics {
          avgResponseTime: Float!
          cacheHitRate: Float!
          requestsPerMinute: Int!
          errorRate: Float!
        }
        
        type ValidationStats {
          validQueries: Int!
          invalidQueries: Int!
          mostCommonErrors: [String!]!
        }
        
        # Query extension
        extend type Query {
          _meshInfo: MeshInfo!
          _sdl: String!
          _health: Boolean!
          _validationStats: ValidationStats!
          _schemaStats: JSONObject!
          _apiVersion: String!
        }
      `,
      resolvers: {
        Query: {
          _meshInfo: () => ({
            version: '1.0.0',
            sources: ['PostgreSQL', 'Custom Resolvers'],
            transforms: ['NamingConvention', 'SchemaStitching', 'AuthorizationWrappers'],
            plugins: ['Auth', 'Cache', 'Logger', 'Validation', 'Directives', 'Shield'],
            usesShield: true,
            cacheEnabled: true,
            performanceMetrics: {
              avgResponseTime: 42.5, // Sample metrics for now
              cacheHitRate: 0.78,
              requestsPerMinute: 120,
              errorRate: 0.03
            }
          }),
          _sdl: () => this.sdl,
          _health: () => true,
          _validationStats: () => ({
            validQueries: 1850, // Sample metrics for now
            invalidQueries: 23,
            mostCommonErrors: [
              'Field does not exist on type',
              'Fragment is never used',
              'Variable is not used'
            ]
          }),
          _schemaStats: () => ({
            typeCount: Object.keys(baseSchema.getTypeMap()).length,
            queryFieldCount: Object.keys(baseSchema.getQueryType()?.getFields() || {}).length,
            mutationFieldCount: Object.keys(baseSchema.getMutationType()?.getFields() || {}).length,
            directiveCount: baseSchema.getDirectives().length,
          }),
          _apiVersion: () => '1.0.0'
        },
        // Custom scalar resolvers
        DateTime: new GraphQLScalarType({
          name: 'DateTime',
          description: 'DateTime custom scalar type',
          serialize(value) {
            return value instanceof Date ? value.toISOString() : value;
          },
          parseValue(value) {
            return typeof value === 'string' || typeof value === 'number' 
              ? new Date(value) 
              : null;
          },
          parseLiteral: (ast) => {
            if (ast.kind === Kind.STRING) {
              return new Date(ast.value);
            }
            return null;
          },
        }),
        JSON: new GraphQLScalarType({
          name: 'JSON',
          description: 'JSON custom scalar type',
          serialize(value) {
            return value;
          },
          parseValue(value) {
            return value;
          },
          parseLiteral: (ast) => {
            switch (ast.kind) {
              case Kind.STRING:
              case Kind.BOOLEAN:
                return ast.value;
              case Kind.INT:
              case Kind.FLOAT:
                return Number(ast.value);
              case Kind.OBJECT:
                return this.parseObject(ast);
              case Kind.LIST:
                return ast.values.map(value => this.parseAst(value));
              default:
                return null;
            }
          },
        }),
        JSONObject: new GraphQLScalarType({
          name: 'JSONObject',
          description: 'JSON object custom scalar type',
          serialize(value) {
            return value;
          },
          parseValue(value) {
            if (typeof value !== 'object' || value === null || Array.isArray(value)) {
              throw new Error('JSONObject must be an object');
            }
            return value;
          },
          parseLiteral: (ast) => {
            if (ast.kind !== Kind.OBJECT) {
              throw new Error('JSONObject must be an object');
            }
            return this.parseObject(ast);
          },
        }),
        
        // Add custom validation scalars
        Email: this.permissionsService.CustomScalars.Email,
        URL: this.permissionsService.CustomScalars.URL,
        Password: this.permissionsService.CustomScalars.Password,
        UUID: this.permissionsService.CustomScalars.UUID
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
    
    // Apply GraphQL Shield permissions - this wraps the schema with permission rules
    const schemaWithPermissions = this.shieldMiddleware.applyShield(stitchedSchema);
    
    // Return the fully enhanced schema
    return schemaWithPermissions;
  }
  
  // Helper function for JSON scalar parsing
  private parseObject(ast) {
    const value = Object.create(null);
    ast.fields.forEach(field => {
      value[field.name.value] = this.parseAst(field.value);
    });
    return value;
  }
  
  private parseAst(ast) {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return Number(ast.value);
      case Kind.OBJECT:
        return this.parseObject(ast);
      case Kind.LIST:
        return ast.values.map(value => this.parseAst(value));
      case Kind.NULL:
        return null;
      default:
        return null;
    }
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
      // Parse the document
      const document = parse(query);
      
      // Validate the document 
      const validationErrors = validate(this.enhancedSchema, document);
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
      
      // Execute the document using graphqlExecute
      return await graphqlExecute({
        schema: this.enhancedSchema,
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