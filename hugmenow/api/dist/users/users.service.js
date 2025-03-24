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
const uuid_1 = require("uuid");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findOne(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async findByEmail(email) {
        if (!email)
            return null;
        return this.usersRepository.findOne({ where: { email } });
    }
    async findByUsername(username) {
        if (!username)
            return null;
        return this.usersRepository.findOne({ where: { username } });
    }
    async create(createUserData) {
        if (createUserData.email) {
            const emailExists = await this.findByEmail(createUserData.email);
            if (emailExists) {
                throw new Error('Email already exists');
            }
        }
        if (createUserData.username) {
            const usernameExists = await this.findByUsername(createUserData.username);
            if (usernameExists) {
                throw new Error('Username already exists');
            }
        }
        const user = this.usersRepository.create(createUserData);
        return this.usersRepository.save(user);
    }
    async update(id, updateUserData) {
        await this.usersRepository.update(id, updateUserData);
        const updatedUser = await this.findOne(id);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    async remove(id) {
        const result = await this.usersRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
    async createAnonymousUser(nickname, avatarUrl) {
        return this.create({
            id: (0, uuid_1.v4)(),
            username: `anon_${(0, uuid_1.v4)().slice(0, 8)}`,
            nickname,
            avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${(0, uuid_1.v4)().slice(0, 8)}`,
            isAnonymous: true,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map