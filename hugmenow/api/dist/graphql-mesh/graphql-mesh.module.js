"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLMeshModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_mesh_service_1 = require("./graphql-mesh.service");
const graphql_mesh_controller_1 = require("./graphql-mesh.controller");
const graphql_mesh_resolver_1 = require("./graphql-mesh.resolver");
let GraphQLMeshModule = class GraphQLMeshModule {
};
exports.GraphQLMeshModule = GraphQLMeshModule;
exports.GraphQLMeshModule = GraphQLMeshModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [graphql_mesh_service_1.GraphQLMeshService, graphql_mesh_resolver_1.GraphQLMeshResolver],
        controllers: [graphql_mesh_controller_1.GraphQLMeshController],
        exports: [graphql_mesh_service_1.GraphQLMeshService],
    })
], GraphQLMeshModule);
//# sourceMappingURL=graphql-mesh.module.js.map