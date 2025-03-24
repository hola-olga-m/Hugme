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
exports.HugsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const hugs_service_1 = require("./hugs.service");
const hug_entity_1 = require("./entities/hug.entity");
const hug_request_entity_1 = require("./entities/hug-request.entity");
const send_hug_input_1 = require("./dto/send-hug.input");
const create_hug_request_input_1 = require("./dto/create-hug-request.input");
const respond_to_request_input_1 = require("./dto/respond-to-request.input");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let HugsResolver = class HugsResolver {
    hugsService;
    constructor(hugsService) {
        this.hugsService = hugsService;
    }
    async sendHug(sendHugInput, user) {
        return this.hugsService.sendHug(sendHugInput, user.id);
    }
    async sentHugs(user) {
        return this.hugsService.findHugsBySender(user.id);
    }
    async receivedHugs(user) {
        return this.hugsService.findHugsByRecipient(user.id);
    }
    async hug(id) {
        return this.hugsService.findHugById(id);
    }
    async markHugAsRead(id, user) {
        return this.hugsService.markHugAsRead(id, user.id);
    }
    async createHugRequest(createHugRequestInput, user) {
        return this.hugsService.createHugRequest(createHugRequestInput, user.id);
    }
    async myHugRequests(user) {
        return this.hugsService.findHugRequestsByUser(user.id);
    }
    async pendingHugRequests(user) {
        return this.hugsService.findPendingRequestsForUser(user.id);
    }
    async communityHugRequests() {
        return this.hugsService.findCommunityRequests();
    }
    async hugRequest(id) {
        return this.hugsService.findHugRequestById(id);
    }
    async respondToHugRequest(respondToRequestInput, user) {
        return this.hugsService.respondToHugRequest(respondToRequestInput, user.id);
    }
    async cancelHugRequest(id, user) {
        return this.hugsService.cancelHugRequest(id, user.id);
    }
};
exports.HugsResolver = HugsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => hug_entity_1.Hug),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('sendHugInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_hug_input_1.SendHugInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "sendHug", null);
__decorate([
    (0, graphql_1.Query)(() => [hug_entity_1.Hug]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "sentHugs", null);
__decorate([
    (0, graphql_1.Query)(() => [hug_entity_1.Hug]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "receivedHugs", null);
__decorate([
    (0, graphql_1.Query)(() => hug_entity_1.Hug),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "hug", null);
__decorate([
    (0, graphql_1.Mutation)(() => hug_entity_1.Hug),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "markHugAsRead", null);
__decorate([
    (0, graphql_1.Mutation)(() => hug_request_entity_1.HugRequest),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('createHugRequestInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hug_request_input_1.CreateHugRequestInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "createHugRequest", null);
__decorate([
    (0, graphql_1.Query)(() => [hug_request_entity_1.HugRequest]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "myHugRequests", null);
__decorate([
    (0, graphql_1.Query)(() => [hug_request_entity_1.HugRequest]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "pendingHugRequests", null);
__decorate([
    (0, graphql_1.Query)(() => [hug_request_entity_1.HugRequest]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "communityHugRequests", null);
__decorate([
    (0, graphql_1.Query)(() => hug_request_entity_1.HugRequest),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "hugRequest", null);
__decorate([
    (0, graphql_1.Mutation)(() => hug_request_entity_1.HugRequest),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('respondToRequestInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [respond_to_request_input_1.RespondToRequestInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "respondToHugRequest", null);
__decorate([
    (0, graphql_1.Mutation)(() => hug_request_entity_1.HugRequest),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HugsResolver.prototype, "cancelHugRequest", null);
exports.HugsResolver = HugsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [hugs_service_1.HugsService])
], HugsResolver);
//# sourceMappingURL=hugs.resolver.js.map