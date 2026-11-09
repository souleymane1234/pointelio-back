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
var ProfileController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const abonnement_inactif_decorator_1 = require("../../common/decorators/abonnement-inactif.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const throttler_constants_1 = require("../../common/throttler/throttler.constants");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const i18n_1 = require("../../common/i18n");
const api_profile_decorator_1 = require("./decorators/api-profile.decorator");
const response_util_1 = require("../../common/utils/response.util");
const profile_service_1 = require("./profile.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const request_context_1 = require("../../common/types/request-context");
let ProfileController = ProfileController_1 = class ProfileController {
    profileService;
    logger = new common_1.Logger(ProfileController_1.name);
    constructor(profileService) {
        this.profileService = profileService;
    }
    async me(req) {
        const startedAt = Date.now();
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const userId = (0, request_context_1.requireUserId)(req);
        let statusCode = 200;
        try {
            const user = await this.profileService.me(userId);
            return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "profileFetched"), user, locale);
        }
        catch (error) {
            statusCode = error instanceof common_1.HttpException ? error.getStatus() : 500;
            throw error;
        }
        finally {
            const durationMs = Date.now() - startedAt;
            this.logger.log(`GET /profile/me - userId=${userId} - ${statusCode} - ${durationMs}ms`);
        }
    }
    async updateMe(req, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const userId = (0, request_context_1.requireUserId)(req);
        const updated = await this.profileService.update(userId, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "profileUpdated"), updated, locale);
    }
    async changePassword(req, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        await this.profileService.changePassword((0, request_context_1.requireUserId)(req), dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "passwordChanged"), null, locale);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)("me"),
    (0, api_profile_decorator_1.ApiProfileMe)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)("me"),
    (0, api_profile_decorator_1.ApiUpdateProfile)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Patch)("me/password"),
    (0, throttler_1.Throttle)((0, throttler_constants_1.authThrottleOptions)()),
    (0, api_profile_decorator_1.ApiChangePassword)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "changePassword", null);
exports.ProfileController = ProfileController = ProfileController_1 = __decorate([
    (0, swagger_1.ApiTags)("Profile"),
    (0, api_audience_decorator_1.ApiAudience)("mobile", "employeur"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, abonnement_inactif_decorator_1.AutoriseAbonnementInactif)(),
    (0, common_1.Controller)("profile"),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map