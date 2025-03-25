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
var ContextBuilder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBuilder = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const moods_service_1 = require("../moods/moods.service");
const hugs_service_1 = require("../hugs/hugs.service");
let ContextBuilder = ContextBuilder_1 = class ContextBuilder {
    jwtService;
    usersService;
    moodsService;
    hugsService;
    logger = new common_1.Logger(ContextBuilder_1.name);
    constructor(jwtService, usersService, moodsService, hugsService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.moodsService = moodsService;
        this.hugsService = hugsService;
    }
    async build({ req, connection }) {
        if (connection) {
            return {
                ...connection.context,
                dataSources: {
                    usersService: this.usersService,
                    moodsService: this.moodsService,
                    hugsService: this.hugsService
                }
            };
        }
        const request = req;
        const context = {
            req,
            dataSources: {
                usersService: this.usersService,
                moodsService: this.moodsService,
                hugsService: this.hugsService
            }
        };
        try {
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                const decodedToken = this.jwtService.verify(token);
                if (decodedToken && decodedToken.sub) {
                    const user = await this.usersService.findOne(decodedToken.sub);
                    if (user) {
                        context.user = user;
                        this.logger.debug(`User ${user.id} authenticated`);
                    }
                }
            }
        }
        catch (error) {
            this.logger.error(`Error building context: ${error.message}`);
        }
        return context;
    }
};
exports.ContextBuilder = ContextBuilder;
exports.ContextBuilder = ContextBuilder = ContextBuilder_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        moods_service_1.MoodsService,
        hugs_service_1.HugsService])
], ContextBuilder);
//# sourceMappingURL=context.builder.js.map