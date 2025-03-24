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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
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
        const existingUser = await this.usersRepository.findOne({
            where: [
                { username: registerInput.username },
                { email: registerInput.email },
            ],
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(registerInput.password, 10);
        const newUser = this.usersRepository.create({
            ...registerInput,
            password: hashedPassword,
        });
        const savedUser = await this.usersRepository.save(newUser);
        const { password, ...result } = savedUser;
        return {
            accessToken: this.generateToken(result),
            user: result,
        };
    }
    async anonymousLogin(anonymousLoginInput) {
        const randomEmail = `anonymous_${(0, uuid_1.v4)()}@hug-me-now.temp`;
        const randomUsername = `guest_${(0, uuid_1.v4)().substring(0, 8)}`;
        const randomPassword = (0, uuid_1.v4)();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        const newUser = this.usersRepository.create({
            username: randomUsername,
            email: randomEmail,
            name: anonymousLoginInput.nickname,
            password: hashedPassword,
            avatarUrl: anonymousLoginInput.avatarUrl,
            isAnonymous: true,
        });
        const savedUser = await this.usersRepository.save(newUser);
        const { password, ...result } = savedUser;
        return {
            accessToken: this.generateToken(result),
            user: result,
        };
    }
    generateToken(user) {
        const payload = { sub: user.id, username: user.username };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map