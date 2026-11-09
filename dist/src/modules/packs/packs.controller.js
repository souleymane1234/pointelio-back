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
exports.PacksController = void 0;
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
const create_pack_dto_1 = require("./dto/create-pack.dto");
const pack_response_dto_1 = require("./dto/pack-response.dto");
const packs_query_dto_1 = require("./dto/packs-query.dto");
const update_pack_dto_1 = require("./dto/update-pack.dto");
const packs_service_1 = require("./packs.service");
let PacksController = class PacksController {
    packsService;
    constructor(packsService) {
        this.packsService = packsService;
    }
    async findAll(req, query) {
        const locale = this.locale(req);
        const { data, pagination } = await this.packsService.findAll(query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "packsFetched"), locale);
    }
    async findOne(req, id) {
        const locale = this.locale(req);
        const data = await this.packsService.findOne(id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "packFetched"), data, locale);
    }
    async create(req, dto) {
        const locale = this.locale(req);
        const data = await this.packsService.create((0, request_context_1.requireUserId)(req), dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "packCreated"), data, locale);
    }
    async update(req, id, dto) {
        const locale = this.locale(req);
        const data = await this.packsService.update((0, request_context_1.requireUserId)(req), id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "packUpdated"), data, locale);
    }
    async deactivate(req, id) {
        const locale = this.locale(req);
        const data = await this.packsService.deactivate((0, request_context_1.requireUserId)(req), id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "packDeactivated"), data, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.PacksController = PacksController;
__decorate([
    (0, common_1.Get)(),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Lister les packs",
        status: 206,
        schema: pack_response_dto_1.PacksPaginatedResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, packs_query_dto_1.PacksQueryDto]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Détail d'un pack",
        schema: pack_response_dto_1.PackResponseSchemaDto,
        notFound: "Pack introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Créer un pack",
        status: 201,
        schema: pack_response_dto_1.PackResponseSchemaDto,
        invalid: "Données invalides ou code déjà utilisé",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pack_dto_1.CreatePackDto]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Modifier un pack",
        description: "Prix, limites et modules s'appliquent aux entreprises abonnées (hors surcharges propres à l'entreprise).",
        schema: pack_response_dto_1.PackResponseSchemaDto,
        notFound: "Pack introuvable",
        invalid: "Données invalides, corps vide ou code déjà utilisé",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_pack_dto_1.UpdatePackDto]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Désactiver un pack",
        description: "Le pack n'est plus proposé aux nouvelles entreprises ; les entreprises abonnées le conservent.",
        schema: pack_response_dto_1.PackResponseSchemaDto,
        notFound: "Pack introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "deactivate", null);
exports.PacksController = PacksController = __decorate([
    (0, swagger_1.ApiTags)("Admin — Packs"),
    (0, api_audience_decorator_1.ApiAudience)("plateforme"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.PLATFORM_ROLES),
    (0, common_1.Controller)("admin/packs"),
    __metadata("design:paramtypes", [packs_service_1.PacksService])
], PacksController);
//# sourceMappingURL=packs.controller.js.map