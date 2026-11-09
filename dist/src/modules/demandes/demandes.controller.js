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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const pack_modules_constants_1 = require("../../common/constants/pack-modules.constants");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const module_requis_decorator_1 = require("../../common/decorators/module-requis.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const demandes_service_1 = require("./demandes.service");
const demande_dto_1 = require("./dto/demande.dto");
const demande_response_dto_1 = require("./dto/demande-response.dto");
let DemandesController = class DemandesController {
    demandes;
    constructor(demandes) {
        this.demandes = demandes;
    }
    async findAll(req, query) {
        const locale = this.locale(req);
        const { data, pagination } = await this.demandes.findAll((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "demandesFetched"), locale);
    }
    async create(req, dto) {
        const locale = this.locale(req);
        const data = await this.demandes.create((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "demandeCreated"), data, locale);
    }
    async findOne(req, id) {
        const locale = this.locale(req);
        const data = await this.demandes.findOne((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "demandeFetched"), data, locale);
    }
    async update(req, id, dto) {
        const locale = this.locale(req);
        const data = await this.demandes.update((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "demandeUpdated"), data, locale);
    }
    async decider(req, id, dto) {
        const locale = this.locale(req);
        const data = await this.demandes.decider((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, dto, locale);
        const key = dto.statut === client_1.StatutDemande.APPROUVEE
            ? "demandeApprouvee"
            : "demandeRefusee";
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, key), data, locale);
    }
    async annuler(req, id) {
        const locale = this.locale(req);
        const data = await this.demandes.annuler((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "demandeAnnulee"), data, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.DemandesController = DemandesController;
__decorate([
    (0, common_1.Get)(),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Lister les demandes d'absence / congé",
        audience: ["mobile", "employeur"],
        description: "Employé : les siennes. Surveillant : son site. RH / manager / admin : l'entreprise.",
        status: 206,
        schema: demande_response_dto_1.DemandesPaginatedResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, demande_dto_1.DemandesQueryDto]),
    __metadata("design:returntype", Promise)
], DemandesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Créer une demande",
        audience: "mobile",
        description: "nbJours calculé selon l'horaire. Maladie : justificatif obligatoire. Chevauchement refusé.",
        status: 201,
        schema: demande_response_dto_1.DemandeResponseSchemaDto,
        invalid: "Période invalide, chevauchement, ou justificatif manquant",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, demande_dto_1.CreateDemandeDto]),
    __metadata("design:returntype", Promise)
], DemandesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Détail d'une demande",
        audience: ["mobile", "employeur"],
        schema: demande_response_dto_1.DemandeResponseSchemaDto,
        notFound: "Demande introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DemandesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Modifier une demande en attente",
        audience: "mobile",
        schema: demande_response_dto_1.DemandeResponseSchemaDto,
        notFound: "Demande introuvable",
        invalid: "Demande non modifiable, chevauchement ou données invalides",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, demande_dto_1.UpdateDemandeDto]),
    __metadata("design:returntype", Promise)
], DemandesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/decider"),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Approuver ou refuser une demande",
        audience: "employeur",
        description: "Motif obligatoire en cas de refus. Impossible de statuer sur sa propre demande.",
        schema: demande_response_dto_1.DemandeResponseSchemaDto,
        notFound: "Demande introuvable",
        invalid: "Demande déjà traitée, motif manquant, ou auto-décision",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, demande_dto_1.DeciderDemandeDto]),
    __metadata("design:returntype", Promise)
], DemandesController.prototype, "decider", null);
__decorate([
    (0, common_1.Post)(":id/annuler"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Annuler une demande",
        audience: ["mobile", "employeur"],
        description: "L'employé annule une demande en attente. RH / manager peuvent aussi annuler une demande approuvée non commencée.",
        schema: demande_response_dto_1.DemandeResponseSchemaDto,
        notFound: "Demande introuvable",
        invalid: "Demande déjà commencée ou dans un statut non annulable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DemandesController.prototype, "annuler", null);
exports.DemandesController = DemandesController = __decorate([
    (0, swagger_1.ApiTags)("Demandes"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, module_requis_decorator_1.ModuleRequis)(pack_modules_constants_1.PACK_MODULES.CONGES),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER, client_1.Role.SURVEILLANT, client_1.Role.EMPLOYE),
    (0, common_1.Controller)("demandes"),
    __metadata("design:paramtypes", [demandes_service_1.DemandesService])
], DemandesController);
//# sourceMappingURL=demandes.controller.js.map