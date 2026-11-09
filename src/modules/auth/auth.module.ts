import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuditModule } from "../audit/audit.module";
import { AuthSessionController } from "./session/session.controller";
import { AuthAccountController } from "./account/account.controller";
import { AuthEmailController } from "./email/email.controller";
import { AuthPhoneController } from "./phone/phone.controller";
import { AbonnementActifGuard } from "../../common/guards/abonnement-actif.guard";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ModuleGuard } from "../../common/guards/module.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { TenantGuard } from "../../common/guards/tenant.guard";
import { EntitlementsModule } from "../entitlements/entitlements.module";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { getJwtAccessExpiresInSeconds } from "./session/config/jwt-expiry.config";
import { TokenService } from "./session/services/token.service";
import { LoginService } from "./session/services/login.service";
import { LogoutService } from "./session/services/logout.service";
import { DeactivateAccountService } from "./account/services/deactivate-account.service";
import { AuthPhoneService } from "./phone/services/auth-phone.service";
import { AuthTokenRevocationStore } from "./session/services/auth-token-revocation.store";
import { AuthUserSessionService } from "./session/services/auth-user-session.service";

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    EntitlementsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: getJwtAccessExpiresInSeconds(),
        },
      }),
    }),
  ],
  controllers: [
    AuthSessionController,
    AuthPhoneController,
    AuthEmailController,
    AuthAccountController,
  ],
  providers: [
    AuthTokenRevocationStore,
    AuthUserSessionService,
    AuthPhoneService,
    TokenService,
    LoginService,
    LogoutService,
    DeactivateAccountService,
    JwtAuthGuard,
    // Chaîne globale, exécutée dans cet ordre : un compte suspendu ou expiré
    // est bloqué avant même le contrôle des droits.
    { provide: APP_GUARD, useExisting: JwtAuthGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_GUARD, useClass: AbonnementActifGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ModuleGuard },
  ],
  exports: [TokenService, JwtModule, JwtAuthGuard, AuthUserSessionService],
})
export class AuthModule {}
