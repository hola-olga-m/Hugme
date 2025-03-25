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
const postgraphile_1 = require("postgraphile");
const pg_1 = require("pg");
const graphql_1 = require("graphql");
const core_1 = require("@envelop/core");
const parser_cache_1 = require("@envelop/parser-cache");
const validation_cache_1 = require("@envelop/validation-cache");
const depth_limit_1 = require("@envelop/depth-limit");
const response_cache_1 = require("@envelop/response-cache");
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
            this.logger.log('Initializing GraphQL with Envelop...');
            const pool = new pg_1.Pool({
                connectionString: this.configService.get('DATABASE_URL'),
            });
            const pgSchema = await (0, postgraphile_1.createPostGraphileSchema)(pool, 'public', {
                subscriptions: true,
                dynamicJson: true,
                setofFunctionsContainNulls: false,
                ignoreRBAC: false,
                ignoreIndexes: true,
                includeExtensionResources: false
            });
            const getEnveloped = (0, core_1.envelop)({
                plugins: [
                    (0, core_1.useSchema)(pgSchema),
                    (0, parser_cache_1.useParserCache)(),
                    (0, validation_cache_1.useValidationCache)(),
                    (0, depth_limit_1.useDepthLimit)({ maxDepth: 10 }),
                    (0, response_cache_1.useResponseCache)({
                        ttl: 60 * 1000,
                        session: () => null,
                    })
                ]
            });
            this.mesh = getEnveloped;
            this.schema = pgSchema;
            const sdlString = (0, graphql_1.printSchema)(pgSchema);
            this.sdl = sdlString;
            const sdlPath = path.join(process.cwd(), 'generated-schema.graphql');
            fs.writeFileSync(sdlPath, this.sdl);
            this.logger.log('GraphQL with Envelop successfully initialized');
        }
        catch (error) {
            this.logger.error('Failed to initialize GraphQL with Envelop', error.stack);
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
            const { parse, validate, execute, schema } = this.mesh.getParseFns();
            const document = parse(query);
            const validationErrors = validate(schema, document);
            if (validationErrors.length > 0) {
                return { errors: validationErrors };
            }
            return await execute({
                schema,
                document,
                rootValue: {},
                contextValue: context || {},
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
    __metadata("design:paramtypes", [config_1.ConfigService])
], GraphQLMeshService);
//# sourceMappingURL=graphql-mesh.service.js.map