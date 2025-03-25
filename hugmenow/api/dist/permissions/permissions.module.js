"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const permissions_service_1 = require("./permissions.service");
const shield_middleware_1 = require("./shield.middleware");
const context_builder_1 = require("./context.builder");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_module_1 = require("../users/users.module");
const moods_module_1 = require("../moods/moods.module");
const hugs_module_1 = require("../hugs/hugs.module");
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'hugmenow-secret',
                    signOptions: { expiresIn: '24h' },
                }),
                inject: [config_1.ConfigService],
            }),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            (0, common_1.forwardRef)(() => moods_module_1.MoodsModule),
            (0, common_1.forwardRef)(() => hugs_module_1.HugsModule),
        ],
        providers: [permissions_service_1.PermissionsService, shield_middleware_1.ShieldMiddleware, context_builder_1.ContextBuilder],
        exports: [permissions_service_1.PermissionsService, shield_middleware_1.ShieldMiddleware, context_builder_1.ContextBuilder],
    })
], PermissionsModule);
//# sourceMappingURL=permissions.module.js.map