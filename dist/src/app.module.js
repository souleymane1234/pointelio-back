"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const validation_1 = require("./config/validation");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const ioredis_1 = __importDefault(require("ioredis"));
const mobile_api_headers_guard_1 = require("./common/guards/mobile-api-headers.guard");
const ip_block_module_1 = require("./common/ip-block/ip-block.module");
const maintenance_middleware_1 = require("./common/middleware/maintenance.middleware");
const request_context_middleware_1 = require("./common/middleware/request-context.middleware");
const version_check_middleware_1 = require("./common/middleware/version-check.middleware");
const redis_throttler_storage_1 = require("./common/throttler/redis-throttler-storage");
const prisma_module_1 = require("./infra/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const cache_module_1 = require("./infra/cache/cache.module");
const profile_module_1 = require("./modules/profile/profile.module");
const redis_module_1 = require("./infra/redis/redis.module");
const uploads_module_1 = require("./infra/storage/uploads.module");
const utilisateurs_module_1 = require("./modules/utilisateurs/utilisateurs.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const audit_module_1 = require("./modules/audit/audit.module");
const emailing_module_1 = require("./infra/mail/emailing.module");
const socket_module_1 = require("./infra/socket/socket.module");
const queue_module_1 = require("./infra/queue/queue.module");
const abonnements_module_1 = require("./modules/abonnements/abonnements.module");
const entitlements_module_1 = require("./modules/entitlements/entitlements.module");
const entreprises_module_1 = require("./modules/entreprises/entreprises.module");
const horaires_module_1 = require("./modules/horaires/horaires.module");
const invitations_module_1 = require("./modules/invitations/invitations.module");
const packs_module_1 = require("./modules/packs/packs.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const demandes_module_1 = require("./modules/demandes/demandes.module");
const pointages_module_1 = require("./modules/pointages/pointages.module");
const sites_module_1 = require("./modules/sites/sites.module");
const perf_metrics_1 = require("./common/perf/perf-metrics");
const perf_profiling_service_1 = require("./common/perf/perf-profiling.service");
const perf_request_interceptor_1 = require("./common/perf/perf-request.interceptor");
const perfProviders = (0, perf_metrics_1.perfProfilingEnabled)()
    ? [
        perf_profiling_service_1.PerfProfilingService,
        { provide: core_1.APP_INTERCEPTOR, useClass: perf_request_interceptor_1.PerfRequestInterceptor },
    ]
    : [];
let AppModule = class AppModule {
    configure(consumer) {
        const envValue = process.env.VERSION_CHECK_ENABLED;
        const versionCheckEnabled = envValue === "1" || envValue === "true";
        const middlewares = versionCheckEnabled
            ? [
                request_context_middleware_1.RequestContextMiddleware,
                version_check_middleware_1.VersionCheckMiddleware,
                maintenance_middleware_1.MaintenanceMiddleware,
            ]
            : [request_context_middleware_1.RequestContextMiddleware, maintenance_middleware_1.MaintenanceMiddleware];
        consumer
            .apply(...middlewares)
            .forRoutes({ path: "{*splat}", method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
                validate: validation_1.validateEnv,
            }),
            ip_block_module_1.IpBlockModule,
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const disabled = config.get("THROTTLE_ENABLED", "true") === "false";
                    const redisUrl = config.get("REDIS_URL");
                    const enableRedisThrottler = config.get("THROTTLE_REDIS_ENABLED", "false") === "true";
                    const ttlParsed = parseInt(config.get("THROTTLE_TTL_MS", "60000"), 10);
                    const ttl = Number.isFinite(ttlParsed) && ttlParsed >= 1000 ? ttlParsed : 60_000;
                    const limitParsed = parseInt(config.get("THROTTLE_LIMIT", "100"), 10);
                    const limit = Number.isFinite(limitParsed) && limitParsed >= 1 ? limitParsed : 100;
                    const storage = enableRedisThrottler && redisUrl
                        ? new redis_throttler_storage_1.RedisThrottlerStorage(new ioredis_1.default(redisUrl))
                        : undefined;
                    return {
                        throttlers: [{ name: "default", ttl, limit }],
                        skipIf: (ctx) => {
                            if (disabled)
                                return true;
                            const req = ctx
                                .switchToHttp()
                                .getRequest();
                            const url = `${req.originalUrl ?? ""}${req.url ?? ""}`;
                            if (config.get("THROTTLE_SKIP_SWAGGER", "true") === "false") {
                                return false;
                            }
                            return (url.includes("/docs") ||
                                url.includes("docs-json") ||
                                url.includes("/api/v1/docs"));
                        },
                        ...(storage ? { storage } : {}),
                    };
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            cache_module_1.AppCacheModule,
            redis_module_1.RedisModule,
            queue_module_1.QueueModule,
            auth_module_1.AuthModule,
            profile_module_1.ProfileModule,
            uploads_module_1.UploadsModule,
            utilisateurs_module_1.UtilisateursModule,
            audit_module_1.AuditModule,
            notifications_module_1.NotificationsModule,
            emailing_module_1.EmailingModule,
            socket_module_1.SocketModule,
            entitlements_module_1.EntitlementsModule,
            packs_module_1.PacksModule,
            entreprises_module_1.EntreprisesModule,
            abonnements_module_1.AbonnementsModule,
            invitations_module_1.InvitationsModule,
            sites_module_1.SitesModule,
            horaires_module_1.HorairesModule,
            pointages_module_1.PointagesModule,
            demandes_module_1.DemandesModule,
            dashboard_module_1.DashboardModule,
        ],
        providers: [
            maintenance_middleware_1.MaintenanceMiddleware,
            version_check_middleware_1.VersionCheckMiddleware,
            { provide: core_1.APP_GUARD, useClass: mobile_api_headers_guard_1.MobileApiHeadersGuard },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            ...perfProviders,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map