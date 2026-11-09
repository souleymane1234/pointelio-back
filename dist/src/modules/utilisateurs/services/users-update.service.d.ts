import { Role, type StatutCompte } from "@prisma/client";
import type { AuthUser } from "../../../common/types/request-context";
import { type Locale } from "../../../common/i18n";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import type { UpdateUserDto } from "../dto/update-user.dto";
import { EntitlementsService } from "../../entitlements/entitlements.service";
import { UserIdentifiersService } from "./user-identifiers.service";
import { UserScopeService } from "./user-scope.service";
import { normalizeUserAdmin } from "./user-admin.select";
export type UserUpdateResult = {
    user: ReturnType<typeof normalizeUserAdmin>;
    previous: {
        role: Role;
        statut: StatutCompte;
        entrepriseId: number | null;
    };
};
export declare class UsersUpdateService {
    private readonly prisma;
    private readonly scope;
    private readonly identifiers;
    private readonly entitlements;
    constructor(prisma: PrismaService, scope: UserScopeService, identifiers: UserIdentifiersService, entitlements: EntitlementsService);
    update(actor: AuthUser, id: number, dto: UpdateUserDto, locale: Locale): Promise<UserUpdateResult>;
}
