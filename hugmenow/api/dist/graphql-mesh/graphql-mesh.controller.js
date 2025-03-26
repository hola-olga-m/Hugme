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
var GraphQLMeshController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLMeshController = void 0;
const common_1 = require("@nestjs/common");
const graphql_mesh_service_1 = require("./graphql-mesh.service");
const shield_middleware_1 = require("../permissions/shield.middleware");
const sdk_service_1 = require("./sdk.service");
let GraphQLMeshController = GraphQLMeshController_1 = class GraphQLMeshController {
    graphqlMeshService;
    shieldMiddleware;
    graphqlSdkService;
    logger = new common_1.Logger(GraphQLMeshController_1.name);
    constructor(graphqlMeshService, shieldMiddleware, graphqlSdkService) {
        this.graphqlMeshService = graphqlMeshService;
        this.shieldMiddleware = shieldMiddleware;
        this.graphqlSdkService = graphqlSdkService;
    }
    async processGraphQLRequest(body, headers, req, res) {
        const { query, variables, operationName } = body;
        try {
            const token = headers.authorization?.replace('Bearer ', '');
            const context = {
                req,
                headers,
                token,
                isAuthenticated: !!token,
                dataSources: {
                    usersService: req.app.get('usersService'),
                    moodsService: req.app.get('moodsService'),
                    hugsService: req.app.get('hugsService'),
                }
            };
            const result = await this.graphqlMeshService.execute({
                query,
                variables,
                context,
            });
            return res.json(result);
        }
        catch (error) {
            this.logger.error(`GraphQL Mesh execution error: ${error.message}`, error.stack);
            return res.status(500).json({
                errors: [{
                        message: process.env.NODE_ENV === 'production'
                            ? 'An unexpected error occurred'
                            : error.message,
                        locations: error.locations,
                        path: error.path,
                        extensions: {
                            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                        }
                    }],
            });
        }
    }
    getSchema() {
        return this.graphqlMeshService.getSDL();
    }
    getMeshInfo() {
        return {
            version: '1.0.0',
            features: [
                'Schema stitching',
                'GraphQL Shield permissions',
                'Envelop plugins',
                'Field-level security',
                'Integrated SDK'
            ],
            endpoints: {
                graphql: '/graphql-mesh',
                schema: '/graphql-mesh/schema',
                info: '/graphql-mesh/info'
            }
        };
    }
    async sdkExample(res) {
        try {
            const sdk = this.graphqlSdkService.getSdk();
            const healthResult = await sdk.HealthCheck();
            return res.json({
                sdkWorking: true,
                healthCheck: healthResult?._health || false,
                message: 'SDK successfully executed a health check query'
            });
        }
        catch (error) {
            this.logger.error(`SDK example error: ${error.message}`, error.stack);
            return res.status(500).json({
                sdkWorking: false,
                error: error.message
            });
        }
    }
};
exports.GraphQLMeshController = GraphQLMeshController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GraphQLMeshController.prototype, "processGraphQLRequest", null);
__decorate([
    (0, common_1.Get)('schema'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GraphQLMeshController.prototype, "getSchema", null);
__decorate([
    (0, common_1.Get)('info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GraphQLMeshController.prototype, "getMeshInfo", null);
__decorate([
    (0, common_1.Get)('sdk-example'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GraphQLMeshController.prototype, "sdkExample", null);
exports.GraphQLMeshController = GraphQLMeshController = GraphQLMeshController_1 = __decorate([
    (0, common_1.Controller)('graphql-mesh'),
    __metadata("design:paramtypes", [graphql_mesh_service_1.GraphQLMeshService,
        shield_middleware_1.ShieldMiddleware,
        sdk_service_1.GraphQLSdkService])
], GraphQLMeshController);
//# sourceMappingURL=graphql-mesh.controller.js.map