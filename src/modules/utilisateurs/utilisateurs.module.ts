import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { AppCacheModule } from "../../infra/cache/cache.module";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { EntitlementsModule } from "../entitlements/entitlements.module";
import { UtilisateursController } from "./utilisateurs.controller";
import { AdminUsersCacheService } from "./services/admin-users-cache.service";
import { UserIdentifiersService } from "./services/user-identifiers.service";
import { UserScopeService } from "./services/user-scope.service";
import { UsersCreateService } from "./services/users-create.service";
import { UsersListService } from "./services/users-list.service";
import { UtilisateursService } from "./services/utilisateurs.service";
import { UsersUpdateService } from "./services/users-update.service";

@Module({
  imports: [
    PrismaModule,
    AppCacheModule,
    AuditModule,
    EntitlementsModule,
  ],
  controllers: [UtilisateursController],
  providers: [
    AdminUsersCacheService,
    UserScopeService,
    UserIdentifiersService,
    UsersListService,
    UsersCreateService,
    UsersUpdateService,
    UtilisateursService,
  ],
})
export class UtilisateursModule {}
