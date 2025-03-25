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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const postgraphile_service_1 = require("../postgraphile/postgraphile.service");
let UsersService = class UsersService {
    postgraphileService;
    usersTable = 'users';
    constructor(postgraphileService) {
        this.postgraphileService = postgraphileService;
    }
    async findAll() {
        return await this.postgraphileService.findAll(this.usersTable);
    }
    async findOne(id) {
        const user = await this.postgraphileService.findById(this.usersTable, id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const users = await this.postgraphileService.findWhere(this.usersTable, { email });
        const user = users[0];
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async findByUsername(username) {
        const users = await this.postgraphileService.findWhere(this.usersTable, { username });
        const user = users[0];
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
        const userData = {
            ...createUserData,
            id: createUserData.id || (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return await this.postgraphileService.insert(this.usersTable, userData);
    }
    async update(id, updateUserData) {
        await this.findOne(id);
        if (updateUserData.password) {
            const salt = await bcrypt.genSalt();
            updateUserData.password = await bcrypt.hash(updateUserData.password, salt);
        }
        const userData = {
            ...updateUserData,
            updatedAt: new Date(),
        };
        return await this.postgraphileService.update(this.usersTable, id, userData);
    }
    async remove(id) {
        const success = await this.postgraphileService.delete(this.usersTable, id);
        if (!success) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return true;
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
    __metadata("design:paramtypes", [postgraphile_service_1.PostGraphileService])
], UsersService);
//# sourceMappingURL=users.service.js.map