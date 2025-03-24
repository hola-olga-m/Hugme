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
exports.HugsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hug_entity_1 = require("./entities/hug.entity");
const hug_request_entity_1 = require("./entities/hug-request.entity");
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
let HugsService = class HugsService {
    hugsRepository;
    hugRequestsRepository;
    usersService;
    constructor(hugsRepository, hugRequestsRepository, usersService) {
        this.hugsRepository = hugsRepository;
        this.hugRequestsRepository = hugRequestsRepository;
        this.usersService = usersService;
    }
    async sendHug(sendHugInput, senderId) {
        const sender = await this.usersService.findOne(senderId);
        const recipient = await this.usersService.findOne(sendHugInput.recipientId);
        if (!recipient) {
            throw new common_1.NotFoundException(`Recipient with ID ${sendHugInput.recipientId} not found`);
        }
        const hug = this.hugsRepository.create({
            id: (0, uuid_1.v4)(),
            type: sendHugInput.type,
            message: sendHugInput.message,
            sender,
            senderId: sender.id,
            recipient,
            recipientId: recipient.id,
            isRead: false,
            createdAt: new Date()
        });
        return this.hugsRepository.save(hug);
    }
    async findAllHugs() {
        return this.hugsRepository.find({
            relations: ['sender', 'recipient']
        });
    }
    async findHugById(id) {
        const hug = await this.hugsRepository.findOne({
            where: { id },
            relations: ['sender', 'recipient']
        });
        if (!hug) {
            throw new common_1.NotFoundException(`Hug with ID ${id} not found`);
        }
        return hug;
    }
    async findHugsBySender(senderId) {
        return this.hugsRepository.find({
            where: { senderId },
            relations: ['sender', 'recipient'],
            order: { createdAt: 'DESC' }
        });
    }
    async findHugsByRecipient(recipientId) {
        return this.hugsRepository.find({
            where: { recipientId },
            relations: ['sender', 'recipient'],
            order: { createdAt: 'DESC' }
        });
    }
    async markHugAsRead(hugId, userId) {
        const hug = await this.findHugById(hugId);
        if (hug.recipientId !== userId) {
            throw new common_1.ForbiddenException('You can only mark hugs sent to you as read');
        }
        hug.isRead = true;
        return this.hugsRepository.save(hug);
    }
    async createHugRequest(createHugRequestInput, requesterId) {
        const requester = await this.usersService.findOne(requesterId);
        let recipient = null;
        if (createHugRequestInput.recipientId) {
            recipient = await this.usersService.findOne(createHugRequestInput.recipientId);
            if (!recipient) {
                throw new common_1.NotFoundException(`Recipient with ID ${createHugRequestInput.recipientId} not found`);
            }
        }
        const request = this.hugRequestsRepository.create({
            id: (0, uuid_1.v4)(),
            message: createHugRequestInput.message,
            requester,
            requesterId: requester.id,
            recipient,
            recipientId: recipient?.id,
            isCommunityRequest: createHugRequestInput.isCommunityRequest,
            status: hug_request_entity_1.HugRequestStatus.PENDING,
            createdAt: new Date()
        });
        return this.hugRequestsRepository.save(request);
    }
    async findAllHugRequests() {
        return this.hugRequestsRepository.find({
            relations: ['requester', 'recipient'],
            order: { createdAt: 'DESC' }
        });
    }
    async findHugRequestById(id) {
        const request = await this.hugRequestsRepository.findOne({
            where: { id },
            relations: ['requester', 'recipient']
        });
        if (!request) {
            throw new common_1.NotFoundException(`Hug request with ID ${id} not found`);
        }
        return request;
    }
    async findHugRequestsByUser(userId) {
        return this.hugRequestsRepository.find({
            where: { requesterId: userId },
            relations: ['requester', 'recipient'],
            order: { createdAt: 'DESC' }
        });
    }
    async findPendingRequestsForUser(userId) {
        return this.hugRequestsRepository.find({
            where: {
                recipientId: userId,
                status: hug_request_entity_1.HugRequestStatus.PENDING
            },
            relations: ['requester', 'recipient'],
            order: { createdAt: 'DESC' }
        });
    }
    async findCommunityRequests() {
        return this.hugRequestsRepository.find({
            where: {
                isCommunityRequest: true,
                status: hug_request_entity_1.HugRequestStatus.PENDING
            },
            relations: ['requester'],
            order: { createdAt: 'DESC' }
        });
    }
    async respondToHugRequest(respondToRequestInput, userId) {
        const request = await this.findHugRequestById(respondToRequestInput.requestId);
        if (!request.isCommunityRequest && request.recipientId !== userId) {
            throw new common_1.ForbiddenException('You cannot respond to this request');
        }
        if (request.status !== hug_request_entity_1.HugRequestStatus.PENDING) {
            throw new common_1.ForbiddenException(`This request has already been ${request.status.toLowerCase()}`);
        }
        request.status = respondToRequestInput.status;
        request.respondedAt = new Date();
        if (respondToRequestInput.status === hug_request_entity_1.HugRequestStatus.ACCEPTED) {
            const recipient = await this.usersService.findOne(request.requesterId);
            const sender = await this.usersService.findOne(userId);
            await this.hugsRepository.save({
                id: (0, uuid_1.v4)(),
                type: hug_entity_1.HugType.SUPPORTIVE,
                message: respondToRequestInput.message || 'Responding to your hug request',
                sender,
                senderId: sender.id,
                recipient,
                recipientId: recipient.id,
                isRead: false,
                createdAt: new Date()
            });
        }
        return this.hugRequestsRepository.save(request);
    }
    async cancelHugRequest(requestId, userId) {
        const request = await this.findHugRequestById(requestId);
        if (request.requesterId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own requests');
        }
        if (request.status !== hug_request_entity_1.HugRequestStatus.PENDING) {
            throw new common_1.ForbiddenException(`This request has already been ${request.status.toLowerCase()}`);
        }
        request.status = hug_request_entity_1.HugRequestStatus.CANCELLED;
        request.respondedAt = new Date();
        return this.hugRequestsRepository.save(request);
    }
};
exports.HugsService = HugsService;
exports.HugsService = HugsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hug_entity_1.Hug)),
    __param(1, (0, typeorm_1.InjectRepository)(hug_request_entity_1.HugRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], HugsService);
//# sourceMappingURL=hugs.service.js.map