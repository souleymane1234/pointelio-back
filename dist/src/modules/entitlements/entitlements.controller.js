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
exports.EntitlementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const abonnement_inactif_decorator_1 = require("../../common/decorators/abonnement-inactif.decorator");
const i18n_1 = require("../../common/i18n");
const response_util_1 = require("../../common/utils/response.util");
const api_entitlements_decorator_1 = require("./decorators/api-entitlements.decorator");
const entitlements_service_1 = require("./entitlements.service");
let EntitlementsController = class EntitlementsController {
    entitlements;
    constructor(entitlements) {
        this.entitlements = entitlements;
    }
    async mine(req) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const entrepriseId = req.tenant?.entrepriseId;
        const data = entrepriseId
            ? {
                ...(await this.entitlements.getForEntreprise(entrepriseId, locale)),
                usage: await this.entitlements.getUsage(entrepriseId),
            }
            : null;
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "entitlementsFetched"), data, locale);
    }
};
exports.EntitlementsController = EntitlementsController;
__decorate([
    (0, common_1.Get)(),
    (0, abonnement_inactif_decorator_1.AutoriseAbonnementInactif)(),
    (0, api_entitlements_decorator_1.ApiMyEntitlements)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EntitlementsController.prototype, "mine", null);
exports.EntitlementsController = EntitlementsController = __decorate([
    (0, swagger_1.ApiTags)("Entitlements"),
    (0, api_audience_decorator_1.ApiAudience)("mobile", "employeur"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("me/entitlements"),
    __metadata("design:paramtypes", [entitlements_service_1.EntitlementsService])
], EntitlementsController);
//# sourceMappingURL=entitlements.controller.js.map