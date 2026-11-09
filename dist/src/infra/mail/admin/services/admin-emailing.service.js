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
exports.AdminEmailingService = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../../../common/i18n");
const prisma_service_1 = require("../../../prisma/prisma.service");
const emailing_service_1 = require("../../emailing.service");
let AdminEmailingService = class AdminEmailingService {
    prisma;
    emailing;
    constructor(prisma, emailing) {
        this.prisma = prisma;
        this.emailing = emailing;
    }
    async send(dto, locale) {
        const fromUsers = await this.resolveEmailsFromUserIds(dto.userIds, locale);
        const direct = dto.emails ?? [];
        const to = [...new Set([...fromUsers, ...direct])];
        if (to.length === 0) {
            throw new common_1.BadRequestException((0, i18n_1.translate)(locale, "adminEmailRecipientsRequired"));
        }
        const result = await this.emailing.send({
            to,
            subject: dto.subject,
            ...(dto.text?.trim() ? { text: dto.text } : {}),
            ...(dto.html?.trim() ? { html: dto.html } : {}),
            ...(dto.cc?.length ? { cc: dto.cc } : {}),
            ...(dto.bcc?.length ? { bcc: dto.bcc } : {}),
            ...(dto.replyTo ? { replyTo: dto.replyTo } : {}),
            ...(dto.fromEmail ? { fromEmail: dto.fromEmail } : {}),
            ...(dto.fromName ? { fromName: dto.fromName } : {}),
            ...(dto.headers ? { headers: dto.headers } : {}),
        });
        return {
            ...result,
            to,
        };
    }
    async resolveEmailsFromUserIds(userIds, locale) {
        if (!userIds?.length) {
            return [];
        }
        const uniqueIds = [...new Set(userIds)];
        const users = await this.prisma.utilisateur.findMany({
            where: { id: { in: uniqueIds } },
            select: { id: true, email: true },
        });
        if (users.length !== uniqueIds.length) {
            const found = new Set(users.map((u) => u.id));
            const missing = uniqueIds.filter((id) => !found.has(id));
            throw new common_1.BadRequestException(`${(0, i18n_1.translate)(locale, "adminEmailUserIdsNotFound")}: ${missing.join(", ")}`);
        }
        return users
            .map((u) => u.email?.trim().toLowerCase())
            .filter((email) => Boolean(email));
    }
};
exports.AdminEmailingService = AdminEmailingService;
exports.AdminEmailingService = AdminEmailingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        emailing_service_1.EmailingService])
], AdminEmailingService);
//# sourceMappingURL=admin-emailing.service.js.map