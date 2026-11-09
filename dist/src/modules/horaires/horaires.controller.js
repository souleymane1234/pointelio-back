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
exports.HorairesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const response_schemas_dto_1 = require("../../common/dto/response-schemas.dto");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const horaire_dto_1 = require("./dto/horaire.dto");
const horaire_response_dto_1 = require("./dto/horaire-response.dto");
const horaires_service_1 = require("./horaires.service");
let HorairesController = class HorairesController {
    horaires;
    constructor(horaires) {
        this.horaires = horaires;
    }
    async findAll(req) {
        const locale = this.locale(req);
        const data = await this.horaires.findAll((0, request_context_1.requireTenant)(req).entrepriseId);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "horairesFetched"), data, locale);
    }
    async findOne(req, id) {
        const locale = this.locale(req);
        const data = await this.horaires.findOne((0, request_context_1.requireTenant)(req).entrepriseId, id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "horaireFetched"), data, locale);
    }
    async create(req, dto) {
        const locale = this.locale(req);
        const data = await this.horaires.create((0, request_context_1.requireUserId)(req), (0, request_context_1.requireTenant)(req).entrepriseId, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "horaireCreated"), data, locale);
    }
    async update(req, id, dto) {
        const locale = this.locale(req);
        const data = await this.horaires.update((0, request_context_1.requireUserId)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "horaireUpdated"), data, locale);
    }
    async remove(req, id) {
        const locale = this.locale(req);
        await this.horaires.remove((0, request_context_1.requireUserId)(req), (0, request_context_1.requireTenant)(req).entrepriseId, id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "horaireDeleted"), undefined, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.HorairesController = HorairesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Lister les horaires de mon entreprise",
        schema: horaire_response_dto_1.HorairesResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HorairesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Détail d'un horaire",
        schema: horaire_response_dto_1.HoraireResponseSchemaDto,
        notFound: "Horaire introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], HorairesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Créer un horaire",
        description: "Un seul horaire sans le module HORAIRES_MULTIPLES (403 au-delà).",
        status: 201,
        schema: horaire_response_dto_1.HoraireResponseSchemaDto,
        invalid: "Données invalides",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, horaire_dto_1.CreateHoraireDto]),
    __metadata("design:returntype", Promise)
], HorairesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Modifier un horaire",
        schema: horaire_response_dto_1.HoraireResponseSchemaDto,
        notFound: "Horaire introuvable",
        invalid: "Données invalides ou corps vide",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, horaire_dto_1.UpdateHoraireDto]),
    __metadata("design:returntype", Promise)
], HorairesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Supprimer un horaire",
        schema: response_schemas_dto_1.SuccessResponseSchemaDto,
        notFound: "Horaire introuvable",
        invalid: "Horaire encore attribué à des utilisateurs",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], HorairesController.prototype, "remove", null);
exports.HorairesController = HorairesController = __decorate([
    (0, swagger_1.ApiTags)("Horaires"),
    (0, api_audience_decorator_1.ApiAudience)("employeur"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES),
    (0, common_1.Controller)("horaires"),
    __metadata("design:paramtypes", [horaires_service_1.HorairesService])
], HorairesController);
//# sourceMappingURL=horaires.controller.js.map