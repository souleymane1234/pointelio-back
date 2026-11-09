"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const express_1 = require("express");
const setup_swagger_1 = require("./common/swagger/setup-swagger");
const swagger_tags_1 = require("./common/swagger/swagger-tags");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const health_handlers_1 = require("./modules/health/health.handlers");
const prisma_service_1 = require("./infra/prisma/prisma.service");
const redis_otp_constants_1 = require("./infra/redis/redis-otp.constants");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const paginated_response_status_interceptor_1 = require("./common/interceptors/paginated-response-status.interceptor");
const validation_util_1 = require("./common/utils/validation.util");
const response_util_1 = require("./common/utils/response.util");
const redis_io_adapter_1 = require("./infra/socket/adapters/redis-io.adapter");
const startup_banner_1 = require("./common/banner/startup-banner");
const BASE64_UPLOAD_PATH = "/api/v1/uploads/content/base64";
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
    });
    const health = (0, health_handlers_1.createHealthHandlers)({
        prisma: app.get(prisma_service_1.PrismaService),
        redis: app.get(redis_otp_constants_1.REDIS_OTP, { strict: false }),
    });
    app.use(health_handlers_1.HEALTH_LIVE_PATH, health.live);
    app.use(health_handlers_1.HEALTH_READY_PATH, health.ready);
    process.once("SIGTERM", health.markShuttingDown);
    const redisUrl = app.get(config_1.ConfigService).get("REDIS_URL")?.trim();
    if (redisUrl) {
        const ioAdapter = new redis_io_adapter_1.RedisIoAdapter(app);
        try {
            await ioAdapter.connectToRedis(redisUrl);
            app.useWebSocketAdapter(ioAdapter);
        }
        catch (error) {
            console.error(`[Socket.IO] Redis adapter unavailable, events stay local to this instance: ${String(error)}`);
        }
    }
    const jsonBodyLimit = process.env.HTTP_JSON_BODY_LIMIT || "1mb";
    const base64UploadBodyLimit = process.env.HTTP_BASE64_UPLOAD_BODY_LIMIT || "70mb";
    app.use(BASE64_UPLOAD_PATH, (0, express_1.json)({ limit: base64UploadBodyLimit }));
    app.use((0, express_1.json)({ limit: jsonBodyLimit }));
    app.use((0, express_1.urlencoded)({ limit: jsonBodyLimit, extended: true }));
    const isProd = process.env.NODE_ENV === "production";
    if (process.env.TRUST_PROXY === "1" || process.env.TRUST_PROXY === "true") {
        app.getHttpAdapter().getInstance().set("trust proxy", 1);
    }
    app.setGlobalPrefix("api/v1");
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        referrerPolicy: { policy: "no-referrer" },
        ...(isProd
            ? {
                hsts: {
                    maxAge: 31536000,
                    includeSubDomains: true,
                    preload: true,
                },
            }
            : {}),
    }));
    const corsOriginsEnv = process.env.CORS_ORIGINS ?? "";
    const corsOrigins = corsOriginsEnv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const tryParseOrigin = (raw) => {
        try {
            return new URL(raw).origin;
        }
        catch {
            return null;
        }
    };
    const isLoopbackHost = (hostname) => {
        const h = hostname.toLowerCase();
        if (h === "localhost" || h === "::1")
            return true;
        if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(h))
            return false;
        const first = Number(h.split(".")[0]);
        return first === 127;
    };
    const allowedOriginSet = new Set(corsOrigins
        .map((o) => tryParseOrigin(o))
        .filter((o) => Boolean(o)));
    const corsAllowedLabels = corsOrigins.join(", ") || "(aucune)";
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            let url;
            try {
                url = new URL(origin);
            }
            catch {
                console.warn(`[CORS] Origin invalide: ${origin} | Origines autorisees: ${corsAllowedLabels}`);
                return callback(null, false);
            }
            if (!isProd &&
                (url.protocol === "http:" || url.protocol === "https:") &&
                isLoopbackHost(url.hostname)) {
                return callback(null, true);
            }
            const key = url.origin;
            if (allowedOriginSet.has(key)) {
                return callback(null, true);
            }
            console.warn(`[CORS] Origin bloquee: ${origin} | Origines autorisees: ${corsAllowedLabels}`);
            return callback(null, false);
        },
        credentials: false,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        exposedHeaders: [
            "X-Response-Time",
            "X-RateLimit-Limit",
            "X-RateLimit-Remaining",
            "X-RateLimit-Reset",
            "Retry-After",
        ],
    });
    app.enableShutdownHooks();
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new paginated_response_status_interceptor_1.PaginatedResponseStatusInterceptor());
    const swaggerEnabled = process.env.SWAGGER_ENABLED
        ? process.env.SWAGGER_ENABLED === "true"
        : !isProd;
    if (swaggerEnabled) {
        (0, setup_swagger_1.setupSwagger)(app);
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: true,
        stopAtFirstError: false,
        exceptionFactory: (errors) => new common_1.UnprocessableEntityException((0, response_util_1.validationErrorResponse)((0, validation_util_1.extractValidationMessages)(errors))),
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get("/", (_req, res) => {
        if (swaggerEnabled) {
            res.redirect(`/${swagger_tags_1.SWAGGER_PATH}`);
            return;
        }
        return res.status(200).json({ success: true, message: "OK" });
    });
    const port = process.env.PORT ?? 5000;
    await app.listen(port);
    (0, startup_banner_1.printStartupBanner)({
        port,
        environment: process.env.NODE_ENV ?? "development",
        swaggerEnabled,
    });
}
void bootstrap();
//# sourceMappingURL=main.js.map