import { Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { VersionConfig } from "../interfaces/version.interface";
import { checkAppVersion } from "../utils/version.util";
import { normalizeLocale, translate } from "../i18n";
import {
  validationErrorResponse,
  upgradeRequiredResponse,
} from "../utils/response.util";

@Injectable()
export class VersionCheckMiddleware implements NestMiddleware {
  private readonly ENABLED: boolean;
  private readonly bypassKey: string;
  private readonly config: VersionConfig;

  constructor() {
    const envValue = process.env.VERSION_CHECK_ENABLED;
    this.ENABLED = envValue === "1" || envValue === "true";
    this.bypassKey = String(process.env.VERSION_CHECK_BYPASS_KEY || "").trim();

    // Versions strictes : uniquement celles renseignées dans .env sont autorisées.
    const iosAllowed =
      String(process.env.IOS_MIN_VERSION || "").trim() || "1.0.0";
    const androidAllowed =
      String(process.env.ANDROID_MIN_VERSION || "").trim() || "1.0.0";

    this.config = {
      ios: {
        current_version: iosAllowed,
        min_version: iosAllowed,
      },
      android: {
        current_version: androidAllowed,
        min_version: androidAllowed,
      },
    };
  }

  private hasValidBypassKey(req: Request): boolean {
    if (!this.bypassKey) return false;
    const provided = String(
      req.headers["bypass-update-key"] ??
        req.headers["x-version-bypass-key"] ??
        "",
    ).trim();
    return provided.length > 0 && provided === this.bypassKey;
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Si le middleware est désactivé, passer immédiatement
    if (!this.ENABLED) {
      return next();
    }

    // Clé secrète valide → bypass complet de la vérif de mise à jour
    if (this.hasValidBypassKey(req)) {
      return next();
    }

    const path =
      req.path ||
      (req.originalUrl && req.originalUrl.split("?")[0]) ||
      req.url.split("?")[0];
    if (path.includes("/auth/admin/login/decision")) {
      return next();
    }

    const locale = normalizeLocale(req.headers["language"] as string);
    const platform = String(req.headers["app-mobile-platform"] ?? "").trim();
    const version = String(req.headers["app-mobile-version"] ?? "").trim();

    // Site web / clients non-mobiles : pas de force-update (toujours la dernière build).
    // La vérif ne s'applique qu'aux apps iOS / Android.
    if (!platform || platform === "web") {
      return next();
    }

    if (platform !== "ios" && platform !== "android") {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json(
          validationErrorResponse(
            [translate(locale, "invalidPlatform", { value: platform })],
            undefined,
            locale,
          ),
        );
    }

    if (!version) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json(
          validationErrorResponse(
            [translate(locale, "versionHeaderRequired")],
            undefined,
            locale,
          ),
        );
    }

    const cleanPlatform = platform;
    const cleanVersion = version;

    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(cleanVersion)) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(
        validationErrorResponse(
          [
            translate(locale, "invalidVersionFormat", {
              value: cleanVersion,
            }),
          ],
          undefined,
          locale,
        ),
      );
    }

    // Vérifier la version (égalité stricte avec *_MIN_VERSION)
    const checkResult = checkAppVersion(
      cleanPlatform,
      cleanVersion,
      false,
      this.config,
      false,
      req.headers["language"] as string,
    );

    if (checkResult.shouldBlock) {
      const platformConfig = this.config[cleanPlatform];
      return res
        .status(HttpStatus.GONE)
        .json(
          upgradeRequiredResponse(
            cleanPlatform,
            platformConfig.min_version,
            platformConfig.current_version,
            checkResult.can_bypass,
            checkResult.message,
            locale,
          ),
        );
    }

    next();
  }
}
