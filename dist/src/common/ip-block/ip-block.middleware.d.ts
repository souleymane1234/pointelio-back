import { NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { IpBlockService } from "./ip-block.service";
export declare class IpBlockMiddleware implements NestMiddleware {
    private readonly ipBlockService;
    private readonly logger;
    constructor(ipBlockService: IpBlockService);
    use(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
}
