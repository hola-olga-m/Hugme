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
exports.SendHugInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const hug_entity_1 = require("../entities/hug.entity");
let SendHugInput = class SendHugInput {
    recipientId;
    type;
    message;
};
exports.SendHugInput = SendHugInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendHugInput.prototype, "recipientId", void 0);
__decorate([
    (0, graphql_1.Field)(() => hug_entity_1.HugType),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(hug_entity_1.HugType),
    __metadata("design:type", String)
], SendHugInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendHugInput.prototype, "message", void 0);
exports.SendHugInput = SendHugInput = __decorate([
    (0, graphql_1.InputType)()
], SendHugInput);
//# sourceMappingURL=send-hug.input.js.map