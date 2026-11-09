import type { AuthedRequest } from "../../common/types/request-context";
import { EntitlementsService } from "./entitlements.service";
export declare class EntitlementsController {
    private readonly entitlements;
    constructor(entitlements: EntitlementsService);
    mine(req: AuthedRequest): Promise<import("../../common/interfaces/response.interface").SuccessResponse<{
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
    } | null>>;
}
