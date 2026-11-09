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
exports.SurveillantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const pack_modules_constants_1 = require("../../../common/constants/pack-modules.constants");
const api_endpoint_decorator_1 = require("../../../common/decorators/api-endpoint.decorator");
const module_requis_decorator_1 = require("../../../common/decorators/module-requis.decorator");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const i18n_1 = require("../../../common/i18n");
const request_context_1 = require("../../../common/types/request-context");
const response_util_1 = require("../../../common/utils/response.util");
const pointage_dto_1 = require("../dto/pointage.dto");
const pointage_response_dto_1 = require("../dto/pointage-response.dto");
const surveillant_service_1 = require("./surveillant.service");
let SurveillantController = class SurveillantController {
    surveillant;
    constructor(surveillant) {
        this.surveillant = surveillant;
    }
    async employes(req) {
        const locale = this.locale(req);
        const data = await this.surveillant.employesDuSite((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "surveillantEmployesFetched"), data, locale);
    }
    async pointer(req, dto, res) {
        const locale = this.locale(req);
        const { replay, pointage } = await this.surveillant.pointerPour((0, request_context_1.requireUser)(req), (0, request_context_1.requireTenant)(req).entrepriseId, dto, locale);
        res.status(replay ? common_1.HttpStatus.OK : common_1.HttpStatus.CREATED);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, replay ? "pointageReplay" : "pointageCreated"), pointage, locale);
    }
    locale(req) {
        return req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
    }
};
exports.SurveillantController = SurveillantController;
__decorate([
    (0, common_1.Get)("employes"),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Employés du site du surveillant",
        audience: "mobile",
        description: "Comptes EMPLOYE actifs du site, avec le dernier pointage du jour.",
        schema: pointage_response_dto_1.SurveillantEmployesResponseSchemaDto,
        invalid: "Le surveillant n'est rattaché à aucun site",
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SurveillantController.prototype, "employes", null);
__decorate([
    (0, common_1.Post)(),
    (0, api_endpoint_decorator_1.ApiEndpoint)({
        summary: "Badger un employé du site",
        audience: "mobile",
        description: "methode = SURVEILLANT. GPS optionnel. Idempotence par requestId (replay = 200).",
        status: 201,
        schema: pointage_response_dto_1.PointageResponseSchemaDto,
        invalid: "Employé invalide, séquence incorrecte ou site manquant",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pointage_dto_1.PointerSurveillantDto, Object]),
    __metadata("design:returntype", Promise)
], SurveillantController.prototype, "pointer", null);
exports.SurveillantController = SurveillantController = __decorate([
    (0, swagger_1.ApiTags)("Pointages — Surveillant"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SURVEILLANT),
    (0, module_requis_decorator_1.ModuleRequis)(pack_modules_constants_1.PACK_MODULES.SURVEILLANT),
    (0, common_1.Controller)("pointages/surveillant"),
    __metadata("design:paramtypes", [surveillant_service_1.SurveillantService])
], SurveillantController);
//# sourceMappingURL=surveillant.controller.js.map