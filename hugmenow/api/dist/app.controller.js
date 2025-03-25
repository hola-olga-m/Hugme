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
    frontendBaseUrl;
    constructor(appService, authService) {
        this.appService = appService;
        this.authService = authService;
        this.frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        console.log(`Frontend base URL: ${this.frontendBaseUrl}`);
    }
    getHello() {
        return this.appService.getHello();
    }
    getAppInfo() {
        return this.appService.getAppInfo();
    }
    getFrontendUrl(path, req) {
        const host = req.get('host');
        const forwardedHost = req.get('x-forwarded-host');
        const protocol = req.protocol;
        console.log(`Generating URL for path ${path}`);
        console.log(`Host: ${host}, Forwarded Host: ${forwardedHost}, Protocol: ${protocol}`);
        if (process.env.FRONTEND_URL) {
            return `${process.env.FRONTEND_URL}${path}`;
        }
        if (process.env.REPLIT_SLUG || process.env.REPL_ID || host?.includes('.replit.app')) {
            const appDomain = host || forwardedHost;
            return appDomain ? `${protocol}://${appDomain}${path}` : `${this.frontendBaseUrl}${path}`;
        }
        return `${this.frontendBaseUrl}${path}`;
    }
    handleRedirect(path, req) {
        const redirectUrl = this.getFrontendUrl(path, req);
        console.log(`Redirecting to: ${redirectUrl}`);
        return { url: redirectUrl };
    }
    getLoginPage(req) {
        return this.handleRedirect('/login', req);
    }
    getRegisterPage(req) {
        return this.handleRedirect('/register', req);
    }
    getDashboardPage(req) {
        return this.handleRedirect('/dashboard', req);
    }
    getMoodTrackerPage(req) {
        return this.handleRedirect('/mood-tracker', req);
    }
    getHugCenterPage(req) {
        return this.handleRedirect('/hug-center', req);
    }
    getProfilePage(req) {
        return this.handleRedirect('/profile', req);
    }
    async login(loginInput, res) {
        try {
            console.log('Processing login request:', loginInput.email);
            const result = await this.authService.login(loginInput);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Login error:', error.message);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async register(registerInput, res) {
        try {
            console.log('Processing registration request:', registerInput.email);
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
            console.log('Processing anonymous login request');
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
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getLoginPage", null);
__decorate([
    (0, common_1.Get)('register'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRegisterPage", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDashboardPage", null);
__decorate([
    (0, common_1.Get)('mood-tracker'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMoodTrackerPage", null);
__decorate([
    (0, common_1.Get)('hug-center'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHugCenterPage", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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