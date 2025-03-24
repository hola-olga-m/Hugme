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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
    async create(createUserData) {
        const emailExists = await this.findByEmail(createUserData.email);
        if (emailExists) {
            throw new common_1.ConflictException('Email already in use');
        }
        const usernameExists = await this.findByUsername(createUserData.username);
        if (usernameExists) {
            throw new common_1.ConflictException('Username already in use');
        }
        if (createUserData.password) {
            createUserData.password = await bcrypt.hash(createUserData.password, 10);
        }
        const user = this.usersRepository.create(createUserData);
        return this.usersRepository.save(user);
    }
    async update(id, updateUserData) {
        await this.findOne(id);
        if (updateUserData.password) {
            updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
        }
        await this.usersRepository.update(id, updateUserData);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.usersRepository.delete(id);
        return result.affected > 0;
    }
    async createAnonymousUser(nickname, avatarUrl) {
        const anonymousUser = this.usersRepository.create({
            username: `anon_${Date.now()}`,
            email: `anon_${Date.now()}@anonymous.com`,
            name: nickname,
            password: await bcrypt.hash(Math.random().toString(36), 10),
            avatarUrl,
            isAnonymous: true,
        });
        return this.usersRepository.save(anonymousUser);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map