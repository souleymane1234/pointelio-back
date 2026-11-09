import { CreateUserDto } from "./dto/create-user.dto";
import { MotifRhDto, ReaffecterEmployeDto } from "./dto/rh-actions.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersQueryDto } from "./dto/users-query.dto";
import { UtilisateursService } from "./services/utilisateurs.service";
import { type AuthedRequest } from "../../common/types/request-context";
export declare class UtilisateursController {
    private readonly usersService;
    constructor(usersService: UtilisateursService);
    findAll(req: AuthedRequest, query: UsersQueryDto): Promise<import("../../common/interfaces/response.interface").PaginatedResponse<{
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
    }>>;
    create(req: AuthedRequest, dto: CreateUserDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    findOne(req: AuthedRequest, id: number): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    update(req: AuthedRequest, id: number, dto: UpdateUserDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    reaffecter(req: AuthedRequest, id: number, dto: ReaffecterEmployeDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    suspendre(req: AuthedRequest, id: number, dto?: MotifRhDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    reactiver(req: AuthedRequest, id: number): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
    renvoyer(req: AuthedRequest, id: number, dto?: MotifRhDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    }>>;
}
