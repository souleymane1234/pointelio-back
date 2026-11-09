import type { Role, StatutEntreprise } from "@prisma/client";
import type { Request } from "express";
import type { Locale } from "../i18n";
export type AuthUser = {
    id: number;
    role: Role;
    entrepriseId: number | null;
};
export type TenantContext = {
    entrepriseId: number;
    statut: StatutEntreprise;
    dateEcheance: Date | null;
};
export type AuthedRequest = Request & {
    locale?: Locale;
    user?: AuthUser;
    tenant?: TenantContext;
};
export declare function getUserId(req: {
    user?: Partial<AuthUser>;
}): number | undefined;
export declare function requireUserId(req: {
    user?: Partial<AuthUser>;
}): number;
export declare function requireTenant(req: Pick<AuthedRequest, "tenant">): TenantContext;
export declare function requireUser(req: Pick<AuthedRequest, "user">): AuthUser;
