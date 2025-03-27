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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const friendship_entity_1 = require("./entities/friendship.entity");
const users_service_1 = require("../users/users.service");
const postgraphile_service_1 = require("../postgraphile/postgraphile.service");
const uuid_1 = require("uuid");
let FriendsService = class FriendsService {
    postgraphileService;
    usersService;
    friendshipsTable = 'friendships';
    constructor(postgraphileService, usersService) {
        this.postgraphileService = postgraphileService;
        this.usersService = usersService;
    }
    async createFriendRequest(createFriendshipInput, requesterId) {
        const requester = await this.usersService.findOne(requesterId);
        if (!requester) {
            throw new common_1.NotFoundException('Requester not found');
        }
        const recipient = await this.usersService.findOne(createFriendshipInput.recipientId);
        if (!recipient) {
            throw new common_1.NotFoundException('Recipient not found');
        }
        const existingFriendships = await this.findFriendshipBetweenUsers(requesterId, createFriendshipInput.recipientId);
        if (existingFriendships.length > 0) {
            throw new common_1.ForbiddenException('A friendship relationship already exists between these users');
        }
        const friendshipData = {
            id: (0, uuid_1.v4)(),
            requesterId,
            recipientId: createFriendshipInput.recipientId,
            status: friendship_entity_1.FriendshipStatus.PENDING,
            followsMood: createFriendshipInput.followMood || false,
            createdAt: new Date(),
        };
        const friendship = await this.postgraphileService.insert(this.friendshipsTable, friendshipData);
        friendship.requester = requester;
        friendship.recipient = recipient;
        return friendship;
    }
    async updateFriendship(updateFriendshipInput, userId) {
        const friendship = await this.findFriendshipById(updateFriendshipInput.friendshipId);
        if (friendship.recipientId !== userId && friendship.requesterId !== userId) {
            throw new common_1.ForbiddenException('You can only update friendships that you are a part of');
        }
        if (updateFriendshipInput.status && friendship.recipientId !== userId) {
            throw new common_1.ForbiddenException('Only the recipient can accept or reject a friendship request');
        }
        const updateData = {};
        if (updateFriendshipInput.status) {
            updateData.status = updateFriendshipInput.status;
        }
        if (updateFriendshipInput.followMood !== undefined) {
            updateData.followsMood = updateFriendshipInput.followMood;
        }
        updateData.updatedAt = new Date();
        const updatedFriendship = await this.postgraphileService.update(this.friendshipsTable, updateFriendshipInput.friendshipId, updateData);
        return this.findFriendshipById(updatedFriendship.id);
    }
    async findFriendshipById(id) {
        const friendship = await this.postgraphileService.findById(this.friendshipsTable, id);
        if (!friendship) {
            throw new common_1.NotFoundException(`Friendship with id ${id} not found`);
        }
        friendship.requester = await this.usersService.findOne(friendship.requesterId);
        friendship.recipient = await this.usersService.findOne(friendship.recipientId);
        return friendship;
    }
    async findFriendshipBetweenUsers(userId1, userId2) {
        const friendships1 = await this.postgraphileService.findWhere(this.friendshipsTable, {
            requesterId: userId1,
            recipientId: userId2
        });
        const friendships2 = await this.postgraphileService.findWhere(this.friendshipsTable, {
            requesterId: userId2,
            recipientId: userId1
        });
        return [...friendships1, ...friendships2];
    }
    async findFriendships(userId) {
        const asSender = await this.postgraphileService.findWhere(this.friendshipsTable, { requesterId: userId });
        const asRecipient = await this.postgraphileService.findWhere(this.friendshipsTable, { recipientId: userId });
        const friendships = [...asSender, ...asRecipient];
        for (const friendship of friendships) {
            friendship.requester = await this.usersService.findOne(friendship.requesterId);
            friendship.recipient = await this.usersService.findOne(friendship.recipientId);
        }
        return friendships;
    }
    async findFriends(userId) {
        const allFriendships = await this.findFriendships(userId);
        return allFriendships.filter(friendship => friendship.status === friendship_entity_1.FriendshipStatus.ACCEPTED);
    }
    async findPendingFriendRequests(userId) {
        const pendingRequests = await this.postgraphileService.findWhere(this.friendshipsTable, {
            recipientId: userId,
            status: friendship_entity_1.FriendshipStatus.PENDING
        });
        for (const request of pendingRequests) {
            request.requester = await this.usersService.findOne(request.requesterId);
            request.recipient = await this.usersService.findOne(request.recipientId);
        }
        return pendingRequests;
    }
    async findSentFriendRequests(userId) {
        const sentRequests = await this.postgraphileService.findWhere(this.friendshipsTable, {
            requesterId: userId,
            status: friendship_entity_1.FriendshipStatus.PENDING
        });
        for (const request of sentRequests) {
            request.requester = await this.usersService.findOne(request.requesterId);
            request.recipient = await this.usersService.findOne(request.recipientId);
        }
        return sentRequests;
    }
    async areFriends(userId1, userId2) {
        const friendships = await this.findFriendshipBetweenUsers(userId1, userId2);
        return friendships.some(friendship => friendship.status === friendship_entity_1.FriendshipStatus.ACCEPTED);
    }
    async findMoodFollowing(userId) {
        const friends = await this.findFriends(userId);
        return friends.filter(friendship => friendship.followsMood === true);
    }
};
exports.FriendsService = FriendsService;
exports.FriendsService = FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgraphile_service_1.PostGraphileService,
        users_service_1.UsersService])
], FriendsService);
//# sourceMappingURL=friends.service.js.map