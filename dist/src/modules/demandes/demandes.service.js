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
var DemandesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const pagination_util_1 = require("../../common/utils/pagination.util");
const response_util_1 = require("../../common/utils/response.util");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const audit_actions_service_1 = require("../audit/recorder/services/audit-actions.service");
const audit_actions_constants_1 = require("../audit/shared/audit-actions.constants");
const notification_types_constants_1 = require("../notifications/shared/notification-types.constants");
const notifications_service_1 = require("../notifications/notifications.service");
const demande_jours_util_1 = require("./demande-jours.util");
const PERSONNE_SELECT = {
    id: true,
    nom: true,
    prenom: true,
    matricule: true,
};
const DEMANDE_SELECT = {
    id: true,
    entrepriseId: true,
    employeId: true,
    type: true,
    dateDebut: true,
    dateFin: true,
    nbJours: true,
    commentaire: true,
    justificatifUrl: true,
    statut: true,
    decideurId: true,
    decisionMotif: true,
    decideAt: true,
    createdAt: true,
    employe: { select: PERSONNE_SELECT },
    decideur: { select: PERSONNE_SELECT },
};
const DECIDEURS = [...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER];
function normalize(row) {
    return {
        ...row,
        dateDebut: (0, demande_jours_util_1.dateToCivil)(row.dateDebut),
        dateFin: (0, demande_jours_util_1.dateToCivil)(row.dateFin),
    };
}
function joursTravailOf(value) {
    return Array.isArray(value)
        ? value.filter((j) => typeof j === "number")
        : [];
}
function canDecide(role) {
    return DECIDEURS.includes(role);
}
let DemandesService = DemandesService_1 = class DemandesService {
    prisma;
    auditActions;
    notifications;
    logger = new common_1.Logger(DemandesService_1.name);
    constructor(prisma, auditActions, notifications) {
        this.prisma = prisma;
        this.auditActions = auditActions;
        this.notifications = notifications;
    }
    async findAll(user, entrepriseId, query) {
        const where = await this.scopeWhere(user, entrepriseId, query);
        const totalItems = await this.prisma.tenant.demande.count({ where });
        const { skip, perPage, pagination } = (0, pagination_util_1.buildPaginationQuery)(totalItems, query.page, query.per_page);
        const rows = await this.prisma.tenant.demande.findMany({
            where,
            select: DEMANDE_SELECT,
            orderBy: [{ createdAt: "desc" }],
            skip,
            take: perPage,
        });
        return { data: rows.map(normalize), pagination };
    }
    async findOne(user, entrepriseId, id, locale) {
        const row = await this.prisma.tenant.demande.findFirst({
            where: { id, entrepriseId },
            select: DEMANDE_SELECT,
        });
        if (!row) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "demandeNotFound"));
        }
        await this.assertCanRead(user, entrepriseId, row);
        return normalize(row);
    }
    async create(user, entrepriseId, dto, locale) {
        const employeId = await this.resolveEmployeId(user, entrepriseId, dto.employeId, locale);
        const { dateDebut, dateFin } = this.assertPeriode(dto.dateDebut, dto.dateFin, locale);
        this.assertJustificatif(dto.type, dto.justificatifUrl, locale);
        await this.assertPasDeChevauchement(entrepriseId, employeId, dateDebut, dateFin, locale);
        const nbJours = await this.nbJoursOuvres(employeId, entrepriseId, dateDebut, dateFin, locale);
        const created = await this.prisma.tenant.demande.create({
            data: {
                entrepriseId,
                employeId,
                type: dto.type,
                dateDebut: (0, demande_jours_util_1.civilToDate)(dateDebut),
                dateFin: (0, demande_jours_util_1.civilToDate)(dateFin),
                nbJours,
                commentaire: dto.commentaire?.trim() || null,
                justificatifUrl: dto.justificatifUrl?.trim() || null,
            },
            select: DEMANDE_SELECT,
        });
        await this.audit(user.id, audit_actions_constants_1.AUDIT_ACTIONS.DEMANDE_CREEE, created, {
            type: created.type,
            dateDebut,
            dateFin,
        });
        await this.notifyDecideurs(entrepriseId, created, locale);
        return normalize(created);
    }
    async update(user, entrepriseId, id, dto, locale) {
        if (dto.type === undefined &&
            dto.dateDebut === undefined &&
            dto.dateFin === undefined &&
            dto.commentaire === undefined &&
            dto.justificatifUrl === undefined) {
            throw this.invalid("demandeUpdateEmpty", locale);
        }
        const current = await this.requireEnAttente(user, entrepriseId, id, locale);
        this.assertOwnerOrAdmin(user, current);
        const type = dto.type ?? current.type;
        const dateDebut = dto.dateDebut ?? (0, demande_jours_util_1.dateToCivil)(current.dateDebut);
        const dateFin = dto.dateFin ?? (0, demande_jours_util_1.dateToCivil)(current.dateFin);
        this.assertPeriode(dateDebut, dateFin, locale);
        const justificatif = dto.justificatifUrl !== undefined
            ? dto.justificatifUrl
            : current.justificatifUrl;
        this.assertJustificatif(type, justificatif, locale);
        await this.assertPasDeChevauchement(entrepriseId, current.employeId, dateDebut, dateFin, locale, current.id);
        const nbJours = await this.nbJoursOuvres(current.employeId, entrepriseId, dateDebut, dateFin, locale);
        const updated = await this.prisma.tenant.demande.update({
            where: { id, entrepriseId },
            data: {
                type,
                dateDebut: (0, demande_jours_util_1.civilToDate)(dateDebut),
                dateFin: (0, demande_jours_util_1.civilToDate)(dateFin),
                nbJours,
                ...(dto.commentaire !== undefined
                    ? { commentaire: dto.commentaire?.trim() || null }
                    : {}),
                ...(dto.justificatifUrl !== undefined
                    ? { justificatifUrl: dto.justificatifUrl?.trim() || null }
                    : {}),
            },
            select: DEMANDE_SELECT,
        });
        await this.audit(user.id, audit_actions_constants_1.AUDIT_ACTIONS.DEMANDE_MODIFIEE, updated);
        return normalize(updated);
    }
    async decider(user, entrepriseId, id, dto, locale) {
        if (!canDecide(user.role)) {
            throw new common_1.ForbiddenException();
        }
        const current = await this.requireEnAttente(user, entrepriseId, id, locale);
        if (current.employeId === user.id) {
            throw this.invalid("demandeAutoDecisionInterdite", locale);
        }
        if (dto.statut === client_1.StatutDemande.REFUSEE && !dto.decisionMotif?.trim()) {
            throw this.invalid("demandeMotifRequis", locale);
        }
        const updated = await this.prisma.tenant.demande.update({
            where: { id, entrepriseId },
            data: {
                statut: dto.statut,
                decideurId: user.id,
                decisionMotif: dto.decisionMotif?.trim() || null,
                decideAt: new Date(),
            },
            select: DEMANDE_SELECT,
        });
        await this.audit(user.id, audit_actions_constants_1.AUDIT_ACTIONS.DEMANDE_DECIDEE, updated, {
            statut: dto.statut,
        });
        await this.notifyEmploye(updated, locale);
        return normalize(updated);
    }
    async annuler(user, entrepriseId, id, locale) {
        const current = await this.prisma.tenant.demande.findFirst({
            where: { id, entrepriseId },
            select: DEMANDE_SELECT,
        });
        if (!current) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "demandeNotFound"));
        }
        await this.assertCanRead(user, entrepriseId, current);
        const isAdmin = canDecide(user.role);
        const isOwner = current.employeId === user.id;
        if (current.statut === client_1.StatutDemande.EN_ATTENTE) {
            if (!isOwner && !isAdmin)
                throw new common_1.ForbiddenException();
        }
        else if (current.statut === client_1.StatutDemande.APPROUVEE) {
            if (!isAdmin)
                throw new common_1.ForbiddenException();
            if ((0, demande_jours_util_1.dateToCivil)(current.dateDebut) <= (0, demande_jours_util_1.dateToCivil)(new Date())) {
                throw this.invalid("demandeDejaCommencee", locale);
            }
        }
        else {
            throw this.invalid("demandeNonModifiable", locale);
        }
        const updated = await this.prisma.tenant.demande.update({
            where: { id, entrepriseId },
            data: {
                statut: client_1.StatutDemande.ANNULEE,
                decideurId: user.id,
                decideAt: new Date(),
                decisionMotif: isOwner ? null : current.decisionMotif,
            },
            select: DEMANDE_SELECT,
        });
        await this.audit(user.id, audit_actions_constants_1.AUDIT_ACTIONS.DEMANDE_ANNULEE, updated);
        if (isAdmin && !isOwner) {
            await this.notifyEmploye(updated, locale);
        }
        else {
            await this.notifyDecideurs(entrepriseId, updated, locale);
        }
        return normalize(updated);
    }
    async requireEnAttente(user, entrepriseId, id, locale) {
        const row = await this.prisma.tenant.demande.findFirst({
            where: { id, entrepriseId },
            select: DEMANDE_SELECT,
        });
        if (!row) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "demandeNotFound"));
        }
        await this.assertCanRead(user, entrepriseId, row);
        if (row.statut !== client_1.StatutDemande.EN_ATTENTE) {
            throw this.invalid("demandeNonModifiable", locale);
        }
        return row;
    }
    assertOwnerOrAdmin(user, row) {
        if (row.employeId === user.id || canDecide(user.role))
            return;
        throw new common_1.ForbiddenException();
    }
    async assertCanRead(user, entrepriseId, row) {
        if (row.employeId === user.id || canDecide(user.role))
            return;
        if (user.role === client_1.Role.SURVEILLANT) {
            const ok = await this.sameSite(user.id, row.employeId, entrepriseId);
            if (ok)
                return;
        }
        throw new common_1.ForbiddenException();
    }
    async sameSite(actorId, employeId, entrepriseId) {
        const [actor, employe] = await Promise.all([
            this.prisma.tenant.utilisateur.findFirst({
                where: { id: actorId, entrepriseId },
                select: { siteId: true },
            }),
            this.prisma.tenant.utilisateur.findFirst({
                where: { id: employeId, entrepriseId },
                select: { siteId: true },
            }),
        ]);
        return Boolean(actor?.siteId && actor.siteId === employe?.siteId);
    }
    async resolveEmployeId(user, entrepriseId, requested, locale) {
        if (!requested || requested === user.id)
            return user.id;
        if (!canDecide(user.role)) {
            throw new common_1.ForbiddenException();
        }
        const employe = await this.prisma.tenant.utilisateur.findFirst({
            where: { id: requested, entrepriseId },
            select: { id: true, statut: true, role: true },
        });
        if (!employe ||
            employe.statut !== client_1.StatutCompte.ACTIF ||
            employe.role === client_1.Role.SUPER_ADMIN ||
            employe.role === client_1.Role.SUPPORT) {
            throw this.invalid("demandeEmployeInvalide", locale);
        }
        return employe.id;
    }
    assertPeriode(dateDebut, dateFin, locale) {
        if (!(0, demande_jours_util_1.parseCivilDate)(dateDebut) || !(0, demande_jours_util_1.parseCivilDate)(dateFin)) {
            throw this.invalid("demandeDateInvalide", locale);
        }
        if (dateDebut > dateFin ||
            (0, demande_jours_util_1.spanDays)(dateDebut, dateFin) > demande_jours_util_1.DEMANDE_MAX_SPAN_DAYS) {
            throw this.invalid("demandePeriodeInvalide", locale);
        }
        return { dateDebut, dateFin };
    }
    assertJustificatif(type, justificatifUrl, locale) {
        if (type === client_1.TypeDemande.MALADIE && !justificatifUrl?.trim()) {
            throw this.invalid("demandeJustificatifRequis", locale);
        }
    }
    async assertPasDeChevauchement(entrepriseId, employeId, dateDebut, dateFin, locale, excludeId) {
        const overlap = await this.prisma.tenant.demande.findFirst({
            where: {
                entrepriseId,
                employeId,
                statut: { in: [client_1.StatutDemande.EN_ATTENTE, client_1.StatutDemande.APPROUVEE] },
                ...(excludeId ? { id: { not: excludeId } } : {}),
                dateDebut: { lte: (0, demande_jours_util_1.civilToDate)(dateFin) },
                dateFin: { gte: (0, demande_jours_util_1.civilToDate)(dateDebut) },
            },
            select: { id: true },
        });
        if (overlap) {
            throw this.invalid("demandeChevauchement", locale);
        }
    }
    async nbJoursOuvres(employeId, entrepriseId, dateDebut, dateFin, locale) {
        const employe = await this.prisma.tenant.utilisateur.findFirst({
            where: { id: employeId, entrepriseId },
            select: { horaire: { select: { joursTravail: true } } },
        });
        const nbJours = (0, demande_jours_util_1.countWorkingDays)(dateDebut, dateFin, joursTravailOf(employe?.horaire?.joursTravail));
        if (nbJours <= 0) {
            throw this.invalid("demandeAucunJourOuvre", locale);
        }
        return nbJours;
    }
    async scopeWhere(user, entrepriseId, query) {
        const where = { entrepriseId };
        if (user.role === client_1.Role.EMPLOYE) {
            where.employeId = user.id;
        }
        else if (user.role === client_1.Role.SURVEILLANT) {
            const actor = await this.prisma.tenant.utilisateur.findFirst({
                where: { id: user.id, entrepriseId },
                select: { siteId: true },
            });
            where.OR = [
                { employeId: user.id },
                { employe: { siteId: actor?.siteId ?? -1 } },
            ];
        }
        else if (query.employeId) {
            where.employeId = query.employeId;
        }
        if (query.statut)
            where.statut = query.statut;
        if (query.type)
            where.type = query.type;
        if (query.dateDebut || query.dateFin) {
            const debut = query.dateDebut
                ? (0, demande_jours_util_1.dateToCivil)(query.dateDebut)
                : "0001-01-01";
            const fin = query.dateFin ? (0, demande_jours_util_1.dateToCivil)(query.dateFin) : "9999-12-31";
            if ((0, demande_jours_util_1.parseCivilDate)(debut) && (0, demande_jours_util_1.parseCivilDate)(fin)) {
                where.AND = [
                    { dateDebut: { lte: (0, demande_jours_util_1.civilToDate)(fin) } },
                    { dateFin: { gte: (0, demande_jours_util_1.civilToDate)(debut) } },
                ];
            }
        }
        return where;
    }
    async notifyDecideurs(entrepriseId, demande, locale) {
        const decideurs = await this.prisma.tenant.utilisateur.findMany({
            where: {
                entrepriseId,
                statut: client_1.StatutCompte.ACTIF,
                role: { in: [...DECIDEURS] },
                id: { not: demande.employeId },
            },
            select: { id: true },
        });
        await this.notifySafe(decideurs.map((d) => d.id), {
            titre: (0, i18n_1.translate)(locale, "demandeNotifCreatedTitle"),
            message: (0, i18n_1.translate)(locale, "demandeNotifCreatedMessage", {
                employe: `${demande.employe.prenom} ${demande.employe.nom}`.trim(),
                type: demande.type,
                debut: (0, demande_jours_util_1.dateToCivil)(demande.dateDebut),
                fin: (0, demande_jours_util_1.dateToCivil)(demande.dateFin),
            }),
            type: notification_types_constants_1.NOTIFICATION_TYPES.DEMANDE,
        });
    }
    async notifyEmploye(demande, locale) {
        const key = demande.statut === client_1.StatutDemande.APPROUVEE
            ? "demandeNotifApprouveeMessage"
            : demande.statut === client_1.StatutDemande.REFUSEE
                ? "demandeNotifRefuseeMessage"
                : "demandeNotifAnnuleeMessage";
        await this.notifySafe([demande.employeId], {
            titre: (0, i18n_1.translate)(locale, "demandeNotifDecidedTitle"),
            message: (0, i18n_1.translate)(locale, key, {
                type: demande.type,
                debut: (0, demande_jours_util_1.dateToCivil)(demande.dateDebut),
                fin: (0, demande_jours_util_1.dateToCivil)(demande.dateFin),
            }),
            type: notification_types_constants_1.NOTIFICATION_TYPES.DEMANDE,
        });
    }
    async notifySafe(userIds, notification) {
        if (userIds.length === 0)
            return;
        try {
            await this.notifications.notifyUsers(userIds, notification);
        }
        catch (error) {
            this.logger.warn(`Notification demande impossible: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    audit(acteurId, action, demande, details) {
        return this.auditActions.domainAction({
            acteurId,
            action,
            objet: audit_actions_constants_1.AUDIT_OBJETS.DEMANDE,
            objetId: demande.id,
            entrepriseId: demande.entrepriseId,
            details,
        });
    }
    invalid(key, locale) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key)], undefined, locale));
    }
};
exports.DemandesService = DemandesService;
exports.DemandesService = DemandesService = DemandesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_actions_service_1.AuditActionsService,
        notifications_service_1.NotificationsService])
], DemandesService);
//# sourceMappingURL=demandes.service.js.map