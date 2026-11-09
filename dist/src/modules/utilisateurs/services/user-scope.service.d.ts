import { UnprocessableEntityException } from "@nestjs/common";
import type { Role } from "@prisma/client";
import type { AuthUser } from "../../../common/types/request-context";
import { type Locale } from "../../../common/i18n";
import type { MessageKey } from "../../../common/i18n/translate";
import { PrismaService } from "../../../infra/prisma/prisma.service";
export declare class UserScopeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    scopedEntrepriseId(actor: AuthUser): number | null;
    assertInScope(actor: AuthUser, target: {
        entrepriseId: number | null;
    }, locale: Locale): void;
    assertCanAssignRole(actor: AuthUser, role: Role): void;
    resolveEntrepriseId(actor: AuthUser, role: Role, requested: number | null | undefined, locale: Locale): number | null;
    assertRattachement(entrepriseId: number | null, refs: {
        siteId?: number | null;
        horaireId?: number | null;
    }, locale: Locale): Promise<void>;
    invalid(key: MessageKey, locale: Locale): UnprocessableEntityException;
}
