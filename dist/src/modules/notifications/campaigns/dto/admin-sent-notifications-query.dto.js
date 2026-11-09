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
exports.AdminSentNotificationsQueryDto = exports.AdminNotificationSendTarget = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var AdminNotificationSendTarget;
(function (AdminNotificationSendTarget) {
    AdminNotificationSendTarget["USER"] = "user";
    AdminNotificationSendTarget["ROLE"] = "role";
})(AdminNotificationSendTarget || (exports.AdminNotificationSendTarget = AdminNotificationSendTarget = {}));
class AdminSentNotificationsQueryDto {
    page;
    per_page;
    search;
    target;
    acteurId;
    role;
    entrepriseId;
    dateFrom;
    dateTo;
}
exports.AdminSentNotificationsQueryDto = AdminSentNotificationsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AdminSentNotificationsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], AdminSentNotificationsQueryDto.prototype, "per_page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Recherche dans le titre." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim() || undefined : value),
    __metadata("design:type", String)
], AdminSentNotificationsQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AdminNotificationSendTarget }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AdminNotificationSendTarget),
    __metadata("design:type", String)
], AdminSentNotificationsQueryDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Filtrer par expéditeur." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AdminSentNotificationsQueryDto.prototype, "acteurId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Role, description: "Envois ciblant un rôle." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Role),
    __metadata("design:type", String)
], AdminSentNotificationsQueryDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Équipe Pointelio uniquement : filtre par entreprise.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AdminSentNotificationsQueryDto.prototype, "entrepriseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Envoyées depuis (ISO date)." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AdminSentNotificationsQueryDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Envoyées jusqu'à (ISO date)." }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AdminSentNotificationsQueryDto.prototype, "dateTo", void 0);
//# sourceMappingURL=admin-sent-notifications-query.dto.js.map