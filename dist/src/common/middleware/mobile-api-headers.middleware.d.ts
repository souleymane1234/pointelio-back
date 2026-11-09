import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class MobileApiHeadersMiddleware implements NestMiddleware {
    private readonly logger;
    use(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
    private hasMatchingRoute;
    private stackHasMatch;
    private isCatchAllRoutePath;
    private isDocsOrOpenApiPath;
    private isAdminLoginDecisionPath;
    private isUploadMultipartPath;
    private isAcceptHeaderValid;
}
