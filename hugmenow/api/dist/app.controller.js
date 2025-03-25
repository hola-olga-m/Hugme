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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const auth_service_1 = require("./auth/auth.service");
const login_input_1 = require("./auth/dto/login.input");
const register_input_1 = require("./auth/dto/register.input");
const anonymous_login_input_1 = require("./auth/dto/anonymous-login.input");
let AppController = class AppController {
    appService;
    authService;
    constructor(appService, authService) {
        this.appService = appService;
        this.authService = authService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getAppInfo() {
        return this.appService.getAppInfo();
    }
    getLoginPage() {
        return { url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : 'http://localhost:3001/login' };
    }
    getRegisterPage() {
        return { url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/register` : 'http://localhost:3001/register' };
    }
    getDashboardPage() {
        return { url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/dashboard` : 'http://localhost:3001/dashboard' };
    }
    getMoodTrackerPage() {
        return { url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/mood-tracker` : 'http://localhost:3001/mood-tracker' };
    }
    getHugCenterPage() {
        return { url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/hug-center` : 'http://localhost:3001/hug-center' };
    }
    getProfilePage() {
        return { url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/profile` : 'http://localhost:3001/profile' };
    }
    async login(loginInput, res) {
        try {
            const result = await this.authService.login(loginInput);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async register(registerInput, res) {
        try {
            const result = await this.authService.register(registerInput);
            return res.status(common_1.HttpStatus.CREATED).json(result);
        }
        catch (error) {
            console.error('Registration error:', error.message, error.stack);
            if (error.message.includes('already exists')) {
                throw new common_1.UnauthorizedException('Username or email already exists');
            }
            throw new common_1.UnauthorizedException(`Registration failed: ${error.message}`);
        }
    }
    async anonymousLogin(anonymousLoginInput, res) {
        try {
            const result = await this.authService.anonymousLogin(anonymousLoginInput);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Anonymous login error:', error.message, error.stack);
            throw new common_1.UnauthorizedException(`Anonymous login failed: ${error.message}`);
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getAppInfo", null);
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getLoginPage", null);
__decorate([
    (0, common_1.Get)('register'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRegisterPage", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDashboardPage", null);
__decorate([
    (0, common_1.Get)('mood-tracker'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMoodTrackerPage", null);
__decorate([
    (0, common_1.Get)('hug-center'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHugCenterPage", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProfilePage", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_input_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_input_1.RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('anonymous-login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [anonymous_login_input_1.AnonymousLoginInput, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "anonymousLogin", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        auth_service_1.AuthService])
], AppController);
//# sourceMappingURL=app.controller.js.map