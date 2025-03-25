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
var PermissionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const graphql_shield_1 = require("graphql-shield");
const graphql_1 = require("graphql");
let PermissionsService = PermissionsService_1 = class PermissionsService {
    jwtService;
    logger = new common_1.Logger(PermissionsService_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    isAuthenticated = (0, graphql_shield_1.rule)()(async (parent, args, context, info) => {
        return context.user !== null && context.user !== undefined;
    });
    isAdmin = (0, graphql_shield_1.rule)()(async (parent, args, context, info) => {
        return context.user?.role === 'ADMIN';
    });
    isSelf = (0, graphql_shield_1.rule)()(async (parent, args, context, info) => {
        const id = args.id || parent?.id;
        return context.user?.id === id;
    });
    isOwnMood = (0, graphql_shield_1.rule)()(async (parent, args, context, info) => {
        const moodId = args.id || args.updateMoodInput?.id || parent?.id;
        if (parent?.userId) {
            return context.user?.id === parent.userId;
        }
        try {
            const mood = await context.dataSources.moodsService.findOne(moodId);
            return context.user?.id === mood.userId;
        }
        catch (error) {
            this.logger.error(`Error checking mood ownership: ${error.message}`);
            return false;
        }
    });
    isPublicMood = (0, graphql_shield_1.rule)()(async (parent, args, context, info) => {
        const moodId = args.id || parent?.id;
        if (parent?.isPublic !== undefined) {
            return parent.isPublic === true;
        }
        try {
            const mood = await context.dataSources.moodsService.findOne(moodId);
            return mood.isPublic === true;
        }
        catch (error) {
            this.logger.error(`Error checking if mood is public: ${error.message}`);
            return false;
        }
    });
    isHugSenderOrRecipient = (0, graphql_shield_1.rule)()(async (parent, args, context, info) => {
        const hugId = args.id || parent?.id;
        if (parent?.senderId && parent?.recipientId) {
            return context.user?.id === parent.senderId || context.user?.id === parent.recipientId;
        }
        try {
            const hug = await context.dataSources.hugsService.findHugById(hugId);
            return context.user?.id === hug.senderId || context.user?.id === hug.recipientId;
        }
        catch (error) {
            this.logger.error(`Error checking hug sender/recipient: ${error.message}`);
            return false;
        }
    });
    isHugRequestRequesterOrRecipient = (0, graphql_shield_1.rule)()(async (parent, args, context, info) => {
        const requestId = args.id || args.requestId || parent?.id;
        if (parent?.requesterId && parent?.recipientId) {
            return context.user?.id === parent.requesterId || context.user?.id === parent.recipientId;
        }
        try {
            const request = await context.dataSources.hugsService.findHugRequestById(requestId);
            return context.user?.id === request.requesterId || context.user?.id === request.recipientId;
        }
        catch (error) {
            this.logger.error(`Error checking hug request requester/recipient: ${error.message}`);
            return false;
        }
    });
    isCommunityHugRequest = (0, graphql_shield_1.rule)()(async (parent, args, context, info) => {
        const requestId = args.id || parent?.id;
        if (parent?.isCommunityRequest !== undefined) {
            return parent.isCommunityRequest === true;
        }
        try {
            const request = await context.dataSources.hugsService.findHugRequestById(requestId);
            return request.isCommunityRequest === true;
        }
        catch (error) {
            this.logger.error(`Error checking if hug request is community: ${error.message}`);
            return false;
        }
    });
    createPermissions() {
        return (0, graphql_shield_1.shield)({
            Query: {
                users: this.isAuthenticated,
                user: graphql_shield_1.allow,
                me: this.isAuthenticated,
                publicMoods: graphql_shield_1.allow,
                userMoods: this.isAuthenticated,
                mood: (0, graphql_shield_1.or)(this.isAuthenticated, this.isPublicMood),
                moodStreak: this.isAuthenticated,
                sentHugs: this.isAuthenticated,
                receivedHugs: this.isAuthenticated,
                hug: (0, graphql_shield_1.and)(this.isAuthenticated, this.isHugSenderOrRecipient),
                myHugRequests: this.isAuthenticated,
                pendingHugRequests: this.isAuthenticated,
                communityHugRequests: this.isAuthenticated,
                hugRequest: (0, graphql_shield_1.and)(this.isAuthenticated, (0, graphql_shield_1.or)(this.isHugRequestRequesterOrRecipient, this.isCommunityHugRequest))
            },
            Mutation: {
                login: graphql_shield_1.allow,
                register: graphql_shield_1.allow,
                anonymousLogin: graphql_shield_1.allow,
                updateUser: (0, graphql_shield_1.and)(this.isAuthenticated, this.isSelf),
                removeUser: (0, graphql_shield_1.and)(this.isAuthenticated, this.isSelf),
                createMood: this.isAuthenticated,
                updateMood: (0, graphql_shield_1.and)(this.isAuthenticated, this.isOwnMood),
                removeMood: (0, graphql_shield_1.and)(this.isAuthenticated, this.isOwnMood),
                sendHug: this.isAuthenticated,
                markHugAsRead: (0, graphql_shield_1.and)(this.isAuthenticated, this.isHugSenderOrRecipient),
                createHugRequest: this.isAuthenticated,
                respondToHugRequest: (0, graphql_shield_1.and)(this.isAuthenticated, (0, graphql_shield_1.or)(this.isHugRequestRequesterOrRecipient, this.isCommunityHugRequest)),
                cancelHugRequest: (0, graphql_shield_1.and)(this.isAuthenticated, this.isHugRequestRequesterOrRecipient)
            },
            User: {
                id: graphql_shield_1.allow,
                username: graphql_shield_1.allow,
                email: (0, graphql_shield_1.and)(this.isAuthenticated, (0, graphql_shield_1.or)(this.isSelf, this.isAdmin)),
                name: graphql_shield_1.allow,
                password: graphql_shield_1.deny,
                avatarUrl: graphql_shield_1.allow,
                isAnonymous: graphql_shield_1.allow,
                createdAt: graphql_shield_1.allow,
                updatedAt: graphql_shield_1.allow
            },
            Mood: {
                '*': graphql_shield_1.allow,
            },
            Hug: {
                '*': (0, graphql_shield_1.and)(this.isAuthenticated, this.isHugSenderOrRecipient),
            },
            HugRequest: {
                '*': (0, graphql_shield_1.and)(this.isAuthenticated, (0, graphql_shield_1.or)(this.isHugRequestRequesterOrRecipient, this.isCommunityHugRequest)),
            }
        }, {
            fallbackRule: graphql_shield_1.deny,
            fallbackError: new graphql_1.GraphQLError('Access denied. Not authorized to access this resource.', { extensions: { code: 'FORBIDDEN' } }),
            allowExternalErrors: true,
            debug: true
        });
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = PermissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map