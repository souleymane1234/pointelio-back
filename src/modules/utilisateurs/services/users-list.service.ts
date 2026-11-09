import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { resolveUserSearchTerm } from "../../../common/utils/phone.util";
import type { AuthUser } from "../../../common/types/request-context";
import { translate, type Locale } from "../../../common/i18n";
import { recentFirstOrderBy } from "../../../common/utils/recent-first-order";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { buildAdminUsersCacheKey } from "../config/admin-users-cache.config";
import type { UsersQueryDto } from "../dto/users-query.dto";
import { AdminUsersCacheService } from "./admin-users-cache.service";
import { UserScopeService } from "./user-scope.service";
import { normalizeUserAdmin, USER_ADMIN_SELECT } from "./user-admin.select";

@Injectable()
export class UsersListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adminUsersCache: AdminUsersCacheService,
    private readonly scope: UserScopeService,
  ) {}

  async findAll(actor: AuthUser, query: UsersQueryDto) {
    const entrepriseId =
      this.scope.scopedEntrepriseId(actor) ?? query.entrepriseId;
    const key = buildAdminUsersCacheKey("admin-users-list", {
      page: query.page,
      per_page: query.per_page,
      search: query.search,
      statut: query.statut,
      role: query.role,
      siteId: query.siteId,
      entrepriseId,
    });
    return this.adminUsersCache.wrap(key, () =>
      this.computeFindAll(query, entrepriseId),
    );
  }

  private async computeFindAll(
    query: UsersQueryDto,
    entrepriseId: number | undefined,
  ) {
    const page = query.page ?? 1;
    const perPage = query.per_page ?? 10;

    const where: Prisma.UtilisateurWhereInput = {};
    if (entrepriseId !== undefined) where.entrepriseId = entrepriseId;
    if (query.statut !== undefined) where.statut = query.statut;
    if (query.role !== undefined) where.role = query.role;
    if (query.siteId !== undefined) where.siteId = query.siteId;

    if (query.search) {
      const s = resolveUserSearchTerm(query.search);
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
      select: USER_ADMIN_SELECT,
      orderBy: recentFirstOrderBy,
      skip: offset,
      take: perPage,
    });

    return {
      data: rows.map(normalizeUserAdmin),
      pagination: {
        current_page: safePage,
        total_pages: totalPages,
        per_page: perPage,
        total_items: totalItems,
      },
    };
  }

  async findOne(actor: AuthUser, id: number, locale: Locale) {
    const key = buildAdminUsersCacheKey("admin-user-detail", { id });
    const user = await this.adminUsersCache.wrap(key, () =>
      this.computeFindOne(id, locale),
    );
    this.scope.assertInScope(actor, user, locale);
    return user;
  }

  private async computeFindOne(id: number, locale: Locale) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id },
      select: USER_ADMIN_SELECT,
    });
    if (!user) {
      throw new NotFoundException(translate(locale, "userNotFound"));
    }
    return normalizeUserAdmin(user);
  }
}
