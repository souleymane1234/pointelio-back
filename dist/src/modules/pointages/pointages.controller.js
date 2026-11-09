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
exports.PointagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const api_endpoint_decorator_1 = require("../../common/decorators/api-endpoint.decorator");
const module_requis_decorator_1 = require("../../common/decorators/module-requis.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const pack_modules_constants_1 = require("../../common/constants/pack-modules.constants");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const request_context_1 = require("../../common/types/request-context");
const response_util_1 = require("../../common/utils/response.util");
const anomalies_service_1 = require("./anomalies.service");
const corrections_service_1 = require("./corrections.service");
const pointage_dto_1 = require("./dto/pointage.dto");
const pointage_response_dto_1 = require("./dto/pointage-response.dto");
const pointages_service_1 = require("./pointages.service");
const parse_pointage_id_1 = require("./parse-pointage-id");
let PointagesController = class PointagesController {
    pointages;
    anomalies;
    corrections;
    constructor(pointages, anomalies, corrections) {
        this.pointages = pointages;
        this.anomalies = anomalies;
        this.corrections = corrections;
    }
    async findAll(req, query) {
        const locale = this.locale(req);
        const { data, pagination } = await this.pointages.findAll((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "pointagesFetched"), locale);
    }
    async findAnomalies(req, query) {
        const locale = this.locale(req);
        const { data, pagination } = await this.anomalies.list((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "anomaliesFetched"), locale);
    }
    async pointerQr(req, dto, res) {
        const locale = this.locale(req);
        const { replay, pointage } = await this.pointages.pointerQr((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, dto, locale);
        res.status(replay ? common_1.HttpStatus.OK : common_1.HttpStatus.CREATED);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, replay ? "pointageReplay" : "pointageCreated"), pointage, locale);
    }
    async findOne(req, idParam) {
        const locale = this.locale(req);
        const data = await this.pointages.findOne((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, (0, parse_pointage_id_1.parsePointageId)(idParam, locale), locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "pointageFetched"), data, locale);
    }
    async listCorrections(req, idParam) {
        const locale = this.locale(req);
        const data = await this.corrections.list((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, (0, parse_pointage_id_1.parsePointageId)(idParam, locale), locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "pointageCorrectionsFetched"), data, locale);
    }
    async corriger(req, idParam, dto) {
        const locale = this.locale(req);
        const data = await this.corrections.corriger((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, (0, parse_pointage_id_1.parsePointageId)(idParam, locale), dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "pointageCorrectionCreated"), data, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.PointagesController = PointagesController;
__decorate([
    (0, common_1.Get)(),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Lister les pointages",
        audience: ["mobile", "employeur"],
        description: "Employé : les siens. Surveillant : son site. RH / manager / admin : l'entreprise.",
        status: 206,
        schema: pointage_response_dto_1.PointagesPaginatedResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pointage_dto_1.PointagesQueryDto]),
    __metadata("design:returntype", Promise)
], PointagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("anomalies"),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER, client_1.Role.SURVEILLANT),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Lister les anomalies de pointage",
        audience: "employeur",
        description: "Hors zone, à vérifier, retards, oublis de départ. Filtrable via `anomalie`.",
        status: 206,
        schema: pointage_response_dto_1.PointagesPaginatedResponseSchemaDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pointage_dto_1.AnomaliesQueryDto]),
    __metadata("design:returntype", Promise)
], PointagesController.prototype, "findAnomalies", null);
__decorate([
    (0, common_1.Post)("qr"),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYE, client_1.Role.SURVEILLANT),
    (0, module_requis_decorator_1.ModuleRequis)(pack_modules_constants_1.PACK_MODULES.QR, pack_modules_constants_1.PACK_MODULES.GPS),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Pointer par QR + GPS",
        audience: "mobile",
        description: "Heure serveur, séquence arrivée/départ du jour, idempotence par requestId. Un replay renvoie 200.",
        status: 201,
        schema: pointage_response_dto_1.PointageResponseSchemaDto,
        invalid: "QR invalide, séquence incorrecte ou données GPS invalides",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pointage_dto_1.PointerQrDto, Object]),
    __metadata("design:returntype", Promise)
], PointagesController.prototype, "pointerQr", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Détail d'un pointage",
        audience: ["mobile", "employeur"],
        schema: pointage_response_dto_1.PointageResponseSchemaDto,
        notFound: "Pointage introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PointagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/corrections"),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Historique des corrections d'un pointage",
        audience: "employeur",
        schema: pointage_response_dto_1.PointageCorrectionsResponseSchemaDto,
        notFound: "Pointage introuvable",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PointagesController.prototype, "listCorrections", null);
__decorate([
    (0, common_1.Post)(":id/corrections"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Corriger un pointage",
        audience: "employeur",
        description: "Motif obligatoire. Trace avant/après. Les coordonnées GPS d'origine ne sont pas modifiées.",
        status: 201,
        schema: pointage_response_dto_1.PointageCorrectionResponseSchemaDto,
        notFound: "Pointage introuvable",
        invalid: "Motif manquant, aucun champ à corriger, ou site invalide",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, pointage_dto_1.CorrigerPointageDto]),
    __metadata("design:returntype", Promise)
], PointagesController.prototype, "corriger", null);
exports.PointagesController = PointagesController = __decorate([
    (0, swagger_1.ApiTags)("Pointages"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.TENANT_ADMIN_ROLES, client_1.Role.MANAGER, client_1.Role.SURVEILLANT, client_1.Role.EMPLOYE),
    (0, common_1.Controller)("pointages"),
    __metadata("design:paramtypes", [pointages_service_1.PointagesService,
        anomalies_service_1.AnomaliesService,
        corrections_service_1.CorrectionsService])
], PointagesController);
//# sourceMappingURL=pointages.controller.js.map