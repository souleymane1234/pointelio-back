import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class VersionCheckMiddleware implements NestMiddleware {
    private readonly ENABLED;
    private readonly bypassKey;
    private readonly config;
    constructor();
    private hasValidBypassKey;
    use(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
}
