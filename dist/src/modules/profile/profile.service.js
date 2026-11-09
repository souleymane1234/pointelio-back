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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const i18n_1 = require("../../common/i18n");
const response_util_1 = require("../../common/utils/response.util");
const auth_validation_constants_1 = require("../auth/shared/auth-validation.constants");
const user_admin_select_1 = require("../utilisateurs/services/user-admin.select");
const profileUserSelect = {
    id: true,
    entrepriseId: true,
    siteId: true,
    horaireId: true,
    matricule: true,
    nom: true,
    prenom: true,
    email: true,
    telephone: true,
    role: true,
    statut: true,
    poste: true,
    salaireJournalier: true,
    dateEmbauche: true,
    photoUrl: true,
    derniereConnexion: true,
    createdAt: true,
    updatedAt: true,
    entreprise: {
        select: { id: true, raisonSociale: true, nomCommercial: true },
    },
    site: { select: { id: true, nom: true } },
};
let ProfileService = class ProfileService {
    prisma;
    auditActions;
    constructor(prisma, auditActions) {
        this.prisma = prisma;
        this.auditActions = auditActions;
    }
    async me(userId) {
        const [user, unreadNotificationsCount] = await Promise.all([
            this.prisma.utilisateur.findUnique({
                where: { id: userId },
                select: profileUserSelect,
            }),
            this.prisma.notification.count({
                where: { utilisateurId: userId, luAt: null },
            }),
        ]);
        if (!user || user.statut !== client_1.StatutCompte.ACTIF) {
            throw new common_1.NotFoundException();
        }
        return { ...user, unreadNotificationsCount };
    }
    async update(userId, dto, locale) {
        const nextEmail = dto.email?.trim().toLowerCase();
        if (nextEmail) {
            const existing = await this.prisma.utilisateur.findUnique({
                where: { email: nextEmail },
                select: { id: true },
            });
            if (existing && existing.id !== userId) {
                throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "emailAlreadyUsed")], undefined, locale));
            }
        }
        const updated = await this.prisma.utilisateur.update({
            where: { id: userId },
            data: {
                ...(dto.nom !== undefined ? { nom: dto.nom } : {}),
                ...(dto.prenom !== undefined ? { prenom: dto.prenom } : {}),
                ...(nextEmail ? { email: nextEmail } : {}),
                ...(dto.photoUrl !== undefined
                    ? { photoUrl: dto.photoUrl.trim() || null }
                    : {}),
            },
            select: profileUserSelect,
        });
        if (updated.statut !== client_1.StatutCompte.ACTIF) {
            throw new common_1.NotFoundException();
        }
        await this.auditActions.profileUpdated(userId, {
            updatedFields: Object.keys(dto).filter((key) => dto[key] !== undefined),
        });
        return updated;
    }
    async changePassword(userId, dto, locale) {
        const user = await this.prisma.utilisateur.findUnique({
            where: { id: userId },
            select: { role: true, statut: true, passwordHash: true },
        });
        if (!user || user.statut !== client_1.StatutCompte.ACTIF) {
            throw new common_1.NotFoundException();
        }
        const currentOk = user.passwordHash !== null &&
            (await bcrypt.compare(dto.currentPassword, user.passwordHash));
        if (!currentOk)
            throw this.invalid("currentPasswordInvalid", locale);
        if (!(0, auth_validation_constants_1.isAdminUserPasswordValid)(dto.newPassword, user.role)) {
            throw this.invalid((0, auth_validation_constants_1.isMobileRole)(user.role) ? "newPasswordInvalidMobile" : "newPasswordInvalid", locale);
        }
        if (dto.newPassword === dto.currentPassword) {
            throw this.invalid("passwordUnchanged", locale);
        }
        await this.prisma.utilisateur.update({
            where: { id: userId },
            data: {
                passwordHash: await bcrypt.hash(dto.newPassword, user_admin_select_1.USERS_BCRYPT_ROUNDS),
            },
        });
        await this.auditActions.authPasswordReset(userId, { source: "profil" });
    }
    invalid(key, locale) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key)], undefined, locale));
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_actions_service_1.AuditActionsService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map