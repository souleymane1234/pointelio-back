"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MobileApiHeadersGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileApiHeadersGuard = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../i18n");
const response_util_1 = require("../utils/response.util");
const ACCEPT_HEADER_EXEMPT_PATHS = [/\/uploads\//];
let MobileApiHeadersGuard = MobileApiHeadersGuard_1 = class MobileApiHeadersGuard {
    logger = new common_1.Logger(MobileApiHeadersGuard_1.name);
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const path = req.path ||
            (req.originalUrl && req.originalUrl.split("?")[0]) ||
            req.url.split("?")[0];
        if (this.isDocsOrOpenApiPath(path)) {
            return true;
        }
        const locale = (0, i18n_1.normalizeLocale)(req.headers.language);
        const errors = [];
        if (!this.isAcceptHeaderValid(req.headers.accept) &&
            !this.isAcceptHeaderExemptPath(path)) {
            errors.push((0, i18n_1.translate)(locale, "acceptRequired"));
        }
        if (errors.length > 0) {
            this.logger.warn(`${req.method} ${path} - 422 invalid headers: ${errors.join(" | ")}`);
            throw new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)(errors, undefined, locale));
        }
        req.locale = locale;
        return true;
    }
    isDocsOrOpenApiPath(path) {
        return (path.startsWith("/api/v1/docs") ||
            path === "/api/v1/docs-json" ||
            path.endsWith("/docs"));
    }
    isAcceptHeaderExemptPath(path) {
        return ACCEPT_HEADER_EXEMPT_PATHS.some((pattern) => pattern.test(path));
    }
    isAcceptHeaderValid(acceptHeader) {
        if (typeof acceptHeader !== "string" || acceptHeader.trim() === "") {
            return false;
        }
        const tokens = acceptHeader
            .split(",")
            .map((token) => token.trim().toLowerCase())
            .filter(Boolean);
        return tokens.some((token) => {
            if (token === "*/*")
                return true;
            if (token === "application/json" ||
                token.startsWith("application/json;") ||
                token === "application/pdf" ||
                token.startsWith("application/pdf;") ||
                token === "image/png" ||
                token.startsWith("image/png;") ||
                token === "text/html" ||
                token.startsWith("text/html;")) {
                return true;
            }
            return false;
        });
    }
};
exports.MobileApiHeadersGuard = MobileApiHeadersGuard;
exports.MobileApiHeadersGuard = MobileApiHeadersGuard = MobileApiHeadersGuard_1 = __decorate([
    (0, common_1.Injectable)()
], MobileApiHeadersGuard);
//# sourceMappingURL=mobile-api-headers.guard.js.map