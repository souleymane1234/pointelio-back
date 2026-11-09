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
exports.UtilisateursService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_actions_service_1 = require("../../audit/recorder/services/audit-actions.service");
const i18n_1 = require("../../../common/i18n");
const users_create_service_1 = require("./users-create.service");
const users_list_service_1 = require("./users-list.service");
const users_update_service_1 = require("./users-update.service");
let UtilisateursService = class UtilisateursService {
    list;
    createSvc;
    updateSvc;
    auditActions;
    constructor(list, createSvc, updateSvc, auditActions) {
        this.list = list;
        this.createSvc = createSvc;
        this.updateSvc = updateSvc;
        this.auditActions = auditActions;
    }
    findAll(actor, query) {
        return this.list.findAll(actor, query);
    }
    findOne(actor, id, locale) {
        return this.list.findOne(actor, id, locale);
    }
    async create(actor, dto, locale) {
        const created = await this.createSvc.create(actor, dto, locale);
        await this.auditActions.adminUserCreated(actor.id, created, {
            role: created.role,
            statut: created.statut,
        });
        return created;
    }
    async update(actor, id, dto, locale) {
        const { user, previous } = await this.updateSvc.update(actor, id, dto, locale);
        if (user.role !== previous.role) {
            await this.auditActions.adminRoleChanged(actor.id, user, {
                from: previous.role,
                to: user.role,
            });
        }
        if (user.statut !== previous.statut) {
            if (user.statut === client_1.StatutCompte.SUSPENDU) {
                await this.auditActions.adminUserSuspended(actor.id, user, dto.suspensionReason ? { reason: dto.suspensionReason } : undefined);
            }
            else if (user.statut === client_1.StatutCompte.ACTIF) {
                await this.auditActions.adminUserRestored(actor.id, user, {
                    from: previous.statut,
                });
            }
            else if (user.statut === client_1.StatutCompte.DESACTIVE) {
                await this.auditActions.adminUserFired(actor.id, user, dto.suspensionReason ? { reason: dto.suspensionReason } : undefined);
            }
        }
        const otherFields = Object.entries(dto)
            .filter(([key, value]) => value !== undefined &&
            !["role", "statut", "suspensionReason", "password"].includes(key))
            .map(([key]) => key);
        if (otherFields.length > 0 || dto.password !== undefined) {
            await this.auditActions.adminUserUpdated(actor.id, user, {
                updatedFields: otherFields,
                passwordChanged: dto.password !== undefined,
            });
        }
        return user;
    }
    async reaffecter(actor, id, dto, locale) {
        this.assertNotSelf(actor, id, locale);
        const current = await this.list.findOne(actor, id, locale);
        if (current.statut === client_1.StatutCompte.DESACTIVE) {
            throw new common_1.UnprocessableEntityException((0, i18n_1.translate)(locale, "userAlreadyInactive"));
        }
        const { user } = await this.updateSvc.update(actor, id, {
            siteId: dto.siteId,
            ...(dto.horaireId !== undefined ? { horaireId: dto.horaireId } : {}),
        }, locale);
        await this.auditActions.adminUserReassigned(actor.id, user, {
            fromSiteId: current.siteId,
            toSiteId: dto.siteId,
            horaireId: dto.horaireId,
        });
        return user;
    }
    async suspendre(actor, id, dto, locale) {
        this.assertNotSelf(actor, id, locale);
        const current = await this.list.findOne(actor, id, locale);
        if (current.statut === client_1.StatutCompte.DESACTIVE) {
            throw new common_1.UnprocessableEntityException((0, i18n_1.translate)(locale, "userAlreadyInactive"));
        }
        return this.update(actor, id, { statut: client_1.StatutCompte.SUSPENDU, suspensionReason: dto.motif }, locale);
    }
    async reactiver(actor, id, locale) {
        this.assertNotSelf(actor, id, locale);
        const current = await this.list.findOne(actor, id, locale);
        if (current.statut === client_1.StatutCompte.DESACTIVE) {
            throw new common_1.UnprocessableEntityException((0, i18n_1.translate)(locale, "userCannotRestoreFired"));
        }
        return this.update(actor, id, { statut: client_1.StatutCompte.ACTIF }, locale);
    }
    async renvoyer(actor, id, dto, locale) {
        this.assertNotSelf(actor, id, locale);
        const current = await this.list.findOne(actor, id, locale);
        if (current.statut === client_1.StatutCompte.DESACTIVE) {
            throw new common_1.UnprocessableEntityException((0, i18n_1.translate)(locale, "userAlreadyInactive"));
        }
        return this.update(actor, id, { statut: client_1.StatutCompte.DESACTIVE, suspensionReason: dto.motif }, locale);
    }
    assertNotSelf(actor, id, locale) {
        if (actor.id === id) {
            throw new common_1.ForbiddenException((0, i18n_1.translate)(locale, "userCannotActOnSelf"));
        }
    }
};
exports.UtilisateursService = UtilisateursService;
exports.UtilisateursService = UtilisateursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_list_service_1.UsersListService,
        users_create_service_1.UsersCreateService,
        users_update_service_1.UsersUpdateService,
        audit_actions_service_1.AuditActionsService])
], UtilisateursService);
//# sourceMappingURL=utilisateurs.service.js.map