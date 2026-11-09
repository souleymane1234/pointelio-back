import type { AuthUser } from "../../../common/types/request-context";
import { type Locale } from "../../../common/i18n";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import type { CreateUserDto } from "../dto/create-user.dto";
import { EntitlementsService } from "../../entitlements/entitlements.service";
import { UserIdentifiersService } from "./user-identifiers.service";
import { UserScopeService } from "./user-scope.service";
export declare class UsersCreateService {
    private readonly prisma;
    private readonly scope;
    private readonly identifiers;
    private readonly entitlements;
    constructor(prisma: PrismaService, scope: UserScopeService, identifiers: UserIdentifiersService, entitlements: EntitlementsService);
    create(actor: AuthUser, dto: CreateUserDto, locale: Locale): Promise<{
        fullName: string;
        hasPassword: boolean;
        telephone: string | null;
        email: string | null;
        id: number;
        entrepriseId: number | null;
        siteId: number | null;
        horaireId: number | null;
        matricule: string | null;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        statut: import("@prisma/client").$Enums.StatutCompte;
        poste: string | null;
        salaireJournalier: number | null;
        dateEmbauche: Date | null;
        photoUrl: string | null;
        mfaActif: boolean;
        derniereConnexion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        entreprise: {
            id: number;
            raisonSociale: string;
        } | null;
        site: {
            id: number;
            nom: string;
        } | null;
        horaire: {
            id: number;
            nom: string;
        } | null;
    }>;
}
