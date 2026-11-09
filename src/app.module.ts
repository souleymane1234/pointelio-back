import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { validateEnv } from "./config/validation";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { MobileApiHeadersGuard } from "./common/guards/mobile-api-headers.guard";
import { IpBlockModule } from "./common/ip-block/ip-block.module";
import { MaintenanceMiddleware } from "./common/middleware/maintenance.middleware";
import { RequestContextMiddleware } from "./common/middleware/request-context.middleware";
import { VersionCheckMiddleware } from "./common/middleware/version-check.middleware";
import { PrismaModule } from "./infra/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AppCacheModule } from "./infra/cache/cache.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { UploadsModule } from "./infra/storage/uploads.module";
import { UtilisateursModule } from "./modules/utilisateurs/utilisateurs.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { AuditModule } from "./modules/audit/audit.module";
import { EmailingModule } from "./infra/mail/emailing.module";
import { SocketModule } from "./infra/socket/socket.module";
import { AbonnementsModule } from "./modules/abonnements/abonnements.module";
import { EntitlementsModule } from "./modules/entitlements/entitlements.module";
import { EntreprisesModule } from "./modules/entreprises/entreprises.module";
import { HorairesModule } from "./modules/horaires/horaires.module";
import { InvitationsModule } from "./modules/invitations/invitations.module";
import { PacksModule } from "./modules/packs/packs.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DemandesModule } from "./modules/demandes/demandes.module";
import { PointagesModule } from "./modules/pointages/pointages.module";
import { SitesModule } from "./modules/sites/sites.module";
import { perfProfilingEnabled } from "./common/perf/perf-metrics";
import { PerfProfilingService } from "./common/perf/perf-profiling.service";
import { PerfRequestInterceptor } from "./common/perf/perf-request.interceptor";
const perfProviders = perfProfilingEnabled()
  ? [
      PerfProfilingService,
      { provide: APP_INTERCEPTOR, useClass: PerfRequestInterceptor },
    ]
  : [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validate: validateEnv,
    }),
    IpBlockModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const disabled =
          config.get<string>("THROTTLE_ENABLED", "true") === "false";
        const ttlParsed = parseInt(
          config.get<string>("THROTTLE_TTL_MS", "60000"),
          10,
        );
        const ttl =
          Number.isFinite(ttlParsed) && ttlParsed >= 1000 ? ttlParsed : 60_000;
        const limitParsed = parseInt(
          config.get<string>("THROTTLE_LIMIT", "100"),
          10,
        );
        const limit =
          Number.isFinite(limitParsed) && limitParsed >= 1 ? limitParsed : 100;

        return {
          throttlers: [{ name: "default", ttl, limit }],
          skipIf: (ctx) => {
            if (disabled) return true;
            const req = ctx
              .switchToHttp()
              .getRequest<{ originalUrl?: string; url?: string }>();
            const url = `${req.originalUrl ?? ""}${req.url ?? ""}`;
            if (
              config.get<string>("THROTTLE_SKIP_SWAGGER", "true") === "false"
            ) {
              return false;
            }
            return (
              url.includes("/docs") ||
              url.includes("docs-json") ||
              url.includes("/api/v1/docs")
            );
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AppCacheModule,
    AuthModule,
    ProfileModule,
    UploadsModule,
    UtilisateursModule,
    AuditModule,
    NotificationsModule,
    EmailingModule,
    SocketModule,
    EntitlementsModule,
    PacksModule,
    EntreprisesModule,
    AbonnementsModule,
    InvitationsModule,
    SitesModule,
    HorairesModule,
    PointagesModule,
    DemandesModule,
    DashboardModule,
  ],
  providers: [
    MaintenanceMiddleware,
    VersionCheckMiddleware, // Doit être dans providers pour que NestJS puisse l'injecter
    { provide: APP_GUARD, useClass: MobileApiHeadersGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    ...perfProviders,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Lire la variable d'environnement (0 = false, 1 = true)
    const envValue = process.env.VERSION_CHECK_ENABLED;
    const versionCheckEnabled = envValue === "1" || envValue === "true";

    const middlewares = versionCheckEnabled
      ? [
          RequestContextMiddleware,
          VersionCheckMiddleware,
          MaintenanceMiddleware,
        ]
      : [RequestContextMiddleware, MaintenanceMiddleware];

    consumer
      .apply(...middlewares)
      .forRoutes({ path: "{*splat}", method: RequestMethod.ALL });
  }
}
