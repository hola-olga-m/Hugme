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
exports.MoodsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mood_entity_1 = require("./entities/mood.entity");
const users_service_1 = require("../users/users.service");
let MoodsService = class MoodsService {
    moodsRepository;
    usersService;
    constructor(moodsRepository, usersService) {
        this.moodsRepository = moodsRepository;
        this.usersService = usersService;
    }
    async create(createMoodInput, userId) {
        const user = await this.usersService.findOne(userId);
        const mood = this.moodsRepository.create({
            ...createMoodInput,
            userId,
            user,
        });
        return this.moodsRepository.save(mood);
    }
    async findAll() {
        return this.moodsRepository.find({
            relations: ['user'],
        });
    }
    async findPublic() {
        return this.moodsRepository.find({
            where: { isPublic: true },
            relations: ['user'],
        });
    }
    async findByUser(userId) {
        return this.moodsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const mood = await this.moodsRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!mood) {
            throw new common_1.NotFoundException(`Mood with ID ${id} not found`);
        }
        return mood;
    }
    async update(id, updateMoodInput, userId) {
        const mood = await this.moodsRepository.findOne({
            where: { id },
        });
        if (!mood) {
            throw new common_1.NotFoundException(`Mood with ID ${id} not found`);
        }
        if (mood.userId !== userId) {
            throw new common_1.NotFoundException('You can only update your own moods');
        }
        const { id: moodId, ...updateData } = updateMoodInput;
        await this.moodsRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id, userId) {
        const mood = await this.moodsRepository.findOne({
            where: { id },
        });
        if (!mood) {
            throw new common_1.NotFoundException(`Mood with ID ${id} not found`);
        }
        if (mood.userId !== userId) {
            throw new common_1.NotFoundException('You can only delete your own moods');
        }
        const result = await this.moodsRepository.delete(id);
        return result.affected > 0;
    }
    async getUserMoodStreak(userId) {
        const moods = await this.moodsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        if (moods.length === 0) {
            return 0;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const latestMood = moods[0];
        const latestMoodDate = new Date(latestMood.createdAt);
        latestMoodDate.setHours(0, 0, 0, 0);
        if (latestMoodDate.getTime() !== today.getTime()) {
            return 0;
        }
        let streak = 1;
        let currentDate = today;
        for (let i = 1; i < moods.length; i++) {
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() - 1);
            const moodDate = new Date(moods[i].createdAt);
            moodDate.setHours(0, 0, 0, 0);
            if (moodDate.getTime() === currentDate.getTime()) {
                streak++;
            }
            else {
                break;
            }
        }
        return streak;
    }
};
exports.MoodsService = MoodsService;
exports.MoodsService = MoodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mood_entity_1.Mood)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], MoodsService);
//# sourceMappingURL=moods.service.js.map