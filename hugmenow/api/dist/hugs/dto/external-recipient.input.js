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
exports.ExternalRecipientInput = exports.ExternalRecipientType = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
var ExternalRecipientType;
(function (ExternalRecipientType) {
    ExternalRecipientType["EMAIL"] = "email";
    ExternalRecipientType["TELEGRAM"] = "telegram";
})(ExternalRecipientType || (exports.ExternalRecipientType = ExternalRecipientType = {}));
(0, graphql_1.registerEnumType)(ExternalRecipientType, {
    name: 'ExternalRecipientType',
    description: 'The type of external recipient contact',
});
let ExternalRecipientInput = class ExternalRecipientInput {
    type;
    contact;
};
exports.ExternalRecipientInput = ExternalRecipientInput;
__decorate([
    (0, graphql_1.Field)(() => ExternalRecipientType),
    (0, class_validator_1.IsEnum)(ExternalRecipientType),
    __metadata("design:type", String)
], ExternalRecipientInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExternalRecipientInput.prototype, "contact", void 0);
exports.ExternalRecipientInput = ExternalRecipientInput = __decorate([
    (0, graphql_1.InputType)()
], ExternalRecipientInput);
//# sourceMappingURL=external-recipient.input.js.map