"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MobileApiHeadersMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileApiHeadersMiddleware = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../i18n");
const response_util_1 = require("../utils/response.util");
let MobileApiHeadersMiddleware = MobileApiHeadersMiddleware_1 = class MobileApiHeadersMiddleware {
    logger = new common_1.Logger(MobileApiHeadersMiddleware_1.name);
    use(req, res, next) {
        const path = req.path ||
            (req.originalUrl && req.originalUrl.split("?")[0]) ||
            req.url.split("?")[0];
        if (this.isDocsOrOpenApiPath(path)) {
            return next();
        }
        if (!this.hasMatchingRoute(req, path)) {
            return next();
        }
        const locale = (0, i18n_1.normalizeLocale)(req.headers.language);
        const accept = req.headers.accept;
        const acceptOk = this.isAcceptHeaderValid(accept);
        const errors = [];
        if (!acceptOk &&
            !this.isUploadMultipartPath(path) &&
            !this.isAdminLoginDecisionPath(path)) {
            errors.push((0, i18n_1.translate)(locale, "acceptRequired"));
        }
        if (errors.length > 0) {
            this.logger.warn(`${req.method} ${path} - 422 invalid headers: ${errors.join(" | ")}`);
            return res
                .status(422)
                .json((0, response_util_1.validationErrorResponse)(errors, undefined, locale));
        }
        req.locale = locale;
        next();
    }
    hasMatchingRoute(req, path) {
        const method = req.method.toLowerCase();
        const stack = (req.app?._router?.stack ??
            req.app?.router?.stack ??
            []);
        if (!Array.isArray(stack) || stack.length === 0) {
            return true;
        }
        return this.stackHasMatch(stack, path, method);
    }
    stackHasMatch(stack, path, method) {
        for (const layer of stack) {
            if (!layer)
                continue;
            if (layer.route) {
                if (this.isCatchAllRoutePath(layer.route.path)) {
                    continue;
                }
                const methods = layer.route.methods;
                const methodAllowed = methods?.[method] || methods?.all;
                if (!methodAllowed)
                    continue;
                if (typeof layer.match === "function" && layer.match(path)) {
                    return true;
                }
                continue;
            }
            const nestedStack = layer.handle?.stack;
            if (nestedStack && this.stackHasMatch(nestedStack, path, method)) {
                return true;
            }
        }
        return false;
    }
    isCatchAllRoutePath(routePath) {
        const values = Array.isArray(routePath) ? routePath : [routePath];
        return values.some((value) => {
            if (typeof value !== "string")
                return false;
            return value === "*" || value === "/*" || value === "/(.*)";
        });
    }
    isDocsOrOpenApiPath(path) {
        return (path.startsWith("/api/v1/docs") ||
            path === "/api/v1/docs-json" ||
            path.endsWith("/docs"));
    }
    isAdminLoginDecisionPath(path) {
        return path.includes("/auth/admin/login/decision");
    }
    isUploadMultipartPath(path) {
        return /\/uploads\//.test(path);
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
            return (token === "application/json" || token.startsWith("application/json;"));
        });
    }
};
exports.MobileApiHeadersMiddleware = MobileApiHeadersMiddleware;
exports.MobileApiHeadersMiddleware = MobileApiHeadersMiddleware = MobileApiHeadersMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], MobileApiHeadersMiddleware);
//# sourceMappingURL=mobile-api-headers.middleware.js.map