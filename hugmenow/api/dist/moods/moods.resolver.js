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
exports.MoodsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const moods_service_1 = require("./moods.service");
const mood_entity_1 = require("./entities/mood.entity");
const create_mood_input_1 = require("./dto/create-mood.input");
const update_mood_input_1 = require("./dto/update-mood.input");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let MoodsResolver = class MoodsResolver {
    moodsService;
    constructor(moodsService) {
        this.moodsService = moodsService;
    }
    async createMood(createMoodInput, user) {
        return this.moodsService.create(createMoodInput, user.id);
    }
    async publicMoods() {
        return this.moodsService.findPublic();
    }
    async userMoods(user) {
        return this.moodsService.findByUser(user.id);
    }
    async mood(id) {
        return this.moodsService.findOne(id);
    }
    async moodStreak(user) {
        return this.moodsService.getUserMoodStreak(user.id);
    }
    async friendsMoods(user, limit) {
        return this.moodsService.findFriendsMoods(user.id, limit);
    }
    async updateMood(updateMoodInput, user) {
        return this.moodsService.update(updateMoodInput.id, updateMoodInput, user.id);
    }
    async removeMood(id, user) {
        return this.moodsService.remove(id, user.id);
    }
};
exports.MoodsResolver = MoodsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => mood_entity_1.Mood),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('createMoodInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mood_input_1.CreateMoodInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MoodsResolver.prototype, "createMood", null);
__decorate([
    (0, graphql_1.Query)(() => [mood_entity_1.Mood]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoodsResolver.prototype, "publicMoods", null);
__decorate([
    (0, graphql_1.Query)(() => [mood_entity_1.Mood]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MoodsResolver.prototype, "userMoods", null);
__decorate([
    (0, graphql_1.Query)(() => mood_entity_1.Mood),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoodsResolver.prototype, "mood", null);
__decorate([
    (0, graphql_1.Query)(() => Number),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MoodsResolver.prototype, "moodStreak", null);
__decorate([
    (0, graphql_1.Query)(() => [mood_entity_1.Mood]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('limit', { type: () => Number, nullable: true, defaultValue: 20 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], MoodsResolver.prototype, "friendsMoods", null);
__decorate([
    (0, graphql_1.Mutation)(() => mood_entity_1.Mood),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('updateMoodInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_mood_input_1.UpdateMoodInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MoodsResolver.prototype, "updateMood", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MoodsResolver.prototype, "removeMood", null);
exports.MoodsResolver = MoodsResolver = __decorate([
    (0, graphql_1.Resolver)(() => mood_entity_1.Mood),
    __metadata("design:paramtypes", [moods_service_1.MoodsService])
], MoodsResolver);
//# sourceMappingURL=moods.resolver.js.map