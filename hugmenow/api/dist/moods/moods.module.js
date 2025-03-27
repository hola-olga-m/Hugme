"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodsModule = void 0;
const common_1 = require("@nestjs/common");
const moods_service_1 = require("./moods.service");
const moods_resolver_1 = require("./moods.resolver");
const moods_controller_1 = require("./moods.controller");
const users_module_1 = require("../users/users.module");
const auth_module_1 = require("../auth/auth.module");
const friends_module_1 = require("../friends/friends.module");
let MoodsModule = class MoodsModule {
};
exports.MoodsModule = MoodsModule;
exports.MoodsModule = MoodsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            friends_module_1.FriendsModule,
        ],
        controllers: [moods_controller_1.MoodsController],
        providers: [moods_service_1.MoodsService, moods_resolver_1.MoodsResolver],
        exports: [moods_service_1.MoodsService],
    })
], MoodsModule);
//# sourceMappingURL=moods.module.js.map