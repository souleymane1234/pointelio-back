import { Role, StatutCompte } from "@prisma/client";
export declare class UsersQueryDto {
    page?: number;
    per_page?: number;
    search?: string;
    statut?: StatutCompte;
    role?: Role;
    entrepriseId?: number;
    siteId?: number;
}
