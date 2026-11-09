import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class MobileApiHeadersGuard implements CanActivate {
    private readonly logger;
    canActivate(context: ExecutionContext): boolean;
    private isDocsOrOpenApiPath;
    private isAcceptHeaderExemptPath;
    private isAcceptHeaderValid;
}
