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
exports.UsersCreateService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const admin_users_cache_config_1 = require("../config/admin-users-cache.config");
const entitlements_service_1 = require("../../entitlements/entitlements.service");
const entitlements_util_1 = require("../../entitlements/entitlements.util");
const user_identifiers_service_1 = require("./user-identifiers.service");
const user_scope_service_1 = require("./user-scope.service");
const user_admin_select_1 = require("./user-admin.select");
let UsersCreateService = class UsersCreateService {
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
    async create(actor, dto, locale) {
        this.scope.assertCanAssignRole(actor, dto.role);
        const entrepriseId = this.scope.resolveEntrepriseId(actor, dto.role, dto.entrepriseId, locale);
        await this.scope.assertRattachement(entrepriseId, { siteId: dto.siteId, horaireId: dto.horaireId }, locale);
        const telephone = this.identifiers.normalizeTelephone(dto.telephone, locale);
        await this.identifiers.assertAvailable({ email: dto.email, telephone, matricule: dto.matricule, entrepriseId }, locale);
        if (dto.role === client_1.Role.EMPLOYE &&
            (dto.salaireJournalier === undefined || dto.salaireJournalier < 1)) {
            throw this.scope.invalid("salaireJournalierRequis", locale);
        }
        const passwordHash = await bcrypt.hash(dto.password, user_admin_select_1.USERS_BCRYPT_ROUNDS);
        const statut = dto.statut ?? client_1.StatutCompte.ACTIF;
        if (entrepriseId !== null &&
            (0, entitlements_util_1.isDecompteEmploye)({ entrepriseId, role: dto.role, statut })) {
            await this.entitlements.assertCanAddEmploye(entrepriseId, locale);
        }
        const created = await this.prisma.utilisateur.create({
            data: {
                entrepriseId,
                siteId: dto.siteId,
                horaireId: dto.horaireId,
                matricule: dto.matricule,
                nom: dto.nom,
                prenom: dto.prenom,
                email: dto.email,
                telephone,
                passwordHash,
                role: dto.role,
                statut,
                poste: dto.poste,
                salaireJournalier: dto.salaireJournalier,
                dateEmbauche: dto.dateEmbauche ? new Date(dto.dateEmbauche) : undefined,
                photoUrl: dto.photoUrl,
            },
            select: user_admin_select_1.USER_ADMIN_SELECT,
        });
        (0, admin_users_cache_config_1.bumpAdminUsersCacheGeneration)();
        return (0, user_admin_select_1.normalizeUserAdmin)(created);
    }
};
exports.UsersCreateService = UsersCreateService;
exports.UsersCreateService = UsersCreateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_scope_service_1.UserScopeService,
        user_identifiers_service_1.UserIdentifiersService,
        entitlements_service_1.EntitlementsService])
], UsersCreateService);
//# sourceMappingURL=users-create.service.js.map