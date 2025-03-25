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
var ShieldMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShieldMiddleware = void 0;
const common_1 = require("@nestjs/common");
const graphql_middleware_1 = require("graphql-middleware");
const permissions_service_1 = require("./permissions.service");
let ShieldMiddleware = ShieldMiddleware_1 = class ShieldMiddleware {
    permissionsService;
    logger = new common_1.Logger(ShieldMiddleware_1.name);
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    applyShield(schema) {
        this.logger.log('Applying Shield permissions to GraphQL schema');
        try {
            const permissions = this.permissionsService.createPermissions();
            const schemaWithPermissions = (0, graphql_middleware_1.applyMiddleware)(schema, permissions);
            this.logger.log('Shield permissions successfully applied');
            return schemaWithPermissions;
        }
        catch (error) {
            this.logger.error(`Error applying Shield permissions: ${error.message}`, error.stack);
            return schema;
        }
    }
};
exports.ShieldMiddleware = ShieldMiddleware;
exports.ShieldMiddleware = ShieldMiddleware = ShieldMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], ShieldMiddleware);
//# sourceMappingURL=shield.middleware.js.map