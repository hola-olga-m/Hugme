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
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async findByUsername(username) {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user) {
            throw new common_1.NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }
    async create(createUserData) {
        if (createUserData.password) {
            const salt = await bcrypt.genSalt();
            createUserData.password = await bcrypt.hash(createUserData.password, salt);
        }
        const user = this.usersRepository.create({
            ...createUserData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return this.usersRepository.save(user);
    }
    async update(id, updateUserData) {
        const user = await this.findOne(id);
        if (updateUserData.password) {
            const salt = await bcrypt.genSalt();
            updateUserData.password = await bcrypt.hash(updateUserData.password, salt);
        }
        Object.assign(user, {
            ...updateUserData,
            updatedAt: new Date(),
        });
        return this.usersRepository.save(user);
    }
    async remove(id) {
        const result = await this.usersRepository.delete(id);
        if (result.affected && result.affected > 0) {
            return true;
        }
        throw new common_1.NotFoundException(`User with ID ${id} not found`);
    }
    async createAnonymousUser(nickname, avatarUrl) {
        const randomId = (0, uuid_1.v4)().substring(0, 8);
        const username = `anon_${randomId}`;
        const email = `anon_${randomId}@anonymous.com`;
        return this.create({
            username,
            email,
            name: nickname,
            avatarUrl,
            isAnonymous: true,
            password: await bcrypt.hash((0, uuid_1.v4)(), 10),
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