"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GraphQLMeshService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLMeshService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const runtime_1 = require("@graphql-mesh/runtime");
const path = require("path");
const fs = require("fs");
let GraphQLMeshService = GraphQLMeshService_1 = class GraphQLMeshService {
    configService;
    logger = new common_1.Logger(GraphQLMeshService_1.name);
    mesh;
    sdl;
    schema;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            this.logger.log('Initializing GraphQL Mesh...');
            const meshConfig = {
                merger: {
                    federation: {
                        enabled: true,
                    }
                },
                sources: [
                    {
                        name: 'PostgreSQL',
                        handler: {
                            postgraphile: {
                                connectionString: this.configService.get('DATABASE_URL'),
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
                        authPlugin: {
                            authenticate: async (context) => {
                                return context;
                            }
                        }
                    },
                    {
                        loggingPlugin: {
                            logger: (message) => {
                                this.logger.debug(`[GraphQL Mesh]: ${message}`);
                            }
                        }
                    }
                ],
                cache: {
                    enabled: true,
                    ttl: 60 * 1000
                },
                serve: {
                    playground: true,
                    cors: true,
                    port: 3000
                },
                documents: [],
            };
            this.mesh = await (0, runtime_1.getMesh)(meshConfig);
            this.schema = this.mesh.schema;
            this.sdl = this.mesh.getSdl();
            const sdlPath = path.join(process.cwd(), 'generated-schema.graphql');
            fs.writeFileSync(sdlPath, this.sdl);
            this.logger.log('GraphQL Mesh successfully initialized');
        }
        catch (error) {
            this.logger.error('Failed to initialize GraphQL Mesh', error.stack);
            throw error;
        }
    }
    getSchema() {
        return this.schema;
    }
    getSDL() {
        return this.sdl;
    }
    async execute({ query, variables, context }) {
        try {
            return await this.mesh.execute(query, variables, context);
        }
        catch (error) {
            this.logger.error(`Error executing GraphQL query: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.GraphQLMeshService = GraphQLMeshService;
exports.GraphQLMeshService = GraphQLMeshService = GraphQLMeshService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GraphQLMeshService);
//# sourceMappingURL=graphql-mesh.service.js.map