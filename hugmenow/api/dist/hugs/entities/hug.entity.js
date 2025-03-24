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
const typeorm_1 = require("typeorm");
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
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Hug.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => HugType),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: HugType,
        default: HugType.QUICK,
    }),
    __metadata("design:type", String)
], Hug.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hug.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", user_entity_1.User)
], Hug.prototype, "sender", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'sender_id' }),
    __metadata("design:type", String)
], Hug.prototype, "senderId", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'recipient_id' }),
    __metadata("design:type", user_entity_1.User)
], Hug.prototype, "recipient", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'recipient_id' }),
    __metadata("design:type", String)
], Hug.prototype, "recipientId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Hug.prototype, "isRead", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Hug.prototype, "createdAt", void 0);
exports.Hug = Hug = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('hugs')
], Hug);
//# sourceMappingURL=hug.entity.js.map