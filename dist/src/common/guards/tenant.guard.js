"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const request_store_1 = require("../context/request-store");
const i18n_1 = require("../i18n");
const role_groups_1 = require("../rbac/role-groups");
let TenantGuard = class TenantGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || (0, role_groups_1.isPlatformRole)(user.role)) {
            return true;
        }
        if (!request.tenant) {
            const locale = request.locale ?? (0, i18n_1.normalizeLocale)(request.headers.language);
            throw new common_1.ForbiddenException((0, i18n_1.translate)(locale, "tenantManquant"));
        }
        const store = (0, request_store_1.getRequestStore)();
        if (store) {
            store.entrepriseId = request.tenant.entrepriseId;
        }
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)()
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map