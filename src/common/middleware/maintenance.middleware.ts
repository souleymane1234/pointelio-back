import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { normalizeLocale } from "../i18n";
import { maintenanceResponse } from "../utils/response.util";

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  // 0 = false, 1 = true
  private readonly MAINTENANCE_ENABLED =
    process.env.MAINTENANCE_ENABLED === "1";

  use(req: Request, res: Response, next: NextFunction) {
    if (this.MAINTENANCE_ENABLED) {
      const locale = normalizeLocale(req.headers.language as string);
      return res.status(600).json(maintenanceResponse(undefined, locale));
    }
    next();
  }
}
