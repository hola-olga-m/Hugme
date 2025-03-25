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
exports.Hug = exports.HugType = void 0;
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../../users/entities/user.entity");
var HugType;
(function (HugType) {
    HugType["QUICK"] = "QUICK";
    HugType["WARM"] = "WARM";
    HugType["SUPPORTIVE"] = "SUPPORTIVE";
    HugType["COMFORTING"] = "COMFORTING";
    HugType["ENCOURAGING"] = "ENCOURAGING";
    HugType["CELEBRATORY"] = "CELEBRATORY";
})(HugType || (exports.HugType = HugType = {}));
(0, graphql_1.registerEnumType)(HugType, {
    name: 'HugType',
    description: 'The type of hug sent',
});
let Hug = class Hug {
    id;
    type;
    message;
    sender;
    senderId;
    recipient;
    recipientId;
    isRead;
    createdAt;
};
exports.Hug = Hug;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Hug.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => HugType),
    __metadata("design:type", String)
], Hug.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Hug.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Hug.prototype, "sender", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Hug.prototype, "senderId", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Hug.prototype, "recipient", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Hug.prototype, "recipientId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Hug.prototype, "isRead", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Hug.prototype, "createdAt", void 0);
exports.Hug = Hug = __decorate([
    (0, graphql_1.ObjectType)()
], Hug);
//# sourceMappingURL=hug.entity.js.map