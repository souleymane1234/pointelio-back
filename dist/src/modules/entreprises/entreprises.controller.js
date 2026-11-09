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
exports.EntreprisesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const create_entreprise_dto_1 = require("./dto/create-entreprise.dto");
const entreprise_response_dto_1 = require("./dto/entreprise-response.dto");
const entreprises_query_dto_1 = require("./dto/entreprises-query.dto");
const update_entreprise_dto_1 = require("./dto/update-entreprise.dto");
const entreprises_service_1 = require("./entreprises.service");
let EntreprisesController = class EntreprisesController {
    entreprises;
    constructor(entreprises) {
        this.entreprises = entreprises;
    }
    async findAll(req, query) {
        const locale = this.locale(req);
        const { data, pagination } = await this.entreprises.findAll(query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "entreprisesFetched"), locale);
    }
    async findOne(req, id) {
        const locale = this.locale(req);
        const data = await this.entreprises.findOne(id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "entrepriseFetched"), data, locale);
    }
    async create(req, dto) {
        const locale = this.locale(req);
        const data = await this.entreprises.create((0, request_context_1.requireUserId)(req), dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "entrepriseCreated"), data, locale);
    }
    async update(req, id, dto) {
        const locale = this.locale(req);
        const data = await this.entreprises.update((0, request_context_1.requireUserId)(req), id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "entrepriseUpdated"), data, locale);
    }
    suspendre(req, id, dto) {
        return this.cycle(req, id, "suspendre", dto, "entrepriseSuspended");
    }
    reactiver(req, id, dto) {
        return this.cycle(req, id, "reactiver", dto, "entrepriseReactivated");
    }
    cloturer(req, id, dto) {
        return this.cycle(req, id, "cloturer", dto, "entrepriseClosed");
    }
    async cycle(req, id, action, dto, messageKey) {
        const locale = this.locale(req);
        const data = await this.entreprises.changerStatut((0, request_context_1.requireUserId)(req), id, action, dto.motif, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, messageKey), data, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.EntreprisesController = EntreprisesController;
__decorate([
    (0, common_1.Get)(),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Lister les entreprises",
        status: 206,
        schema: entreprise_response_dto_1.EntreprisesPaginatedResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, entreprises_query_dto_1.EntreprisesQueryDto]),
    __metadata("design:returntype", Promise)
], EntreprisesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Détail d'une entreprise",
        schema: entreprise_response_dto_1.EntrepriseResponseSchemaDto,
        notFound: "Entreprise introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EntreprisesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Créer une entreprise",
        description: "Avec `admin` (nom, prénom, e-mail, mot de passe), crée le premier ADMIN_CLIENT, actif immédiatement. Aucun e-mail n'est envoyé : l'administrateur transmet lui-même les identifiants.",
        status: 201,
        schema: entreprise_response_dto_1.EntrepriseResponseSchemaDto,
        notFound: "Pack introuvable",
        invalid: "Données invalides, pack inactif ou e-mail admin déjà utilisé",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_entreprise_dto_1.CreateEntrepriseDto]),
    __metadata("design:returntype", Promise)
], EntreprisesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Modifier une entreprise",
        description: "Profil et notes internes. Statut : routes de cycle de vie ; pack et limites : abonnement.",
        schema: entreprise_response_dto_1.EntrepriseResponseSchemaDto,
        notFound: "Entreprise introuvable",
        invalid: "Données invalides ou corps vide",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_entreprise_dto_1.UpdateEntrepriseDto]),
    __metadata("design:returntype", Promise)
], EntreprisesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/suspendre"),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Suspendre une entreprise",
        description: "Ses comptes sont bloqués immédiatement (hors profil et déconnexion).",
        schema: entreprise_response_dto_1.EntrepriseResponseSchemaDto,
        notFound: "Entreprise introuvable",
        invalid: "Transition interdite depuis le statut actuel",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_entreprise_dto_1.MotifDto]),
    __metadata("design:returntype", void 0)
], EntreprisesController.prototype, "suspendre", null);
__decorate([
    (0, common_1.Post)(":id/reactiver"),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Réactiver une entreprise suspendue",
        schema: entreprise_response_dto_1.EntrepriseResponseSchemaDto,
        notFound: "Entreprise introuvable",
        invalid: "Transition interdite depuis le statut actuel",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_entreprise_dto_1.MotifDto]),
    __metadata("design:returntype", void 0)
], EntreprisesController.prototype, "reactiver", null);
__decorate([
    (0, common_1.Post)(":id/cloturer"),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Clôturer une entreprise (résiliation définitive)",
        schema: entreprise_response_dto_1.EntrepriseResponseSchemaDto,
        notFound: "Entreprise introuvable",
        invalid: "Entreprise déjà résiliée",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_entreprise_dto_1.MotifDto]),
    __metadata("design:returntype", void 0)
], EntreprisesController.prototype, "cloturer", null);
exports.EntreprisesController = EntreprisesController = __decorate([
    (0, swagger_1.ApiTags)("Admin — Entreprises"),
    (0, api_audience_decorator_1.ApiAudience)("plateforme"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.PLATFORM_ROLES),
    (0, common_1.Controller)("admin/entreprises"),
    __metadata("design:paramtypes", [entreprises_service_1.EntreprisesService])
], EntreprisesController);
//# sourceMappingURL=entreprises.controller.js.map