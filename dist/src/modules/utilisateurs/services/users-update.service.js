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
exports.UsersUpdateService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_validation_constants_1 = require("../../auth/shared/auth-validation.constants");
const i18n_1 = require("../../../common/i18n");
const role_groups_1 = require("../../../common/rbac/role-groups");
const response_util_1 = require("../../../common/utils/response.util");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const admin_users_cache_config_1 = require("../config/admin-users-cache.config");
const entitlements_service_1 = require("../../entitlements/entitlements.service");
const entitlements_util_1 = require("../../entitlements/entitlements.util");
const user_identifiers_service_1 = require("./user-identifiers.service");
const user_scope_service_1 = require("./user-scope.service");
const user_admin_select_1 = require("./user-admin.select");
let UsersUpdateService = class UsersUpdateService {
    prisma;
    scope;
    identifiers;
    entitlements;
    constructor(prisma, scope, identifiers, entitlements) {
        this.prisma = prisma;
        this.scope = scope;
        this.identifiers = identifiers;
        this.entitlements = entitlements;
    }
    async update(actor, id, dto, locale) {
        const existing = await this.prisma.utilisateur.findUnique({
            where: { id },
            select: {
                id: true,
                role: true,
                statut: true,
                entrepriseId: true,
                siteId: true,
                horaireId: true,
                salaireJournalier: true,
                email: true,
                telephone: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "userNotFound"));
        }
        this.scope.assertInScope(actor, existing, locale);
        this.scope.assertCanAssignRole(actor, existing.role);
        const hasAny = Object.keys(dto).some((k) => dto[k] !== undefined);
        if (!hasAny) {
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "userUpdateEmpty")], (0, i18n_1.translate)(locale, "validationSummary"), locale));
        }
        const nextRole = dto.role ?? existing.role;
        if (dto.role !== undefined) {
            this.scope.assertCanAssignRole(actor, dto.role);
        }
        const roleChangesScope = (0, role_groups_1.isPlatformRole)(nextRole) !== (0, role_groups_1.isPlatformRole)(existing.role);
        const nextEntrepriseId = dto.entrepriseId !== undefined || roleChangesScope
            ? this.scope.resolveEntrepriseId(actor, nextRole, dto.entrepriseId ?? existing.entrepriseId, locale)
            : existing.entrepriseId;
        const entrepriseChanged = nextEntrepriseId !== existing.entrepriseId;
        const nextSiteId = dto.siteId !== undefined
            ? dto.siteId
            : entrepriseChanged
                ? null
                : existing.siteId;
        const nextHoraireId = dto.horaireId !== undefined
            ? dto.horaireId
            : entrepriseChanged
                ? null
                : existing.horaireId;
        if (entrepriseChanged ||
            dto.siteId !== undefined ||
            dto.horaireId !== undefined) {
            await this.scope.assertRattachement(nextEntrepriseId, { siteId: nextSiteId, horaireId: nextHoraireId }, locale);
        }
        const nextStatut = dto.statut ?? existing.statut;
        const entreDansLeDecompte = (0, entitlements_util_1.isDecompteEmploye)({
            entrepriseId: nextEntrepriseId,
            role: nextRole,
            statut: nextStatut,
        }) &&
            (!(0, entitlements_util_1.isDecompteEmploye)(existing) || entrepriseChanged);
        if (entreDansLeDecompte && nextEntrepriseId !== null) {
            await this.entitlements.assertCanAddEmploye(nextEntrepriseId, locale);
        }
        if (nextRole === client_1.Role.EMPLOYE) {
            const salary = dto.salaireJournalier ?? existing.salaireJournalier;
            if (salary == null || salary < 1) {
                throw this.scope.invalid("salaireJournalierRequis", locale);
            }
        }
        const telephone = dto.telephone !== undefined && dto.telephone !== null
            ? this.identifiers.normalizeTelephone(dto.telephone, locale)
            : dto.telephone;
        const nextEmail = dto.email !== undefined ? dto.email : existing.email;
        const nextTelephone = telephone !== undefined ? telephone : existing.telephone;
        if (!nextEmail && !nextTelephone) {
            throw this.scope.invalid("userIdentifierRequired", locale);
        }
        await this.identifiers.assertAvailable({
            email: dto.email,
            telephone,
            matricule: dto.matricule,
            entrepriseId: nextEntrepriseId,
        }, locale, id);
        const data = {};
        if (dto.role !== undefined)
            data.role = dto.role;
        if (dto.statut !== undefined)
            data.statut = dto.statut;
        if (dto.nom !== undefined)
            data.nom = dto.nom;
        if (dto.prenom !== undefined)
            data.prenom = dto.prenom;
        if (dto.email !== undefined)
            data.email = dto.email;
        if (telephone !== undefined)
            data.telephone = telephone;
        if (entrepriseChanged)
            data.entrepriseId = nextEntrepriseId;
        if (nextSiteId !== existing.siteId)
            data.siteId = nextSiteId;
        if (nextHoraireId !== existing.horaireId)
            data.horaireId = nextHoraireId;
        if (dto.matricule !== undefined)
            data.matricule = dto.matricule;
        if (dto.poste !== undefined)
            data.poste = dto.poste;
        if (dto.salaireJournalier !== undefined) {
            data.salaireJournalier = dto.salaireJournalier;
        }
        if (dto.dateEmbauche !== undefined) {
            data.dateEmbauche = dto.dateEmbauche ? new Date(dto.dateEmbauche) : null;
        }
        if (dto.photoUrl !== undefined)
            data.photoUrl = dto.photoUrl;
        if (dto.password !== undefined) {
            if (!(0, auth_validation_constants_1.isAdminUserPasswordValid)(dto.password, nextRole)) {
                throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, auth_validation_constants_1.adminUserPasswordErrorMessage)(nextRole)], undefined, locale));
            }
            data.passwordHash = await bcrypt.hash(dto.password, user_admin_select_1.USERS_BCRYPT_ROUNDS);
        }
        const updated = await this.prisma.utilisateur.update({
            where: { id },
            data,
            select: user_admin_select_1.USER_ADMIN_SELECT,
        });
        (0, admin_users_cache_config_1.bumpAdminUsersCacheGeneration)();
        return {
            user: (0, user_admin_select_1.normalizeUserAdmin)(updated),
            previous: {
                role: existing.role,
                statut: existing.statut,
                entrepriseId: existing.entrepriseId,
            },
        };
    }
};
exports.UsersUpdateService = UsersUpdateService;
exports.UsersUpdateService = UsersUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_scope_service_1.UserScopeService,
        user_identifiers_service_1.UserIdentifiersService,
        entitlements_service_1.EntitlementsService])
], UsersUpdateService);
//# sourceMappingURL=users-update.service.js.map