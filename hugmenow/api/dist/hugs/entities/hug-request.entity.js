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
exports.HugRequest = exports.HugRequestStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../../users/entities/user.entity");
var HugRequestStatus;
(function (HugRequestStatus) {
    HugRequestStatus["PENDING"] = "PENDING";
    HugRequestStatus["ACCEPTED"] = "ACCEPTED";
    HugRequestStatus["DECLINED"] = "DECLINED";
    HugRequestStatus["EXPIRED"] = "EXPIRED";
    HugRequestStatus["CANCELLED"] = "CANCELLED";
})(HugRequestStatus || (exports.HugRequestStatus = HugRequestStatus = {}));
(0, graphql_1.registerEnumType)(HugRequestStatus, {
    name: 'HugRequestStatus',
    description: 'The status of a hug request',
});
let HugRequest = class HugRequest {
    id;
    message;
    requester;
    requesterId;
    recipient;
    recipientId;
    isCommunityRequest;
    status;
    createdAt;
    respondedAt;
};
exports.HugRequest = HugRequest;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], HugRequest.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HugRequest.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], HugRequest.prototype, "requester", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HugRequest.prototype, "requesterId", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], HugRequest.prototype, "recipient", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HugRequest.prototype, "recipientId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], HugRequest.prototype, "isCommunityRequest", void 0);
__decorate([
    (0, graphql_1.Field)(() => HugRequestStatus),
    __metadata("design:type", String)
], HugRequest.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], HugRequest.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], HugRequest.prototype, "respondedAt", void 0);
exports.HugRequest = HugRequest = __decorate([
    (0, graphql_1.ObjectType)()
], HugRequest);
//# sourceMappingURL=hug-request.entity.js.map