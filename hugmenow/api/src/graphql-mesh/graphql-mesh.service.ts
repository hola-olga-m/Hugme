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
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GraphQLMeshService implements OnModuleInit {
  private readonly logger = new Logger(GraphQLMeshService.name);
  private mesh: any;
  private sdl: string;
  private schema: any; // Using any type to avoid type compatibility issues

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.logger.log('Initializing GraphQL with Envelop...');
      
      // Create DB connection pool
      const pool = new Pool({
        connectionString: this.configService.get<string>('DATABASE_URL'),
      });
      
      // Create PostGraphile schema
      const pgSchema = await createPostGraphileSchema(
        pool,
        'public',
        {
          subscriptions: true,
          dynamicJson: true,
          setofFunctionsContainNulls: false,
          ignoreRBAC: false,
          ignoreIndexes: true,
          includeExtensionResources: false
        }
      );
      
      // Create envelop instance with standard plugins only for now
      // Skip custom plugins for initial implementation
      const getEnveloped = envelop({
        plugins: [
          useSchema(pgSchema),
          useParserCache(),
          useValidationCache(),
          useDepthLimit({ maxDepth: 10 }),
          useResponseCache({
            ttl: 60 * 1000, // 1 minute
            session: () => null, // No session-based caching
          })
        ]
      });
      
      // Store the Envelop instance
      this.mesh = getEnveloped;
      
      // Keep a reference to the original schema for execution
      this.schema = pgSchema;
      
      // Generate SDL from the original schema
      const sdlString = printSchema(pgSchema as any);
      
      // Store SDL
      this.sdl = sdlString;
      
      // Optionally save SDL to file for inspection
      const sdlPath = path.join(process.cwd(), 'generated-schema.graphql');
      fs.writeFileSync(sdlPath, this.sdl);
      
      this.logger.log('GraphQL with Envelop successfully initialized');
    } catch (error) {
      this.logger.error('Failed to initialize GraphQL with Envelop', error.stack);
      throw error;
    }
  }

  getSchema(): any {
    return this.schema;
  }

  getSDL(): string {
    return this.sdl;
  }

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
      
      // Execute the document
      return await execute({
        schema,
        document,
        rootValue: {},
        contextValue: context || {},
        variableValues: variables,
      });
    } catch (error) {
      this.logger.error(`Error executing GraphQL query: ${error.message}`, error.stack);
      throw error;
    }
  }
}