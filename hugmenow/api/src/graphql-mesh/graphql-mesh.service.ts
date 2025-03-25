import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getMesh } from '@graphql-mesh/runtime';
import { GraphQLSchema } from 'graphql';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GraphQLMeshService implements OnModuleInit {
  private readonly logger = new Logger(GraphQLMeshService.name);
  private mesh: any;
  private sdl: string;
  private schema: GraphQLSchema;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.logger.log('Initializing GraphQL Mesh...');
      const meshConfig = {
        // Required merger configuration
        merger: {
          // Use Federation (default) merger
          federation: {
            enabled: true,
          }
        },
        sources: [
          {
            name: 'PostgreSQL',
            handler: {
              postgraphile: {
                connectionString: this.configService.get<string>('DATABASE_URL'),
                schemaName: 'public',
                pgSettings: {
                  role: 'postgres',
                },
                enableCors: true,
                dynamicJson: true,
                setofFunctionsContainNulls: false,
                ignoreRBAC: false,
                ignoreIndexes: true,
                includeExtensionResources: false,
                watch: false,
              }
            }
          }
        ],
        transforms: [
          {
            namingConvention: {
              typeNames: 'pascalCase',
              enumValues: 'upperCase',
              fieldNames: 'camelCase',
            }
          }
        ],
        plugins: [
          {
            // Add authentication plugin
            authPlugin: {
              authenticate: async (context) => {
                // Implement your authentication logic here
                return context;
              }
            }
          },
          {
            // Add logging plugin
            loggingPlugin: {
              logger: (message) => {
                this.logger.debug(`[GraphQL Mesh]: ${message}`);
              }
            }
          }
        ],
        cache: {
          // Add caching configuration
          enabled: true,
          ttl: 60 * 1000 // 1 minute
        },
        // Add additional beneficial features
        serve: {
          playground: true, // Enable GraphQL Playground
          cors: true,
          port: 3000
        },
        documents: [], // Add your GraphQL query documents here if needed
      };

      // Initialize Mesh with our configuration
      this.mesh = await getMesh(meshConfig);
      this.schema = this.mesh.schema;
      
      // Generate SDL
      this.sdl = this.mesh.getSdl();
      
      // Optionally save SDL to file for inspection
      const sdlPath = path.join(process.cwd(), 'generated-schema.graphql');
      fs.writeFileSync(sdlPath, this.sdl);
      
      this.logger.log('GraphQL Mesh successfully initialized');
    } catch (error) {
      this.logger.error('Failed to initialize GraphQL Mesh', error.stack);
      throw error;
    }
  }

  getSchema(): GraphQLSchema {
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
      return await this.mesh.execute(query, variables, context);
    } catch (error) {
      this.logger.error(`Error executing GraphQL query: ${error.message}`, error.stack);
      throw error;
    }
  }
}