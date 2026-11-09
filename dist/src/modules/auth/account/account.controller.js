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
exports.AuthAccountController = void 0;
const abonnement_inactif_decorator_1 = require("../../../common/decorators/abonnement-inactif.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../../common/decorators/api-audience.decorator");
const throttler_1 = require("@nestjs/throttler");
const api_account_decorator_1 = require("./decorators/api-account.decorator");
const i18n_1 = require("../../../common/i18n");
const throttler_constants_1 = require("../../../common/throttler/throttler.constants");
const response_util_1 = require("../../../common/utils/response.util");
const deactivate_account_service_1 = require("./services/deactivate-account.service");
const bearer_token_util_1 = require("../session/utils/bearer-token.util");
const request_context_1 = require("../../../common/types/request-context");
let AuthAccountController = class AuthAccountController {
    deactivateAccountService;
    constructor(deactivateAccountService) {
        this.deactivateAccountService = deactivateAccountService;
    }
    async deactivateAccount(req) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const userId = (0, request_context_1.requireUserId)(req);
        const accessToken = (0, bearer_token_util_1.extractBearerToken)(req);
        await this.deactivateAccountService.deactivate(userId, accessToken ?? "", locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "accountDeactivated"), undefined, locale);
    }
};
exports.AuthAccountController = AuthAccountController;
__decorate([
    (0, common_1.Post)("deactivate-account"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_account_decorator_1.ApiDeactivateAccount)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthAccountController.prototype, "deactivateAccount", null);
exports.AuthAccountController = AuthAccountController = __decorate([
    (0, swagger_1.ApiTags)("Auth"),
    (0, api_audience_decorator_1.ApiAudience)("mobile", "employeur"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, throttler_1.Throttle)((0, throttler_constants_1.authThrottleOptions)()),
    (0, abonnement_inactif_decorator_1.AutoriseAbonnementInactif)(),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [deactivate_account_service_1.DeactivateAccountService])
], AuthAccountController);
//# sourceMappingURL=account.controller.js.map