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
exports.AbonnementActifGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_constants_1 = require("../constants/auth.constants");
const i18n_1 = require("../i18n");
const abonnement_util_1 = require("../utils/abonnement.util");
let AbonnementActifGuard = class AbonnementActifGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const tenant = request.tenant;
        if (!tenant || !(0, abonnement_util_1.isAbonnementBloque)(tenant.statut, tenant.dateEcheance)) {
            return true;
        }
        const autorise = this.reflector.getAllAndOverride(auth_constants_1.ABONNEMENT_INACTIF_AUTORISE_KEY, [context.getHandler(), context.getClass()]);
        if (autorise) {
            return true;
        }
        const locale = request.locale ?? (0, i18n_1.normalizeLocale)(request.headers.language);
        throw new common_1.ForbiddenException((0, i18n_1.translate)(locale, "abonnementInactif"));
    }
};
exports.AbonnementActifGuard = AbonnementActifGuard;
exports.AbonnementActifGuard = AbonnementActifGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AbonnementActifGuard);
//# sourceMappingURL=abonnement-actif.guard.js.map