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
exports.EntreprisesService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const pagination_util_1 = require("../../common/utils/pagination.util");
const response_util_1 = require("../../common/utils/response.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const user_admin_select_1 = require("../utilisateurs/services/user-admin.select");
const entreprise_select_1 = require("./constants/entreprise-select");
const entreprise_cycle_util_1 = require("./entreprise-cycle.util");
const CYCLE_AUDIT = {
    suspendre: audit_actions_constants_1.AUDIT_ACTIONS.ENTREPRISE_SUSPENDUE,
    reactiver: audit_actions_constants_1.AUDIT_ACTIONS.ENTREPRISE_REACTIVEE,
    cloturer: audit_actions_constants_1.AUDIT_ACTIONS.ENTREPRISE_CLOTUREE,
};
const DAY_MS = 86_400_000;
let EntreprisesService = class EntreprisesService {
    prisma;
    auditActions;
    constructor(prisma, auditActions) {
        this.prisma = prisma;
        this.auditActions = auditActions;
    }
    async findAll(query) {
        const where = {};
        if (query.statut)
            where.statut = query.statut;
        if (query.packId)
            where.packId = query.packId;
        if (query.search) {
            where.OR = [
                { raisonSociale: { contains: query.search } },
                { nomCommercial: { contains: query.search } },
                { contactEmail: { contains: query.search } },
            ];
        }
        const totalItems = await this.prisma.entreprise.count({ where });
        const { skip, perPage, pagination } = (0, pagination_util_1.buildPaginationQuery)(totalItems, query.page, query.per_page);
        const rows = await this.prisma.entreprise.findMany({
            where,
            select: entreprise_select_1.ENTREPRISE_ADMIN_SELECT,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            skip,
            take: perPage,
        });
        return { data: rows.map(entreprise_select_1.normalizeEntrepriseAdmin), pagination };
    }
    async findOne(id, locale) {
        const entreprise = await this.prisma.entreprise.findUnique({
            where: { id },
            select: entreprise_select_1.ENTREPRISE_ADMIN_SELECT,
        });
        if (!entreprise) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "entrepriseNotFound"));
        }
        return (0, entreprise_select_1.normalizeEntrepriseAdmin)(entreprise);
    }
    async create(acteurId, dto, locale) {
        const pack = await this.prisma.pack.findUnique({
            where: { id: dto.packId },
            select: { id: true, actif: true, essaiJours: true },
        });
        if (!pack)
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "packNotFound"));
        if (!pack.actif)
            throw this.invalid("packInactif", locale);
        const { admin, dateEcheance, ...fields } = dto;
        if (admin) {
            const taken = await this.prisma.utilisateur.findUnique({
                where: { email: admin.email },
                select: { id: true },
            });
            if (taken)
                throw this.invalid("emailAlreadyUsed", locale);
        }
        const statut = dto.statut ?? client_1.StatutEntreprise.ESSAI;
        const now = new Date();
        const echeance = dateEcheance
            ? new Date(dateEcheance)
            : statut === client_1.StatutEntreprise.ESSAI && pack.essaiJours > 0
                ? new Date(now.getTime() + pack.essaiJours * DAY_MS)
                : null;
        const adminPasswordHash = admin
            ? await bcrypt.hash(admin.password, user_admin_select_1.USERS_BCRYPT_ROUNDS)
            : null;
        const { entreprise, adminUser } = await this.prisma.$transaction(async (tx) => {
            const created = await tx.entreprise.create({
                data: {
                    ...fields,
                    statut,
                    dateDemarrage: now,
                    dateEcheance: echeance,
                    profilComplete: (0, entreprise_select_1.isProfilComplete)({
                        secteur: fields.secteur ?? null,
                        ville: fields.ville ?? null,
                        adresse: fields.adresse ?? null,
                        contactNom: fields.contactNom ?? null,
                        contactEmail: fields.contactEmail ?? null,
                        contactTel: fields.contactTel ?? null,
                    }),
                },
                select: { id: true },
            });
            const user = admin
                ? await tx.utilisateur.create({
                    data: {
                        nom: admin.nom,
                        prenom: admin.prenom,
                        email: admin.email,
                        passwordHash: adminPasswordHash,
                        entrepriseId: created.id,
                        role: client_1.Role.ADMIN_CLIENT,
                        statut: client_1.StatutCompte.ACTIF,
                    },
                    select: { id: true },
                })
                : null;
            return { entreprise: created, adminUser: user };
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.ENTREPRISE_CREEE, entreprise.id, {
            packId: pack.id,
            statut,
            adminCree: Boolean(adminUser),
        });
        return this.findOne(entreprise.id, locale);
    }
    async update(acteurId, id, dto, locale) {
        if (Object.values(dto).every((value) => value === undefined)) {
            throw this.invalid("entrepriseUpdateEmpty", locale);
        }
        const current = await this.findOne(id, locale);
        const merged = { ...current, ...dto };
        await this.prisma.entreprise.update({
            where: { id },
            data: { ...dto, profilComplete: (0, entreprise_select_1.isProfilComplete)(merged) },
        });
        await this.audit(acteurId, audit_actions_constants_1.AUDIT_ACTIONS.ENTREPRISE_MODIFIEE, id, {
            updatedFields: Object.keys(dto),
        });
        return this.findOne(id, locale);
    }
    async changerStatut(acteurId, id, action, motif, locale) {
        const current = await this.findOne(id, locale);
        const statut = (0, entreprise_cycle_util_1.nextStatut)(action, current.statut);
        if (!statut) {
            throw this.invalid("entrepriseTransitionInvalide", locale, {
                statut: current.statut,
            });
        }
        await this.prisma.entreprise.update({ where: { id }, data: { statut } });
        await this.audit(acteurId, CYCLE_AUDIT[action], id, {
            from: current.statut,
            to: statut,
            ...(motif ? { motif } : {}),
        });
        return this.findOne(id, locale);
    }
    audit(acteurId, action, entrepriseId, details) {
        return this.auditActions.domainAction({
            acteurId,
            action,
            objet: audit_actions_constants_1.AUDIT_OBJETS.ENTREPRISE,
            objetId: entrepriseId,
            entrepriseId,
            details,
        });
    }
    invalid(key, locale, params) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key, params)], undefined, locale));
    }
};
exports.EntreprisesService = EntreprisesService;
exports.EntreprisesService = EntreprisesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_actions_service_1.AuditActionsService])
], EntreprisesService);
//# sourceMappingURL=entreprises.service.js.map