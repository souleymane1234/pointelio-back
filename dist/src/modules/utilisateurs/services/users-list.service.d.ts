import type { AuthUser } from "../../../common/types/request-context";
import { type Locale } from "../../../common/i18n";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import type { UsersQueryDto } from "../dto/users-query.dto";
import { AdminUsersCacheService } from "./admin-users-cache.service";
import { UserScopeService } from "./user-scope.service";
export declare class UsersListService {
    private readonly prisma;
    private readonly adminUsersCache;
    private readonly scope;
    constructor(prisma: PrismaService, adminUsersCache: AdminUsersCacheService, scope: UserScopeService);
    findAll(actor: AuthUser, query: UsersQueryDto): Promise<{
        data: {
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
        }[];
        pagination: {
            current_page: number;
            total_pages: number;
            per_page: number;
            total_items: number;
        };
    }>;
    private computeFindAll;
    findOne(actor: AuthUser, id: number, locale: Locale): Promise<{
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
    private computeFindOne;
}
