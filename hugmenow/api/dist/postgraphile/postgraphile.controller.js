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
exports.PostGraphileController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const postgraphile_provider_1 = require("./postgraphile.provider");
const pg_1 = require("pg");
let PostGraphileController = class PostGraphileController {
    pool;
    configService;
    postgraphileMiddleware;
    constructor(pool, configService) {
        this.pool = pool;
        this.configService = configService;
        this.initPostgraphile();
    }
    async initPostgraphile() {
        try {
            const { postgraphile } = await Promise.resolve().then(() => require('postgraphile'));
            const schema = 'public';
            this.postgraphileMiddleware = postgraphile(this.pool, schema, {
                watchPg: process.env.NODE_ENV !== 'production',
                graphiql: process.env.NODE_ENV !== 'production',
                enhanceGraphiql: true,
                enableCors: true,
                ignoreRBAC: false,
                dynamicJson: true,
                setofFunctionsContainNulls: false,
                classicIds: true,
                extendedErrors: ['hint', 'detail', 'errcode'],
                appendPlugins: [],
                graphileBuildOptions: {},
                pgSettings: async (req) => ({
                    role: 'app_user',
                }),
            });
        }
        catch (error) {
            console.error('Failed to initialize Postgraphile:', error);
        }
    }
    async handleRequest(req, res, next) {
        if (!this.postgraphileMiddleware) {
            return res.status(500).json({ error: 'Postgraphile middleware not initialized' });
        }
        return this.postgraphileMiddleware(req, res, next);
    }
};
exports.PostGraphileController = PostGraphileController;
__decorate([
    (0, common_1.All)('*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PostGraphileController.prototype, "handleRequest", null);
exports.PostGraphileController = PostGraphileController = __decorate([
    (0, common_1.Controller)('graphql-pg'),
    __param(0, (0, common_1.Inject)(postgraphile_provider_1.POSTGRAPHILE_POOL)),
    __metadata("design:paramtypes", [pg_1.Pool,
        config_1.ConfigService])
], PostGraphileController);
//# sourceMappingURL=postgraphile.controller.js.map