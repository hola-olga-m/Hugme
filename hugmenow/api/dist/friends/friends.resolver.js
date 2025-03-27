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
exports.FriendsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const friends_service_1 = require("./friends.service");
const friendship_entity_1 = require("./entities/friendship.entity");
const create_friendship_input_1 = require("./dto/create-friendship.input");
const update_friendship_input_1 = require("./dto/update-friendship.input");
let FriendsResolver = class FriendsResolver {
    friendsService;
    constructor(friendsService) {
        this.friendsService = friendsService;
    }
    async sendFriendRequest(createFriendshipInput, context) {
        return this.friendsService.createFriendRequest(createFriendshipInput, context.req.user.userId);
    }
    async respondToFriendRequest(updateFriendshipInput, context) {
        return this.friendsService.updateFriendship(updateFriendshipInput, context.req.user.userId);
    }
    async updateMoodFollowing(updateFriendshipInput, context) {
        return this.friendsService.updateFriendship(updateFriendshipInput, context.req.user.userId);
    }
    async myFriends(context) {
        return this.friendsService.findFriends(context.req.user.userId);
    }
    async pendingFriendRequests(context) {
        return this.friendsService.findPendingFriendRequests(context.req.user.userId);
    }
    async sentFriendRequests(context) {
        return this.friendsService.findSentFriendRequests(context.req.user.userId);
    }
    async checkFriendship(userId, context) {
        return this.friendsService.areFriends(context.req.user.userId, userId);
    }
    async moodFollowing(context) {
        return this.friendsService.findMoodFollowing(context.req.user.userId);
    }
};
exports.FriendsResolver = FriendsResolver;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => friendship_entity_1.Friendship),
    __param(0, (0, graphql_1.Args)('createFriendshipInput')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_friendship_input_1.CreateFriendshipInput, Object]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => friendship_entity_1.Friendship),
    __param(0, (0, graphql_1.Args)('updateFriendshipInput')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_friendship_input_1.UpdateFriendshipInput, Object]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "respondToFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => friendship_entity_1.Friendship),
    __param(0, (0, graphql_1.Args)('updateFriendshipInput')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_friendship_input_1.UpdateFriendshipInput, Object]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "updateMoodFollowing", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => [friendship_entity_1.Friendship]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "myFriends", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => [friendship_entity_1.Friendship]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "pendingFriendRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => [friendship_entity_1.Friendship]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "sentFriendRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => Boolean),
    __param(0, (0, graphql_1.Args)('userId')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "checkFriendship", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => [friendship_entity_1.Friendship]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendsResolver.prototype, "moodFollowing", null);
exports.FriendsResolver = FriendsResolver = __decorate([
    (0, graphql_1.Resolver)(() => friendship_entity_1.Friendship),
    __metadata("design:paramtypes", [friends_service_1.FriendsService])
], FriendsResolver);
//# sourceMappingURL=friends.resolver.js.map