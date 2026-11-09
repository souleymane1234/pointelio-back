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
exports.AuthEmailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../../common/decorators/api-audience.decorator");
const throttler_1 = require("@nestjs/throttler");
const i18n_1 = require("../../../common/i18n");
const throttler_constants_1 = require("../../../common/throttler/throttler.constants");
const response_util_1 = require("../../../common/utils/response.util");
const api_email_decorator_1 = require("./decorators/api-email.decorator");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const email_login_dto_1 = require("./dto/email-login.dto");
const login_service_1 = require("../session/services/login.service");
const auth_response_mobile_util_1 = require("../session/utils/auth-response-mobile.util");
let AuthEmailController = class AuthEmailController {
    loginService;
    constructor(loginService) {
        this.loginService = loginService;
    }
    async login(req, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const result = await this.loginService.loginWithEmail(dto.email, dto.password, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "loginSuccess"), (0, auth_response_mobile_util_1.authSuccessData)(result), locale);
    }
};
exports.AuthEmailController = AuthEmailController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_email_decorator_1.ApiEmailLogin)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, email_login_dto_1.EmailLoginDto]),
    __metadata("design:returntype", Promise)
], AuthEmailController.prototype, "login", null);
exports.AuthEmailController = AuthEmailController = __decorate([
    (0, swagger_1.ApiTags)("Auth — E-mail"),
    (0, api_audience_decorator_1.ApiAudience)("employeur"),
    (0, common_1.Controller)("auth/email"),
    (0, throttler_1.Throttle)((0, throttler_constants_1.authThrottleOptions)()),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], AuthEmailController);
//# sourceMappingURL=email.controller.js.map