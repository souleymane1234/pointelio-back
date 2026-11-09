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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCheckMiddleware = void 0;
const common_1 = require("@nestjs/common");
const version_util_1 = require("../utils/version.util");
const i18n_1 = require("../i18n");
const response_util_1 = require("../utils/response.util");
let VersionCheckMiddleware = class VersionCheckMiddleware {
    ENABLED;
    bypassKey;
    config;
    constructor() {
        const envValue = process.env.VERSION_CHECK_ENABLED;
        this.ENABLED = envValue === "1" || envValue === "true";
        this.bypassKey = String(process.env.VERSION_CHECK_BYPASS_KEY || "").trim();
        const iosAllowed = String(process.env.IOS_MIN_VERSION || "").trim() || "1.0.0";
        const androidAllowed = String(process.env.ANDROID_MIN_VERSION || "").trim() || "1.0.0";
        this.config = {
            ios: {
                current_version: iosAllowed,
                min_version: iosAllowed,
            },
            android: {
                current_version: androidAllowed,
                min_version: androidAllowed,
            },
        };
    }
    hasValidBypassKey(req) {
        if (!this.bypassKey)
            return false;
        const provided = String(req.headers["bypass-update-key"] ??
            req.headers["x-version-bypass-key"] ??
            "").trim();
        return provided.length > 0 && provided === this.bypassKey;
    }
    use(req, res, next) {
        if (!this.ENABLED) {
            return next();
        }
        if (this.hasValidBypassKey(req)) {
            return next();
        }
        const path = req.path ||
            (req.originalUrl && req.originalUrl.split("?")[0]) ||
            req.url.split("?")[0];
        if (path.includes("/auth/admin/login/decision")) {
            return next();
        }
        const locale = (0, i18n_1.normalizeLocale)(req.headers["language"]);
        const platform = String(req.headers["app-mobile-platform"] ?? "").trim();
        const version = String(req.headers["app-mobile-version"] ?? "").trim();
        if (!platform || platform === "web") {
            return next();
        }
        if (platform !== "ios" && platform !== "android") {
            return res
                .status(common_1.HttpStatus.UNPROCESSABLE_ENTITY)
                .json((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "invalidPlatform", { value: platform })], undefined, locale));
        }
        if (!version) {
            return res
                .status(common_1.HttpStatus.UNPROCESSABLE_ENTITY)
                .json((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, "versionHeaderRequired")], undefined, locale));
        }
        const cleanPlatform = platform;
        const cleanVersion = version;
        const versionRegex = /^\d+\.\d+\.\d+$/;
        if (!versionRegex.test(cleanVersion)) {
            return res.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY).json((0, response_util_1.validationErrorResponse)([
                (0, i18n_1.translate)(locale, "invalidVersionFormat", {
                    value: cleanVersion,
                }),
            ], undefined, locale));
        }
        const checkResult = (0, version_util_1.checkAppVersion)(cleanPlatform, cleanVersion, false, this.config, false, req.headers["language"]);
        if (checkResult.shouldBlock) {
            const platformConfig = this.config[cleanPlatform];
            return res
                .status(common_1.HttpStatus.GONE)
                .json((0, response_util_1.upgradeRequiredResponse)(cleanPlatform, platformConfig.min_version, platformConfig.current_version, checkResult.can_bypass, checkResult.message, locale));
        }
        next();
    }
};
exports.VersionCheckMiddleware = VersionCheckMiddleware;
exports.VersionCheckMiddleware = VersionCheckMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VersionCheckMiddleware);
//# sourceMappingURL=version-check.middleware.js.map