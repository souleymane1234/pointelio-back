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
exports.AdminSendEmailDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const admin_email_recipients_constraint_1 = require("../validators/admin-email-recipients.constraint");
function normalizeIdList(value) {
    if (value == null)
        return undefined;
    if (Array.isArray(value)) {
        return value.map((item) => Number(item));
    }
    return undefined;
}
function normalizeEmailList(value) {
    if (value == null)
        return undefined;
    if (Array.isArray(value)) {
        return value
            .map((item) => typeof item === "string" ? item.trim().toLowerCase() : "")
            .filter(Boolean);
    }
    if (typeof value === "string") {
        const parts = value
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
        return parts.length > 0 ? parts : undefined;
    }
    return undefined;
}
class AdminSendEmailDto {
    userIds;
    emails;
    subject;
    text;
    html;
    cc;
    bcc;
    replyTo;
    fromEmail;
    fromName;
    headers;
}
exports.AdminSendEmailDto = AdminSendEmailDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => normalizeIdList(value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], AdminSendEmailDto.prototype, "userIds", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => normalizeEmailList(value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], AdminSendEmailDto.prototype, "emails", void 0);
__decorate([
    (0, class_validator_1.Validate)(admin_email_recipients_constraint_1.AdminEmailHasRecipientsConstraint),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminSendEmailDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminSendEmailDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminSendEmailDto.prototype, "html", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => normalizeEmailList(value)),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], AdminSendEmailDto.prototype, "cc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => normalizeEmailList(value)),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], AdminSendEmailDto.prototype, "bcc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AdminSendEmailDto.prototype, "replyTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AdminSendEmailDto.prototype, "fromEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminSendEmailDto.prototype, "fromName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AdminSendEmailDto.prototype, "headers", void 0);
//# sourceMappingURL=admin-send-email.dto.js.map