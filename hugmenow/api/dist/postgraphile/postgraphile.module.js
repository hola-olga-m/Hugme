"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PostGraphileModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostGraphileModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const postgraphile_provider_1 = require("./postgraphile.provider");
const postgraphile_service_1 = require("./postgraphile.service");
const postgraphile_controller_1 = require("./postgraphile.controller");
const migration_runner_1 = require("./migration.runner");
let PostGraphileModule = PostGraphileModule_1 = class PostGraphileModule {
    static forRootAsync() {
        return {
            module: PostGraphileModule_1,
            imports: [config_1.ConfigModule],
            providers: [
                postgraphile_provider_1.PostGraphileProvider,
                postgraphile_service_1.PostGraphileService,
                migration_runner_1.MigrationRunner,
            ],
            controllers: [postgraphile_controller_1.PostGraphileController],
            exports: [postgraphile_service_1.PostGraphileService],
            global: true,
        };
    }
};
exports.PostGraphileModule = PostGraphileModule;
exports.PostGraphileModule = PostGraphileModule = PostGraphileModule_1 = __decorate([
    (0, common_1.Module)({})
], PostGraphileModule);
//# sourceMappingURL=postgraphile.module.js.map