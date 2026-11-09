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
exports.UsersListService = void 0;
const common_1 = require("@nestjs/common");
const phone_util_1 = require("../../../common/utils/phone.util");
const i18n_1 = require("../../../common/i18n");
const recent_first_order_1 = require("../../../common/utils/recent-first-order");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const admin_users_cache_config_1 = require("../config/admin-users-cache.config");
const admin_users_cache_service_1 = require("./admin-users-cache.service");
const user_scope_service_1 = require("./user-scope.service");
const user_admin_select_1 = require("./user-admin.select");
let UsersListService = class UsersListService {
    prisma;
    adminUsersCache;
    scope;
    constructor(prisma, adminUsersCache, scope) {
        this.prisma = prisma;
        this.adminUsersCache = adminUsersCache;
        this.scope = scope;
    }
    async findAll(actor, query) {
        const entrepriseId = this.scope.scopedEntrepriseId(actor) ?? query.entrepriseId;
        const key = (0, admin_users_cache_config_1.buildAdminUsersCacheKey)("admin-users-list", {
            page: query.page,
            per_page: query.per_page,
            search: query.search,
            statut: query.statut,
            role: query.role,
            siteId: query.siteId,
            entrepriseId,
        });
        return this.adminUsersCache.wrap(key, () => this.computeFindAll(query, entrepriseId));
    }
    async computeFindAll(query, entrepriseId) {
        const page = query.page ?? 1;
        const perPage = query.per_page ?? 10;
        const where = {};
        if (entrepriseId !== undefined)
            where.entrepriseId = entrepriseId;
        if (query.statut !== undefined)
            where.statut = query.statut;
        if (query.role !== undefined)
            where.role = query.role;
        if (query.siteId !== undefined)
            where.siteId = query.siteId;
        if (query.search) {
            const s = (0, phone_util_1.resolveUserSearchTerm)(query.search);
            where.OR = [
                { nom: { contains: s } },
                { prenom: { contains: s } },
                { email: { contains: s } },
                { telephone: { contains: s } },
                { matricule: { contains: s } },
            ];
        }
        const totalItems = await this.prisma.utilisateur.count({ where });
        const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / perPage);
        const safePage = Math.min(Math.max(1, page), totalPages);
        const offset = (safePage - 1) * perPage;
        const rows = await this.prisma.utilisateur.findMany({
            where,
            select: user_admin_select_1.USER_ADMIN_SELECT,
            orderBy: recent_first_order_1.recentFirstOrderBy,
            skip: offset,
            take: perPage,
        });
        return {
            data: rows.map(user_admin_select_1.normalizeUserAdmin),
            pagination: {
                current_page: safePage,
                total_pages: totalPages,
                per_page: perPage,
                total_items: totalItems,
            },
        };
    }
    async findOne(actor, id, locale) {
        const key = (0, admin_users_cache_config_1.buildAdminUsersCacheKey)("admin-user-detail", { id });
        const user = await this.adminUsersCache.wrap(key, () => this.computeFindOne(id, locale));
        this.scope.assertInScope(actor, user, locale);
        return user;
    }
    async computeFindOne(id, locale) {
        const user = await this.prisma.utilisateur.findUnique({
            where: { id },
            select: user_admin_select_1.USER_ADMIN_SELECT,
        });
        if (!user) {
            throw new common_1.NotFoundException((0, i18n_1.translate)(locale, "userNotFound"));
        }
        return (0, user_admin_select_1.normalizeUserAdmin)(user);
    }
};
exports.UsersListService = UsersListService;
exports.UsersListService = UsersListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        admin_users_cache_service_1.AdminUsersCacheService,
        user_scope_service_1.UserScopeService])
], UsersListService);
//# sourceMappingURL=users-list.service.js.map