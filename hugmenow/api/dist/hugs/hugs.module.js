"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HugsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hug_entity_1 = require("./entities/hug.entity");
const hug_request_entity_1 = require("./entities/hug-request.entity");
const hugs_service_1 = require("./hugs.service");
const hugs_resolver_1 = require("./hugs.resolver");
const users_module_1 = require("../users/users.module");
let HugsModule = class HugsModule {
};
exports.HugsModule = HugsModule;
exports.HugsModule = HugsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([hug_entity_1.Hug, hug_request_entity_1.HugRequest]),
            users_module_1.UsersModule,
        ],
        providers: [hugs_service_1.HugsService, hugs_resolver_1.HugsResolver],
        exports: [hugs_service_1.HugsService],
    })
], HugsModule);
//# sourceMappingURL=hugs.module.js.map