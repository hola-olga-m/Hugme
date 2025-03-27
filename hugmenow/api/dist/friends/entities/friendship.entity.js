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
exports.Friendship = exports.FriendshipStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../../users/entities/user.entity");
var FriendshipStatus;
(function (FriendshipStatus) {
    FriendshipStatus["PENDING"] = "PENDING";
    FriendshipStatus["ACCEPTED"] = "ACCEPTED";
    FriendshipStatus["REJECTED"] = "REJECTED";
    FriendshipStatus["BLOCKED"] = "BLOCKED";
})(FriendshipStatus || (exports.FriendshipStatus = FriendshipStatus = {}));
(0, graphql_1.registerEnumType)(FriendshipStatus, {
    name: 'FriendshipStatus',
    description: 'The status of a friendship between two users',
});
let Friendship = class Friendship {
    id;
    requester;
    requesterId;
    recipient;
    recipientId;
    status;
    createdAt;
    updatedAt;
    followsMood;
};
exports.Friendship = Friendship;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Friendship.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Friendship.prototype, "requester", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Friendship.prototype, "requesterId", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Friendship.prototype, "recipient", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Friendship.prototype, "recipientId", void 0);
__decorate([
    (0, graphql_1.Field)(() => FriendshipStatus),
    __metadata("design:type", String)
], Friendship.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Friendship.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Friendship.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], Friendship.prototype, "followsMood", void 0);
exports.Friendship = Friendship = __decorate([
    (0, graphql_1.ObjectType)()
], Friendship);
//# sourceMappingURL=friendship.entity.js.map