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
exports.HugsService = void 0;
const common_1 = require("@nestjs/common");
const hug_entity_1 = require("./entities/hug.entity");
const hug_request_entity_1 = require("./entities/hug-request.entity");
const users_service_1 = require("../users/users.service");
const postgraphile_service_1 = require("../postgraphile/postgraphile.service");
const friends_service_1 = require("../friends/friends.service");
const uuid_1 = require("uuid");
let HugsService = class HugsService {
    postgraphileService;
    usersService;
    friendsService;
    hugsTable = 'hugs';
    hugRequestsTable = 'hug_requests';
    constructor(postgraphileService, usersService, friendsService) {
        this.postgraphileService = postgraphileService;
        this.usersService = usersService;
        this.friendsService = friendsService;
    }
    async sendHug(sendHugInput, senderId) {
        const sender = await this.usersService.findOne(senderId);
        if (!sender) {
            throw new common_1.NotFoundException('Sender not found');
        }
        const hugData = {
            id: (0, uuid_1.v4)(),
            type: sendHugInput.type,
            message: sendHugInput.message,
            senderId,
            isRead: false,
            createdAt: new Date(),
        };
        if (sendHugInput.recipientId) {
            const recipient = await this.usersService.findOne(sendHugInput.recipientId);
            if (!recipient) {
                throw new common_1.NotFoundException('Recipient not found');
            }
            const areFriends = await this.friendsService.areFriends(senderId, sendHugInput.recipientId);
            if (!areFriends) {
                throw new common_1.ForbiddenException('You can only send hugs to your friends');
            }
            hugData.recipientId = sendHugInput.recipientId;
        }
        else if (sendHugInput.externalRecipient) {
            hugData.externalRecipient = {
                type: sendHugInput.externalRecipient.type,
                contact: sendHugInput.externalRecipient.contact,
            };
            console.log(`Sending ${sendHugInput.type} hug to external recipient: ${sendHugInput.externalRecipient.type}:${sendHugInput.externalRecipient.contact}`);
        }
        else {
            throw new common_1.ForbiddenException('Either recipientId or externalRecipient must be provided');
        }
        return await this.postgraphileService.insert(this.hugsTable, hugData);
    }
    async findAllHugs() {
        return await this.postgraphileService.findAll(this.hugsTable);
    }
    async findHugById(id) {
        const hug = await this.postgraphileService.findById(this.hugsTable, id);
        if (!hug) {
            throw new common_1.NotFoundException(`Hug with id ${id} not found`);
        }
        if (hug.senderId) {
            hug.sender = await this.usersService.findOne(hug.senderId);
        }
        if (hug.recipientId) {
            hug.recipient = await this.usersService.findOne(hug.recipientId);
        }
        return hug;
    }
    async findHugsBySender(senderId) {
        const hugs = await this.postgraphileService.findWhere(this.hugsTable, { senderId });
        for (const hug of hugs) {
            if (hug.senderId) {
                hug.sender = await this.usersService.findOne(hug.senderId);
            }
            if (hug.recipientId) {
                hug.recipient = await this.usersService.findOne(hug.recipientId);
            }
        }
        return hugs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findHugsByRecipient(recipientId) {
        const hugs = await this.postgraphileService.findWhere(this.hugsTable, { recipientId });
        for (const hug of hugs) {
            if (hug.senderId) {
                hug.sender = await this.usersService.findOne(hug.senderId);
            }
            if (hug.recipientId) {
                hug.recipient = await this.usersService.findOne(hug.recipientId);
            }
        }
        return hugs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async markHugAsRead(hugId, userId) {
        const hug = await this.postgraphileService.findById(this.hugsTable, hugId);
        if (!hug) {
            throw new common_1.NotFoundException(`Hug with id ${hugId} not found`);
        }
        if (hug.recipientId !== userId) {
            throw new common_1.ForbiddenException('You can only mark your own received hugs as read');
        }
        const updatedHug = await this.postgraphileService.update(this.hugsTable, hugId, { isRead: true });
        if (updatedHug.recipientId) {
            updatedHug.recipient = await this.usersService.findOne(updatedHug.recipientId);
        }
        return updatedHug;
    }
    async createHugRequest(createHugRequestInput, requesterId) {
        const requester = await this.usersService.findOne(requesterId);
        if (!requester) {
            throw new common_1.NotFoundException('Requester not found');
        }
        let recipientId = undefined;
        if (createHugRequestInput.recipientId) {
            const recipient = await this.usersService.findOne(createHugRequestInput.recipientId);
            if (!recipient) {
                throw new common_1.NotFoundException('Recipient not found');
            }
            recipientId = recipient.id;
        }
        const requestData = {
            id: (0, uuid_1.v4)(),
            message: createHugRequestInput.message,
            requesterId,
            recipientId,
            isCommunityRequest: createHugRequestInput.isCommunityRequest,
            status: hug_request_entity_1.HugRequestStatus.PENDING,
            createdAt: new Date(),
        };
        return await this.postgraphileService.insert(this.hugRequestsTable, requestData);
    }
    async findAllHugRequests() {
        return await this.postgraphileService.findAll(this.hugRequestsTable);
    }
    async findHugRequestById(id) {
        const request = await this.postgraphileService.findById(this.hugRequestsTable, id);
        if (!request) {
            throw new common_1.NotFoundException(`Hug request with id ${id} not found`);
        }
        if (request.requesterId) {
            request.requester = await this.usersService.findOne(request.requesterId);
        }
        if (request.recipientId) {
            request.recipient = await this.usersService.findOne(request.recipientId);
        }
        return request;
    }
    async findHugRequestsByUser(userId) {
        const requests = await this.postgraphileService.findWhere(this.hugRequestsTable, { requesterId: userId });
        for (const request of requests) {
            if (request.requesterId) {
                request.requester = await this.usersService.findOne(request.requesterId);
            }
            if (request.recipientId) {
                request.recipient = await this.usersService.findOne(request.recipientId);
            }
        }
        return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findPendingRequestsForUser(userId) {
        const allRequests = await this.postgraphileService.findAll(this.hugRequestsTable);
        const pendingRequests = allRequests.filter(request => request.recipientId === userId &&
            request.status === hug_request_entity_1.HugRequestStatus.PENDING);
        for (const request of pendingRequests) {
            if (request.requesterId) {
                request.requester = await this.usersService.findOne(request.requesterId);
            }
            if (request.recipientId) {
                request.recipient = await this.usersService.findOne(request.recipientId);
            }
        }
        return pendingRequests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findCommunityRequests() {
        const allRequests = await this.postgraphileService.findAll(this.hugRequestsTable);
        const communityRequests = allRequests.filter(request => request.isCommunityRequest === true &&
            request.status === hug_request_entity_1.HugRequestStatus.PENDING);
        for (const request of communityRequests) {
            if (request.requesterId) {
                request.requester = await this.usersService.findOne(request.requesterId);
            }
        }
        return communityRequests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async respondToHugRequest(respondToRequestInput, userId) {
        const request = await this.findHugRequestById(respondToRequestInput.requestId);
        if (!request.isCommunityRequest && request.recipientId !== userId) {
            throw new common_1.ForbiddenException('You can only respond to your own hug requests');
        }
        if (request.status !== hug_request_entity_1.HugRequestStatus.PENDING) {
            throw new common_1.ForbiddenException('This request has already been processed');
        }
        if (respondToRequestInput.status === hug_request_entity_1.HugRequestStatus.ACCEPTED) {
            await this.sendHug({
                recipientId: request.requesterId,
                type: hug_entity_1.HugType.SUPPORTIVE,
                message: respondToRequestInput.message || `In response to your request: "${request.message}"`,
            }, userId);
        }
        const updatedRequestData = {
            status: respondToRequestInput.status,
            respondedAt: new Date()
        };
        const updatedRequest = await this.postgraphileService.update(this.hugRequestsTable, respondToRequestInput.requestId, updatedRequestData);
        return this.findHugRequestById(updatedRequest.id);
    }
    async cancelHugRequest(requestId, userId) {
        const request = await this.findHugRequestById(requestId);
        if (request.requesterId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own hug requests');
        }
        if (request.status !== hug_request_entity_1.HugRequestStatus.PENDING) {
            throw new common_1.ForbiddenException('This request has already been processed');
        }
        const updatedRequest = await this.postgraphileService.update(this.hugRequestsTable, requestId, { status: hug_request_entity_1.HugRequestStatus.CANCELLED });
        return this.findHugRequestById(updatedRequest.id);
    }
};
exports.HugsService = HugsService;
exports.HugsService = HugsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgraphile_service_1.PostGraphileService,
        users_service_1.UsersService,
        friends_service_1.FriendsService])
], HugsService);
//# sourceMappingURL=hugs.service.js.map