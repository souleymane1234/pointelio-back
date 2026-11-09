import { type AuthedRequest } from "../../common/types/request-context";
import { UpdateProfilEntrepriseDto } from "./dto/update-entreprise.dto";
import { ProfilEntrepriseService } from "./profil-entreprise.service";
export declare class ProfilEntrepriseController {
    private readonly profil;
    constructor(profil: ProfilEntrepriseService);
    get(req: AuthedRequest): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        id: number;
        statut: import("@prisma/client").$Enums.StatutEntreprise;
        createdAt: Date;
        updatedAt: Date;
        pack: {
            id: number;
            nom: string;
            code: string;
        };
        raisonSociale: string;
        nomCommercial: string | null;
        secteur: string | null;
        pays: string;
        ville: string | null;
        adresse: string | null;
        identifiantLegal: string | null;
        contactNom: string | null;
        contactFonction: string | null;
        contactEmail: string | null;
        contactTel: string | null;
        fuseauHoraire: string;
        dateDemarrage: Date | null;
        dateEcheance: Date | null;
        profilComplete: boolean;
    }>>;
    update(req: AuthedRequest, dto: UpdateProfilEntrepriseDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        id: number;
        statut: import("@prisma/client").$Enums.StatutEntreprise;
        createdAt: Date;
        updatedAt: Date;
        pack: {
            id: number;
            nom: string;
            code: string;
        };
        raisonSociale: string;
        nomCommercial: string | null;
        secteur: string | null;
        pays: string;
        ville: string | null;
        adresse: string | null;
        identifiantLegal: string | null;
        contactNom: string | null;
        contactFonction: string | null;
        contactEmail: string | null;
        contactTel: string | null;
        fuseauHoraire: string;
        dateDemarrage: Date | null;
        dateEcheance: Date | null;
        profilComplete: boolean;
    }>>;
    private locale;
}
