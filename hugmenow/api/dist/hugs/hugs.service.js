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
const hug_type_enum_1 = require("./enums/hug-type.enum");
const request_status_enum_1 = require("./enums/request-status.enum");
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
        if (!sender) {
            throw new Error('Sender not found');
        }
        let recipient = null;
        if (sendHugInput.recipientId) {
            recipient = await this.usersService.findOne(sendHugInput.recipientId);
            if (!recipient) {
                throw new Error('Recipient not found');
            }
        }
        const hug = this.hugsRepository.create({
            ...sendHugInput,
            sender,
            senderId,
            recipient,
            recipientId: recipient?.id,
            type: recipient ? hug_type_enum_1.HugType.PERSONAL : hug_type_enum_1.HugType.COMMUNITY,
        });
        if (sendHugInput.requestId) {
            const request = await this.hugRequestsRepository.findOne({
                where: { id: sendHugInput.requestId },
            });
            if (request) {
                request.status = request_status_enum_1.RequestStatus.FULFILLED;
                await this.hugRequestsRepository.save(request);
                hug.request = request;
            }
        }
        return this.hugsRepository.save(hug);
    }
    async findAllHugs() {
        return this.hugsRepository.find({
            relations: ['sender', 'recipient', 'request'],
        });
    }
    async findHugById(id) {
        const hug = await this.hugsRepository.findOne({
            where: { id },
            relations: ['sender', 'recipient', 'request'],
        });
        if (!hug) {
            throw new Error('Hug not found');
        }
        return hug;
    }
    async findHugsBySender(senderId) {
        return this.hugsRepository.find({
            where: { senderId },
            relations: ['sender', 'recipient', 'request'],
        });
    }
    async findHugsByRecipient(recipientId) {
        return this.hugsRepository.find({
            where: { recipientId },
            relations: ['sender', 'recipient', 'request'],
        });
    }
    async markHugAsRead(hugId, userId) {
        const hug = await this.findHugById(hugId);
        if (hug.recipientId !== userId) {
            throw new Error('You can only mark your own hugs as read');
        }
        hug.isRead = true;
        return this.hugsRepository.save(hug);
    }
    async createHugRequest(createHugRequestInput, requesterId) {
        const requester = await this.usersService.findOne(requesterId);
        if (!requester) {
            throw new Error('Requester not found');
        }
        let recipient = null;
        if (createHugRequestInput.recipientId) {
            recipient = await this.usersService.findOne(createHugRequestInput.recipientId);
            if (!recipient) {
                throw new Error('Recipient not found');
            }
        }
        const request = this.hugRequestsRepository.create({
            ...createHugRequestInput,
            requester,
            requesterId,
            recipient,
            recipientId: recipient?.id,
            isCommunityRequest: !recipient,
            status: request_status_enum_1.RequestStatus.PENDING,
        });
        return this.hugRequestsRepository.save(request);
    }
    async findAllHugRequests() {
        return this.hugRequestsRepository.find({
            relations: ['requester', 'recipient'],
        });
    }
    async findHugRequestById(id) {
        const request = await this.hugRequestsRepository.findOne({
            where: { id },
            relations: ['requester', 'recipient'],
        });
        if (!request) {
            throw new Error('Hug request not found');
        }
        return request;
    }
    async findHugRequestsByUser(userId) {
        return this.hugRequestsRepository.find({
            where: [
                { requesterId: userId },
                { recipientId: userId },
            ],
            relations: ['requester', 'recipient'],
        });
    }
    async findPendingRequestsForUser(userId) {
        return this.hugRequestsRepository.find({
            where: {
                recipientId: userId,
                status: request_status_enum_1.RequestStatus.PENDING,
            },
            relations: ['requester', 'recipient'],
        });
    }
    async findCommunityRequests() {
        return this.hugRequestsRepository.find({
            where: {
                isCommunityRequest: true,
                status: request_status_enum_1.RequestStatus.PENDING,
            },
            relations: ['requester'],
        });
    }
    async respondToHugRequest(respondToRequestInput, userId) {
        const request = await this.findHugRequestById(respondToRequestInput.requestId);
        if (!request.isCommunityRequest && request.recipientId !== userId) {
            throw new Error('You cannot respond to this request');
        }
        if (respondToRequestInput.accept) {
            await this.sendHug({
                message: respondToRequestInput.message || `Responding to your hug request: "${request.message}"`,
                requestId: request.id,
                recipientId: request.requesterId,
            }, userId);
            request.status = request_status_enum_1.RequestStatus.FULFILLED;
        }
        else {
            request.status = request_status_enum_1.RequestStatus.DECLINED;
        }
        return this.hugRequestsRepository.save(request);
    }
    async cancelHugRequest(requestId, userId) {
        const request = await this.findHugRequestById(requestId);
        if (request.requesterId !== userId) {
            throw new Error('You can only cancel your own requests');
        }
        if (request.status !== request_status_enum_1.RequestStatus.PENDING) {
            throw new Error('You can only cancel pending requests');
        }
        request.status = request_status_enum_1.RequestStatus.CANCELLED;
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