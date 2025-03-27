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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLMeshResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_mesh_service_1 = require("./graphql-mesh.service");
let GraphQLMeshResolver = class GraphQLMeshResolver {
    graphqlMeshService;
    constructor(graphqlMeshService) {
        this.graphqlMeshService = graphqlMeshService;
    }
    async getMeshInfo() {
        return {
            version: '1.0.0',
            sources: ['PostgreSQL'],
            timestamp: new Date().toISOString(),
        };
    }
    async healthCheck() {
        try {
            const result = await this.graphqlMeshService.execute({
                query: '{ __schema { types { name } } }',
            });
            return { status: 'healthy', timestamp: new Date().toISOString() };
        }
        catch (error) {
            return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
        }
    }
};
exports.GraphQLMeshResolver = GraphQLMeshResolver;
__decorate([
    (0, graphql_1.Query)('_meshInfo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GraphQLMeshResolver.prototype, "getMeshInfo", null);
__decorate([
    (0, graphql_1.Query)('_meshHealthCheck'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GraphQLMeshResolver.prototype, "healthCheck", null);
exports.GraphQLMeshResolver = GraphQLMeshResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [graphql_mesh_service_1.GraphQLMeshService])
], GraphQLMeshResolver);
//# sourceMappingURL=graphql-mesh.resolver.js.map