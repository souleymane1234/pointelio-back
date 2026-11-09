import { ProfileService } from "./profile.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { type AuthedRequest } from "../../common/types/request-context";
export declare class ProfileController {
    private readonly profileService;
    private readonly logger;
    constructor(profileService: ProfileService);
    me(req: AuthedRequest): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        unreadNotificationsCount: number;
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
        derniereConnexion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        entreprise: {
            id: number;
            raisonSociale: string;
            nomCommercial: string | null;
        } | null;
        site: {
            id: number;
            nom: string;
        } | null;
    }>>;
    updateMe(req: AuthedRequest, dto: UpdateProfileDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
        derniereConnexion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        entreprise: {
            id: number;
            raisonSociale: string;
            nomCommercial: string | null;
        } | null;
        site: {
            id: number;
            nom: string;
        } | null;
    }>>;
    changePassword(req: AuthedRequest, dto: ChangePasswordDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<null>>;
}
