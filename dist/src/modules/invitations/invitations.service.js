"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InvitationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const response_util_1 = require("../../common/utils/response.util");
const emailing_service_1 = require("../../infra/mail/emailing.service");
const templates_1 = require("../../infra/mail/templates");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const auth_validation_constants_1 = require("../auth/shared/auth-validation.constants");
const token_service_1 = require("../auth/session/services/token.service");
const login_select_1 = require("../auth/session/services/login.select");
const invitation_token_util_1 = require("./invitation-token.util");
const DEFAULT_TTL_HOURS = 72;
let InvitationsService = InvitationsService_1 = class InvitationsService {
    prisma;
    config;
    emailing;
    tokenService;
    auditActions;
    logger = new common_1.Logger(InvitationsService_1.name);
    constructor(prisma, config, emailing, tokenService, auditActions) {
        this.prisma = prisma;
        this.config = config;
        this.emailing = emailing;
        this.tokenService = tokenService;
        this.auditActions = auditActions;
    }
    async inviter(acteurId, user, locale) {
        if (!user.email || !user.entrepriseId) {
            throw this.invalid("invitationEmailRequis", locale);
        }
        if (user.statut !== client_1.StatutCompte.INVITE) {
            throw this.invalid("invitationNonApplicable", locale);
        }
        const { token, tokenHash } = (0, invitation_token_util_1.generateInvitationToken)();
        const expireAt = new Date(Date.now() + this.ttlHours() * 3_600_000);
        const [, invitation, entreprise] = await this.prisma.$transaction([
            this.prisma.invitation.deleteMany({
                where: {
                    email: user.email,
                    entrepriseId: user.entrepriseId,
                    utiliseeAt: null,
                },
            }),
            this.prisma.invitation.create({
                data: {
                    entrepriseId: user.entrepriseId,
                    email: user.email,
                    role: user.role,
                    tokenHash,
                    expireAt,
                },
                select: { id: true },
            }),
            this.prisma.entreprise.findUniqueOrThrow({
                where: { id: user.entrepriseId },
                select: { raisonSociale: true, nomCommercial: true },
            }),
        ]);
        const envoyee = await this.sendEmail(user.email, token, expireAt, entreprise.nomCommercial ?? entreprise.raisonSociale, locale);
        await this.auditActions.domainAction({
            acteurId,
            action: audit_actions_constants_1.AUDIT_ACTIONS.INVITATION_ENVOYEE,
            objet: audit_actions_constants_1.AUDIT_OBJETS.INVITATION,
            objetId: invitation.id,
            entrepriseId: user.entrepriseId,
            details: { utilisateurId: user.id, envoyee },
        });
        return {
            envoyee,
            expireAt,
            ...(this.exposeToken() ? { token } : {}),
        };
    }
    async renvoyer(actor, utilisateurId, locale) {
        const user = await this.prisma.utilisateur.findUnique({
            where: { id: utilisateurId },
            select: {
                id: true,
                email: true,
                role: true,
                statut: true,
                entrepriseId: true,
            },
        });
        const inScope = user &&
            ((0, role_groups_1.isPlatformRole)(actor.role) ||
                user.entrepriseId === actor.entrepriseId) &&
            (0, role_groups_1.canAssignRole)(actor.role, user.role);
        if (!inScope) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "userNotFound"));
        }
        return this.inviter(actor.id, user, locale);
    }
    async verifier(token, locale) {
        const invitation = await this.findValid(token, locale);
        return {
            email: invitation.email,
            role: invitation.role,
            expireAt: invitation.expireAt,
            entreprise: invitation.entreprise.nomCommercial ??
                invitation.entreprise.raisonSociale,
        };
    }
    async accepter(token, password, locale) {
        const invitation = await this.findValid(token, locale);
        const user = await this.prisma.utilisateur.findFirst({
            where: {
                email: invitation.email,
                entrepriseId: invitation.entrepriseId,
                statut: client_1.StatutCompte.INVITE,
            },
            select: { id: true, role: true },
        });
        if (!user) {
            throw this.invalid("invitationInvalide", locale);
        }
        if (!(0, auth_validation_constants_1.isAdminUserPasswordValid)(password, user.role)) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, auth_validation_constants_1.adminUserPasswordErrorMessage)(user.role)], undefined, locale));
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const activated = await this.prisma.$transaction(async (tx) => {
            const { count } = await tx.invitation.updateMany({
                where: { id: invitation.id, utiliseeAt: null },
                data: { utiliseeAt: new Date() },
            });
            if (count === 0) {
                throw this.invalid("invitationInvalide", locale);
            }
            return tx.utilisateur.update({
                where: { id: user.id, statut: client_1.StatutCompte.INVITE },
                data: { passwordHash, statut: client_1.StatutCompte.ACTIF },
                select: login_select_1.authUserSelect,
            });
        });
        await this.auditActions.domainAction({
            acteurId: user.id,
            action: audit_actions_constants_1.AUDIT_ACTIONS.INVITATION_ACCEPTEE,
            objet: audit_actions_constants_1.AUDIT_OBJETS.INVITATION,
            objetId: invitation.id,
            entrepriseId: invitation.entrepriseId,
        });
        return this.tokenService.buildAuthResponse(activated);
    }
    async findValid(token, locale) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { tokenHash: (0, invitation_token_util_1.hashInvitationToken)(token) },
            select: {
                id: true,
                email: true,
                role: true,
                entrepriseId: true,
                expireAt: true,
                utiliseeAt: true,
                entreprise: { select: { raisonSociale: true, nomCommercial: true } },
            },
        });
        if (!invitation ||
            invitation.utiliseeAt ||
            invitation.expireAt.getTime() < Date.now()) {
            throw this.invalid("invitationInvalide", locale);
        }
        return invitation;
    }
    async sendEmail(email, token, expireAt, entreprise, locale) {
        if (!this.emailing.isEnabled()) {
            this.logger.warn(`E-mail indisponible : invitation créée pour ${email} mais non envoyée.`);
            return false;
        }
        const lien = `${this.activationUrl()}?token=${encodeURIComponent(token)}`;
        const { subject, html, text } = (0, templates_1.generateGenericMessageEmail)({
            locale,
            subject: (0, i18n_1.translate)(locale, "invitationEmailSubject"),
            heading: (0, i18n_1.translate)(locale, "invitationEmailHeading"),
            message: (0, i18n_1.translate)(locale, "invitationEmailMessage", {
                entreprise,
                date: expireAt.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR"),
            }),
            action: { label: (0, i18n_1.translate)(locale, "invitationEmailAction"), href: lien },
        });
        try {
            await this.emailing.send({ to: [email], subject, html, text });
            return true;
        }
        catch (error) {
            this.logger.warn(`Échec d'envoi de l'invitation à ${email}: ${error.message}`);
            return false;
        }
    }
    ttlHours() {
        const parsed = Number(this.config.get("INVITATION_TTL_HOURS"));
        return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_HOURS;
    }
    activationUrl() {
        return (this.config.get("INVITATION_ACTIVATION_URL") ??
            "http://localhost:5010/activation");
    }
    exposeToken() {
        return (this.config.get("INVITATION_RETURN_TOKEN_IN_RESPONSE") === "true");
    }
    invalid(key, locale) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key)], undefined, locale));
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = InvitationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        emailing_service_1.EmailingService,
        token_service_1.TokenService,
        audit_actions_service_1.AuditActionsService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map