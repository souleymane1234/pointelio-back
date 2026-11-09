import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response.util";
import { IpBlockService } from "./ip-block.service";

@Injectable()
export class IpBlockMiddleware implements NestMiddleware {
  private readonly logger = new Logger(IpBlockMiddleware.name);

  constructor(private readonly ipBlockService: IpBlockService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!this.ipBlockService.isEnabled() || !this.ipBlockService.hasRules()) {
      return next();
    }

    const ip = this.ipBlockService.getClientIp(req);

    if (!this.ipBlockService.isBlocked(ip)) {
      return next();
    }

    const path =
      req.path ||
      (req.originalUrl && req.originalUrl.split("?")[0]) ||
      req.url.split("?")[0];

    this.logger.warn(`${req.method} ${path} blocked for IP ${ip}`);

    return res.status(403).json(errorResponse("Your IP address is blocked."));
  }
}
