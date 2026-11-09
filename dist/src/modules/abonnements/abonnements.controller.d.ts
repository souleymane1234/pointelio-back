import { type AuthedRequest } from "../../common/types/request-context";
import { AbonnementsService } from "./abonnements.service";
import { UpdateAbonnementDto } from "./dto/update-abonnement.dto";
export declare class AbonnementsController {
    private readonly abonnements;
    constructor(abonnements: AbonnementsService);
    mine(req: AuthedRequest): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        dateDemarrage: Date | null;
        prixMensuel: number;
        bloque: boolean;
        usage: {
            employes: number;
            sites: number;
        };
        entrepriseId: number;
        statut: import("@prisma/client").StatutEntreprise;
        dateEcheance: Date | null;
        pack: {
            id: number;
            code: string;
            nom: string;
        };
        limites: {
            maxEmployes: number | null;
            maxSites: number | null;
        };
        modules: import("../../common/constants/pack-modules.constants").PackModule[];
    }>>;
    get(req: AuthedRequest, id: number): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        dateDemarrage: Date | null;
        prixMensuel: number;
        bloque: boolean;
        usage: {
            employes: number;
            sites: number;
        };
        entrepriseId: number;
        statut: import("@prisma/client").StatutEntreprise;
        dateEcheance: Date | null;
        pack: {
            id: number;
            code: string;
            nom: string;
        };
        limites: {
            maxEmployes: number | null;
            maxSites: number | null;
        };
        modules: import("../../common/constants/pack-modules.constants").PackModule[];
    }>>;
    update(req: AuthedRequest, id: number, dto: UpdateAbonnementDto): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
        dateDemarrage: Date | null;
        prixMensuel: number;
        bloque: boolean;
        usage: {
            employes: number;
            sites: number;
        };
        entrepriseId: number;
        statut: import("@prisma/client").StatutEntreprise;
        dateEcheance: Date | null;
        pack: {
            id: number;
            code: string;
            nom: string;
        };
        limites: {
            maxEmployes: number | null;
            maxSites: number | null;
        };
        modules: import("../../common/constants/pack-modules.constants").PackModule[];
    }>>;
    private locale;
}
