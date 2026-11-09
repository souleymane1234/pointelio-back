import { ValidationPipe, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { json, urlencoded } from "express";
import type { Request, Response } from "express";
import { setupSwagger } from "./common/swagger/setup-swagger";
import { SWAGGER_PATH } from "./common/swagger/swagger-tags";
import helmet from "helmet";
import type Redis from "ioredis";
import { AppModule } from "./app.module";
import {
  createHealthHandlers,
  HEALTH_LIVE_PATH,
  HEALTH_READY_PATH,
} from "./modules/health/health.handlers";
import { PrismaService } from "./infra/prisma/prisma.service";
import { REDIS_OTP } from "./infra/redis/redis-otp.constants";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { PaginatedResponseStatusInterceptor } from "./common/interceptors/paginated-response-status.interceptor";
import { extractValidationMessages } from "./common/utils/validation.util";
import { validationErrorResponse } from "./common/utils/response.util";
import { RedisIoAdapter } from "./infra/socket/adapters/redis-io.adapter";
import { printStartupBanner } from "./common/banner/startup-banner";

const BASE64_UPLOAD_PATH = "/api/v1/uploads/content/base64";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const health = createHealthHandlers({
    prisma: app.get(PrismaService),
    redis: app.get<Redis | null>(REDIS_OTP, { strict: false }),
  });
  app.use(HEALTH_LIVE_PATH, health.live);
  app.use(HEALTH_READY_PATH, health.ready);
  process.once("SIGTERM", health.markShuttingDown);

  const redisUrl = app.get(ConfigService).get<string>("REDIS_URL")?.trim();
  if (redisUrl) {
    const ioAdapter = new RedisIoAdapter(app);
    try {
      await ioAdapter.connectToRedis(redisUrl);
      app.useWebSocketAdapter(ioAdapter);
    } catch (error) {
      console.error(
        `[Socket.IO] Redis adapter unavailable, events stay local to this instance: ${String(error)}`,
      );
    }
  }

  // Seul l'upload base64 transporte de gros fichiers (vidéo ≤ 50 Mo ≈ 70 Mo encodés).
  const jsonBodyLimit = process.env.HTTP_JSON_BODY_LIMIT || "1mb";
  const base64UploadBodyLimit =
    process.env.HTTP_BASE64_UPLOAD_BODY_LIMIT || "70mb";
  app.use(BASE64_UPLOAD_PATH, json({ limit: base64UploadBodyLimit }));
  app.use(json({ limit: jsonBodyLimit }));
  app.use(urlencoded({ limit: jsonBodyLimit, extended: true }));

  const isProd = process.env.NODE_ENV === "production";

  if (process.env.TRUST_PROXY === "1" || process.env.TRUST_PROXY === "true") {
    app.getHttpAdapter().getInstance().set("trust proxy", 1);
  }

  // Set global prefix
  app.setGlobalPrefix("api/v1");

  // Security headers baseline (Express via Helmet).
  app.use(
    helmet({
      contentSecurityPolicy: false, // API only (no HTML responses)
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
    }),
  );

  // CORS: production = allowlist only. Dev = allowlist + tout loopback http(s) (n'importe quel port).
  const corsOriginsEnv = process.env.CORS_ORIGINS ?? "";
  const corsOrigins = corsOriginsEnv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const tryParseOrigin = (raw: string): string | null => {
    try {
      return new URL(raw).origin;
    } catch {
      return null;
    }
  };

  const isLoopbackHost = (hostname: string): boolean => {
    const h = hostname.toLowerCase();
    if (h === "localhost" || h === "::1") return true;
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return false;
    const first = Number(h.split(".")[0]);
    return first === 127;
  };

  const allowedOriginSet = new Set(
    corsOrigins
      .map((o) => tryParseOrigin(o))
      .filter((o): o is string => Boolean(o)),
  );

  const corsAllowedLabels = corsOrigins.join(", ") || "(aucune)";

  app.enableCors({
    origin: (origin, callback) => {
      // Non-browser requests (curl/postman) -> no Origin header.
      if (!origin) return callback(null, true);

      let url: URL;
      try {
        url = new URL(origin);
      } catch {
        console.warn(
          `[CORS] Origin invalide: ${origin} | Origines autorisees: ${corsAllowedLabels}`,
        );
        return callback(null, false);
      }

      if (
        !isProd &&
        (url.protocol === "http:" || url.protocol === "https:") &&
        isLoopbackHost(url.hostname)
      ) {
        return callback(null, true);
      }

      const key = url.origin;
      if (allowedOriginSet.has(key)) {
        return callback(null, true);
      }
      console.warn(
        `[CORS] Origin bloquee: ${origin} | Origines autorisees: ${corsAllowedLabels}`,
      );
      return callback(null, false);
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // No fixed allowedHeaders: cors echoes Access-Control-Request-Headers on preflight
    // (avoids blocking legitimate custom headers; e.g. language, mobile app headers).
    exposedHeaders: [
      "X-Response-Time",
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
      "Retry-After",
    ],
  });

  // Graceful shutdown for better scaling / rollouts.
  app.enableShutdownHooks();

  // Log response time (MS) for all routes
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new PaginatedResponseStatusInterceptor(),
  );

  // Swagger configuration (disable in production by default).
  const swaggerEnabled = process.env.SWAGGER_ENABLED
    ? process.env.SWAGGER_ENABLED === "true"
    : !isProd;

  if (swaggerEnabled) {
    setupSwagger(app);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          validationErrorResponse(extractValidationMessages(errors)),
        ),
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // Redirect root to Swagger docs (only when enabled).
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get("/", (_req: Request, res: Response) => {
    if (swaggerEnabled) {
      res.redirect(`/${SWAGGER_PATH}`);
      return;
    }
    return res.status(200).json({ success: true, message: "OK" });
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);

  printStartupBanner({
    port,
    environment: process.env.NODE_ENV ?? "development",
    swaggerEnabled,
  });
}
void bootstrap();
