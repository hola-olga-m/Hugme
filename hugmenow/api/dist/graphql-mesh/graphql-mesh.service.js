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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GraphQLMeshService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLMeshService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schema_1 = require("@graphql-tools/schema");
const stitch_1 = require("@graphql-tools/stitch");
const postgraphile_1 = require("postgraphile");
const pg_1 = require("pg");
const graphql_1 = require("graphql");
const core_1 = require("@envelop/core");
const parser_cache_1 = require("@envelop/parser-cache");
const validation_cache_1 = require("@envelop/validation-cache");
const depth_limit_1 = require("@envelop/depth-limit");
const path = require("path");
const fs = require("fs");
const shield_middleware_1 = require("../permissions/shield.middleware");
const auth_plugin_1 = require("./plugins/auth.plugin");
const cache_plugin_1 = require("./plugins/cache.plugin");
const logger_plugin_1 = require("./plugins/logger.plugin");
const validation_plugin_1 = require("./plugins/validation.plugin");
const directives_plugin_1 = require("./plugins/directives.plugin");
let GraphQLMeshService = GraphQLMeshService_1 = class GraphQLMeshService {
    configService;
    shieldMiddleware;
    logger = new common_1.Logger(GraphQLMeshService_1.name);
    mesh;
    sdl;
    schema;
    enhancedSchema;
    dbPool;
    constructor(configService, shieldMiddleware) {
        this.configService = configService;
        this.shieldMiddleware = shieldMiddleware;
    }
    async onModuleInit() {
        try {
            this.logger.log('Initializing GraphQL Mesh service...');
            this.dbPool = new pg_1.Pool({
                connectionString: this.configService.get('DATABASE_URL'),
            });
            const pgSchema = await this.createBaseSchema();
            this.enhancedSchema = await this.enhanceSchema(pgSchema);
            await this.setupEnvelop();
            this.generateSDL();
            this.logger.log('GraphQL Mesh service successfully initialized');
        }
        catch (error) {
            this.logger.error('Failed to initialize GraphQL Mesh service', error.stack);
            throw error;
        }
    }
    async createBaseSchema() {
        this.logger.log('Creating base PostGraphile schema...');
        const pgSchema = await (0, postgraphile_1.createPostGraphileSchema)(this.dbPool, 'public', {
            subscriptions: true,
            dynamicJson: true,
            setofFunctionsContainNulls: false,
            ignoreRBAC: false,
            ignoreIndexes: true,
            includeExtensionResources: false,
            appendPlugins: [
                require('postgraphile-plugin-connection-filter')
            ]
        });
        this.schema = pgSchema;
        return pgSchema;
    }
    async enhanceSchema(baseSchema) {
        this.logger.log('Enhancing schema with additional capabilities...');
        const extensionSchema = (0, schema_1.makeExecutableSchema)({
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
                            avgResponseTime: 42.5,
                            cacheHitRate: 0.78,
                            requestsPerMinute: 120,
                            errorRate: 0.03
                        }
                    }),
                    _sdl: () => this.sdl,
                    _health: () => true,
                    _validationStats: () => ({
                        validQueries: 1850,
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
                DateTime: new graphql_1.GraphQLScalarType({
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
                        if (ast.kind === graphql_1.Kind.STRING) {
                            return new Date(ast.value);
                        }
                        return null;
                    },
                }),
                JSON: new graphql_1.GraphQLScalarType({
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
                            case graphql_1.Kind.STRING:
                            case graphql_1.Kind.BOOLEAN:
                                return ast.value;
                            case graphql_1.Kind.INT:
                            case graphql_1.Kind.FLOAT:
                                return Number(ast.value);
                            case graphql_1.Kind.OBJECT:
                                return this.parseObject(ast);
                            case graphql_1.Kind.LIST:
                                return ast.values.map(value => this.parseAst(value));
                            default:
                                return null;
                        }
                    },
                }),
                JSONObject: new graphql_1.GraphQLScalarType({
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
                    parseLiteral(ast) {
                        if (ast.kind !== graphql_1.Kind.OBJECT) {
                            throw new Error('JSONObject must be an object');
                        }
                        return parseObject(ast);
                    },
                })
            }
        });
        const stitchedSchema = (0, stitch_1.stitchSchemas)({
            subschemas: [
                {
                    schema: baseSchema,
                    merge: true
                },
                {
                    schema: extensionSchema,
                    merge: true
                }
            ],
            mergeDirectives: true
        });
        const schemaWithPermissions = this.shieldMiddleware.applyShield(stitchedSchema);
        return schemaWithPermissions;
    }
    parseObject(ast) {
        const value = Object.create(null);
        ast.fields.forEach(field => {
            value[field.name.value] = parseAst(field.value);
        });
        return value;
    }
    parseAst(ast) {
        switch (ast.kind) {
            case graphql_1.Kind.STRING:
            case graphql_1.Kind.BOOLEAN:
                return ast.value;
            case graphql_1.Kind.INT:
            case graphql_1.Kind.FLOAT:
                return Number(ast.value);
            case graphql_1.Kind.OBJECT:
                return this.parseObject(ast);
            case graphql_1.Kind.LIST:
                return ast.values.map(value => this.parseAst(value));
            case graphql_1.Kind.NULL:
                return null;
            default:
                return null;
        }
    }
    async setupEnvelop() {
        this.logger.log('Setting up Envelop with plugins...');
        const authPlugin = new auth_plugin_1.default({
            jwtSecret: this.configService.get('JWT_SECRET')
        });
        const cachePlugin = new cache_plugin_1.default({ ttl: 60000 });
        const loggerPlugin = new logger_plugin_1.default();
        const validationPlugin = new validation_plugin_1.default();
        const directivesPlugin = new directives_plugin_1.default();
        const getEnveloped = (0, core_1.envelop)({
            plugins: [
                (0, core_1.useSchema)(this.enhancedSchema),
                (0, parser_cache_1.useParserCache)(),
                (0, validation_cache_1.useValidationCache)(),
                (0, depth_limit_1.useDepthLimit)({ maxDepth: 10 }),
                ...authPlugin.onInit({}),
                ...cachePlugin.onInit({}),
                ...loggerPlugin.onInit({}),
                ...validationPlugin.onInit({}),
                ...directivesPlugin.onInit({})
            ]
        });
        this.mesh = getEnveloped;
    }
    generateSDL() {
        this.logger.log('Generating SDL...');
        this.sdl = (0, graphql_1.printSchema)(this.enhancedSchema);
        const sdlPath = path.join(process.cwd(), 'generated-schema.graphql');
        fs.writeFileSync(sdlPath, this.sdl);
        this.logger.log(`Schema SDL saved to ${sdlPath}`);
    }
    getSchema() {
        return this.enhancedSchema;
    }
    getSDL() {
        return this.sdl;
    }
    async execute({ query, variables, context }) {
        try {
            const { parse, validate, execute, schema } = this.mesh.getParseFns();
            const document = parse(query);
            const validationErrors = validate(schema, document);
            if (validationErrors.length > 0) {
                return { errors: validationErrors };
            }
            const enrichedContext = {
                ...context,
                dataSources: {
                    postgresPool: this.dbPool,
                }
            };
            return await execute({
                schema,
                document,
                rootValue: {},
                contextValue: enrichedContext,
                variableValues: variables,
            });
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
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => shield_middleware_1.ShieldMiddleware))),
    __metadata("design:paramtypes", [config_1.ConfigService,
        shield_middleware_1.ShieldMiddleware])
], GraphQLMeshService);
//# sourceMappingURL=graphql-mesh.service.js.map