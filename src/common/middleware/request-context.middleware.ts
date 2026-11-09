import { randomUUID } from "node:crypto";
import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { runWithRequestStore } from "../context/request-store";
import { resolveClientIp } from "../utils/client-ip.util";

/**
 * Ouvre le contexte de requête (ip, requestId) lu par l'audit et l'extension
 * tenant, sans que chaque service ait à transporter la requête.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerRequestId = req.headers["x-request-id"];
    const requestId =
      (typeof headerRequestId === "string" && headerRequestId.trim()) ||
      randomUUID();

    res.setHeader("x-request-id", requestId);

    runWithRequestStore({ ip: resolveClientIp(req), requestId }, () => next());
  }
}
