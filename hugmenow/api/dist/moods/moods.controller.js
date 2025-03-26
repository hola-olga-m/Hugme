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
exports.MoodsController = void 0;
const common_1 = require("@nestjs/common");
const moods_service_1 = require("./moods.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_mood_input_1 = require("./dto/create-mood.input");
const update_mood_input_1 = require("./dto/update-mood.input");
let MoodsController = class MoodsController {
    moodsService;
    constructor(moodsService) {
        this.moodsService = moodsService;
    }
    async create(createMoodInput, req, res) {
        try {
            const userId = req.user.userId;
            const newMood = await this.moodsService.create(createMoodInput, userId);
            return res.status(common_1.HttpStatus.CREATED).json(newMood);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to create mood');
        }
    }
    async findPublic() {
        return this.moodsService.findPublic();
    }
    async getMoodStreak(req) {
        try {
            const userId = req.user.userId;
            const streak = await this.moodsService.getUserMoodStreak(userId);
            return { streak };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to get mood streak');
        }
    }
    async findUserMoods(req) {
        try {
            const userId = req.user.userId;
            return this.moodsService.findByUser(userId);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to get user moods');
        }
    }
    async findOne(id, req) {
        try {
            const userId = req.user.userId;
            const mood = await this.moodsService.findOne(id);
            if (!mood.isPublic && mood.userId !== userId) {
                throw new common_1.UnauthorizedException('You do not have permission to view this mood');
            }
            return mood;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.NotFoundException(`Mood with ID ${id} not found`);
        }
    }
    async update(id, updateMoodInput, req, res) {
        try {
            const userId = req.user.userId;
            const updatedMood = await this.moodsService.update(id, updateMoodInput, userId);
            return res.status(common_1.HttpStatus.OK).json(updatedMood);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to update mood');
        }
    }
    async remove(id, req, res) {
        try {
            const userId = req.user.userId;
            const result = await this.moodsService.remove(id, userId);
            return res.status(common_1.HttpStatus.OK).json({ success: result });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to delete mood');
        }
    }
};
exports.MoodsController = MoodsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mood_input_1.CreateMoodInput, Object, Object]),
    __metadata("design:returntype", Promise)
], MoodsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoodsController.prototype, "findPublic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('streak'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoodsController.prototype, "getMoodStreak", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoodsController.prototype, "findUserMoods", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MoodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_mood_input_1.UpdateMoodInput, Object, Object]),
    __metadata("design:returntype", Promise)
], MoodsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MoodsController.prototype, "remove", null);
exports.MoodsController = MoodsController = __decorate([
    (0, common_1.Controller)('moods'),
    __metadata("design:paramtypes", [moods_service_1.MoodsService])
], MoodsController);
//# sourceMappingURL=moods.controller.js.map