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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLMeshController = void 0;
const common_1 = require("@nestjs/common");
const graphql_mesh_service_1 = require("./graphql-mesh.service");
let GraphQLMeshController = class GraphQLMeshController {
    graphqlMeshService;
    constructor(graphqlMeshService) {
        this.graphqlMeshService = graphqlMeshService;
    }
    async processGraphQLRequest(body, headers, req, res) {
        const { query, variables, operationName } = body;
        try {
            const token = headers.authorization?.replace('Bearer ', '');
            const context = {
                req,
                headers,
                token,
            };
            const result = await this.graphqlMeshService.execute({
                query,
                variables,
                context,
            });
            return res.json(result);
        }
        catch (error) {
            console.error('GraphQL Mesh execution error', error);
            return res.status(500).json({
                errors: [{
                        message: error.message,
                        locations: error.locations,
                        path: error.path,
                    }],
            });
        }
    }
    getSchema() {
        return this.graphqlMeshService.getSDL();
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
exports.GraphQLMeshController = GraphQLMeshController = __decorate([
    (0, common_1.Controller)('graphql-mesh'),
    __metadata("design:paramtypes", [graphql_mesh_service_1.GraphQLMeshService])
], GraphQLMeshController);
//# sourceMappingURL=graphql-mesh.controller.js.map