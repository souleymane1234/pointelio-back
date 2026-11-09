import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
export declare class IpBlockService {
    private readonly config;
    private readonly logger;
    private readonly rules;
    constructor(config: ConfigService);
    isEnabled(): boolean;
    hasRules(): boolean;
    getClientIp(req: Request): string | undefined;
    isBlocked(ip: string | undefined): boolean;
    private parseRules;
    private parseRule;
    private normalizeIp;
    private ipv4ToNumber;
}
