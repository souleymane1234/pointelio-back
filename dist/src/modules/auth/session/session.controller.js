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
exports.AuthSessionController = void 0;
const abonnement_inactif_decorator_1 = require("../../../common/decorators/abonnement-inactif.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../../common/decorators/api-audience.decorator");
const throttler_1 = require("@nestjs/throttler");
const api_session_decorator_1 = require("./decorators/api-session.decorator");
const i18n_1 = require("../../../common/i18n");
const response_util_1 = require("../../../common/utils/response.util");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const admin_login_dto_1 = require("./dto/admin-login.dto");
const logout_dto_1 = require("./dto/logout.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const login_service_1 = require("./services/login.service");
const logout_service_1 = require("./services/logout.service");
const token_service_1 = require("./services/token.service");
const bearer_token_util_1 = require("./utils/bearer-token.util");
const throttler_constants_1 = require("../../../common/throttler/throttler.constants");
const auth_response_mobile_util_1 = require("./utils/auth-response-mobile.util");
function requireRefreshToken(dto, locale) {
    const raw = dto.refresh_token;
    if (typeof raw !== "string" || !raw.trim()) {
        throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "refreshTokenRequired")], undefined, locale));
    }
    return raw.trim();
}
let AuthSessionController = class AuthSessionController {
    loginService;
    logoutService;
    tokenService;
    constructor(loginService, logoutService, tokenService) {
        this.loginService = loginService;
        this.logoutService = logoutService;
        this.tokenService = tokenService;
    }
    async loginAdmin(req, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const result = await this.loginService.loginAdminWithEmail(dto.email, dto.password, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "loginSuccess"), (0, auth_response_mobile_util_1.authSuccessData)(result), locale);
    }
    async refreshToken(req, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const token = requireRefreshToken(dto, locale);
        const result = await this.tokenService.refresh(token, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "tokensRefreshed"), (0, auth_response_mobile_util_1.authTokensSnakeCase)(result));
    }
    async logout(req, userId, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const accessToken = (0, bearer_token_util_1.extractBearerToken)(req);
        await this.logoutService.logout(userId, accessToken ?? "", dto.refresh_token, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "logoutSuccess"), undefined, locale);
    }
};
exports.AuthSessionController = AuthSessionController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("admin/login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_audience_decorator_1.ApiAudience)("employeur", "plateforme"),
    (0, api_session_decorator_1.ApiAdminLogin)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_login_dto_1.AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AuthSessionController.prototype, "loginAdmin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(["refresh-token", "refresh"]),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_audience_decorator_1.ApiAudience)("mobile", "employeur", "plateforme"),
    (0, api_session_decorator_1.ApiRefreshToken)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthSessionController.prototype, "refreshToken", null);
__decorate([
    (0, abonnement_inactif_decorator_1.AutoriseAbonnementInactif)(),
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_audience_decorator_1.ApiAudience)("mobile", "employeur", "plateforme"),
    (0, api_session_decorator_1.ApiLogout)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, logout_dto_1.LogoutDto]),
    __metadata("design:returntype", Promise)
], AuthSessionController.prototype, "logout", null);
exports.AuthSessionController = AuthSessionController = __decorate([
    (0, swagger_1.ApiTags)("Auth — Session"),
    (0, common_1.Controller)("auth"),
    (0, throttler_1.Throttle)((0, throttler_constants_1.authThrottleOptions)()),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        logout_service_1.LogoutService,
        token_service_1.TokenService])
], AuthSessionController);
//# sourceMappingURL=session.controller.js.map