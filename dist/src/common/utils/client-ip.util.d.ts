import type { Request } from "express";
export declare function resolveClientIp(req: Request): string | undefined;
export declare function normalizeIp(raw: string | undefined): string | undefined;
export declare function isPublicIp(ip: string): boolean;
