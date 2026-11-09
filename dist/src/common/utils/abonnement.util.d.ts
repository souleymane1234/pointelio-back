import { StatutEntreprise } from "@prisma/client";
export declare function isAbonnementBloque(statut: StatutEntreprise, dateEcheance: Date | null, now?: Date): boolean;
