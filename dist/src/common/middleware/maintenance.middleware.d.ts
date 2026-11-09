import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class MaintenanceMiddleware implements NestMiddleware {
    private readonly MAINTENANCE_ENABLED;
    use(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
}
