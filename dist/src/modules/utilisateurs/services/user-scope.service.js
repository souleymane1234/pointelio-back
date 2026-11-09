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
exports.UserScopeService = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../../../common/i18n");
const role_groups_1 = require("../../../common/rbac/role-groups");
const response_util_1 = require("../../../common/utils/response.util");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
let UserScopeService = class UserScopeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    scopedEntrepriseId(actor) {
        return (0, role_groups_1.isPlatformRole)(actor.role) ? null : (actor.entrepriseId ?? -1);
    }
    assertInScope(actor, target, locale) {
        const scoped = this.scopedEntrepriseId(actor);
        if (scoped !== null && target.entrepriseId !== scoped) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "userNotFound"));
        }
    }
    assertCanAssignRole(actor, role) {
        if (!(0, role_groups_1.canAssignRole)(actor.role, role)) {
            throw new common_1.ForbiddenException();
        }
    }
    resolveEntrepriseId(actor, role, requested, locale) {
        if ((0, role_groups_1.isPlatformRole)(role)) {
            return null;
        }
        const scoped = this.scopedEntrepriseId(actor);
        const entrepriseId = scoped ?? requested ?? null;
        if (!entrepriseId) {
            throw this.invalid("userEntrepriseRequired", locale);
        }
        return entrepriseId;
    }
    async assertRattachement(entrepriseId, refs, locale) {
        if (entrepriseId === null) {
            if (refs.siteId || refs.horaireId) {
                throw this.invalid("userRattachementInvalid", locale);
            }
            return;
        }
        const [entreprise, site, horaire] = await Promise.all([
            this.prisma.entreprise.findUnique({
                where: { id: entrepriseId },
                select: { id: true },
            }),
            refs.siteId
                ? this.prisma.site.findFirst({
                    where: { id: refs.siteId, entrepriseId },
                    select: { id: true },
                })
                : null,
            refs.horaireId
                ? this.prisma.horaire.findFirst({
                    where: { id: refs.horaireId, entrepriseId },
                    select: { id: true },
                })
                : null,
        ]);
        if (!entreprise || (refs.siteId && !site) || (refs.horaireId && !horaire)) {
            throw this.invalid("userRattachementInvalid", locale);
        }
    }
    invalid(key, locale) {
        return new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)([(0, i18n_1.translate)(locale, key)], undefined, locale));
    }
};
exports.UserScopeService = UserScopeService;
exports.UserScopeService = UserScopeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserScopeService);
//# sourceMappingURL=user-scope.service.js.map