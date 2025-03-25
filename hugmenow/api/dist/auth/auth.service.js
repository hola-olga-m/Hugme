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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const users_service_1 = require("../users/users.service");
const postgraphile_service_1 = require("../postgraphile/postgraphile.service");
let AuthService = class AuthService {
    usersService;
    postgraphileService;
    jwtService;
    usersTable = 'users';
    constructor(usersService, postgraphileService, jwtService) {
        this.usersService = usersService;
        this.postgraphileService = postgraphileService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        try {
            const users = await this.postgraphileService.findWhere(this.usersTable, { email });
            const user = users[0];
            if (user && await bcrypt.compare(password, user.password)) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async login(loginInput) {
        const user = await this.validateUser(loginInput.email, loginInput.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            accessToken: this.generateToken(user),
            user,
        };
    }
    async register(registerInput) {
        try {
            const usersByUsername = await this.postgraphileService.findWhere(this.usersTable, { username: registerInput.username });
            const usersByEmail = await this.postgraphileService.findWhere(this.usersTable, { email: registerInput.email });
            if (usersByUsername.length > 0 || usersByEmail.length > 0) {
                throw new common_1.ConflictException('Username or email already exists');
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(registerInput.password, salt);
            const userData = {
                ...registerInput,
                password: hashedPassword,
                id: (0, uuid_1.v4)(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const savedUser = await this.postgraphileService.insert(this.usersTable, userData);
            const { password, ...result } = savedUser;
            return {
                accessToken: this.generateToken(result),
                user: result,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Registration failed: ${error.message}`);
        }
    }
    async anonymousLogin(anonymousLoginInput) {
        const randomEmail = `anonymous_${(0, uuid_1.v4)()}@hug-me-now.temp`;
        const randomUsername = `guest_${(0, uuid_1.v4)().substring(0, 8)}`;
        const randomPassword = (0, uuid_1.v4)();
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        try {
            const savedUser = await this.usersService.createAnonymousUser(anonymousLoginInput.nickname, anonymousLoginInput.avatarUrl);
            const { password, ...result } = savedUser;
            return {
                accessToken: this.generateToken(result),
                user: result,
            };
        }
        catch (error) {
            throw new Error(`Anonymous login failed: ${error.message}`);
        }
    }
    generateToken(user) {
        const payload = { sub: user.id, username: user.username };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        postgraphile_service_1.PostGraphileService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map