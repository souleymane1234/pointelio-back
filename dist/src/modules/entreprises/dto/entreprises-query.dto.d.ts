import { StatutEntreprise } from "@prisma/client";
export declare class EntreprisesQueryDto {
    page?: number;
    per_page?: number;
    search?: string;
    statut?: StatutEntreprise;
    packId?: number;
}
