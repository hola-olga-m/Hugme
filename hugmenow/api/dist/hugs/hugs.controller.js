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
exports.HugsController = void 0;
const common_1 = require("@nestjs/common");
const hugs_service_1 = require("./hugs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const send_hug_input_1 = require("./dto/send-hug.input");
const create_hug_request_input_1 = require("./dto/create-hug-request.input");
const respond_to_request_input_1 = require("./dto/respond-to-request.input");
let HugsController = class HugsController {
    hugsService;
    constructor(hugsService) {
        this.hugsService = hugsService;
    }
    async sendHug(sendHugInput, req, res) {
        try {
            const senderId = req.user.userId;
            const newHug = await this.hugsService.sendHug(sendHugInput, senderId);
            return res.status(common_1.HttpStatus.CREATED).json(newHug);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to send hug');
        }
    }
    async markHugAsRead(id, req, res) {
        try {
            const userId = req.user.userId;
            const updatedHug = await this.hugsService.markHugAsRead(id, userId);
            return res.status(common_1.HttpStatus.OK).json(updatedHug);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to mark hug as read');
        }
    }
    async getSentHugs(req) {
        try {
            const userId = req.user.userId;
            return this.hugsService.findHugsBySender(userId);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to get sent hugs');
        }
    }
    async getReceivedHugs(req) {
        try {
            const userId = req.user.userId;
            return this.hugsService.findHugsByRecipient(userId);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to get received hugs');
        }
    }
    async getHug(id, req) {
        try {
            const userId = req.user.userId;
            const hug = await this.hugsService.findHugById(id);
            if (hug.senderId !== userId && hug.recipientId !== userId) {
                throw new common_1.UnauthorizedException('You do not have permission to view this hug');
            }
            return hug;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.NotFoundException(`Hug with ID ${id} not found`);
        }
    }
    async createHugRequest(createHugRequestInput, req, res) {
        try {
            const requesterId = req.user.userId;
            const newRequest = await this.hugsService.createHugRequest(createHugRequestInput, requesterId);
            return res.status(common_1.HttpStatus.CREATED).json(newRequest);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to create hug request');
        }
    }
    async respondToHugRequest(id, respondToRequestInput, req, res) {
        try {
            const userId = req.user.userId;
            respondToRequestInput.requestId = id;
            const updatedRequest = await this.hugsService.respondToHugRequest(respondToRequestInput, userId);
            return res.status(common_1.HttpStatus.OK).json(updatedRequest);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to respond to hug request');
        }
    }
    async cancelHugRequest(id, req, res) {
        try {
            const userId = req.user.userId;
            const canceledRequest = await this.hugsService.cancelHugRequest(id, userId);
            return res.status(common_1.HttpStatus.OK).json(canceledRequest);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to cancel hug request');
        }
    }
    async getMyHugRequests(req) {
        try {
            const userId = req.user.userId;
            return this.hugsService.findHugRequestsByUser(userId);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to get your hug requests');
        }
    }
    async getPendingHugRequests(req) {
        try {
            const userId = req.user.userId;
            return this.hugsService.findPendingRequestsForUser(userId);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to get pending hug requests');
        }
    }
    async getCommunityHugRequests() {
        try {
            return this.hugsService.findCommunityRequests();
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unable to get community hug requests');
        }
    }
    async getHugRequest(id, req) {
        try {
            const userId = req.user.userId;
            const request = await this.hugsService.findHugRequestById(id);
            if (!request.isCommunityRequest &&
                request.requesterId !== userId &&
                (request.recipientId && request.recipientId !== userId)) {
                throw new common_1.UnauthorizedException('You do not have permission to view this hug request');
            }
            return request;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.NotFoundException(`Hug request with ID ${id} not found`);
        }
    }
};
exports.HugsController = HugsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_hug_input_1.SendHugInput, Object, Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "sendHug", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "markHugAsRead", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sent'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "getSentHugs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('received'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "getReceivedHugs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "getHug", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('requests'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hug_request_input_1.CreateHugRequestInput, Object, Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "createHugRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('requests/:id/respond'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, respond_to_request_input_1.RespondToRequestInput, Object, Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "respondToHugRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('requests/:id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "cancelHugRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('requests/my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "getMyHugRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('requests/pending'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "getPendingHugRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('requests/community'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "getCommunityHugRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HugsController.prototype, "getHugRequest", null);
exports.HugsController = HugsController = __decorate([
    (0, common_1.Controller)('hugs'),
    __metadata("design:paramtypes", [hugs_service_1.HugsService])
], HugsController);
//# sourceMappingURL=hugs.controller.js.map