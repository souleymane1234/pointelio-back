import { AuditActionsService } from "../../audit/recorder/services/audit-actions.service";
import type { AuthUser } from "../../../common/types/request-context";
import { type Locale } from "../../../common/i18n";
import type { CreateUserDto } from "../dto/create-user.dto";
import type { MotifRhDto, ReaffecterEmployeDto } from "../dto/rh-actions.dto";
import type { UpdateUserDto } from "../dto/update-user.dto";
import type { UsersQueryDto } from "../dto/users-query.dto";
import { UsersCreateService } from "./users-create.service";
import { UsersListService } from "./users-list.service";
import { UsersUpdateService } from "./users-update.service";
export declare class UtilisateursService {
    private readonly list;
    private readonly createSvc;
    private readonly updateSvc;
    private readonly auditActions;
    constructor(list: UsersListService, createSvc: UsersCreateService, updateSvc: UsersUpdateService, auditActions: AuditActionsService);
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
    update(actor: AuthUser, id: number, dto: UpdateUserDto, locale: Locale): Promise<{
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
    reaffecter(actor: AuthUser, id: number, dto: ReaffecterEmployeDto, locale: Locale): Promise<{
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
    suspendre(actor: AuthUser, id: number, dto: MotifRhDto, locale: Locale): Promise<{
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
    reactiver(actor: AuthUser, id: number, locale: Locale): Promise<{
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
    renvoyer(actor: AuthUser, id: number, dto: MotifRhDto, locale: Locale): Promise<{
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
    private assertNotSelf;
}
