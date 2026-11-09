import { StatutEntreprise } from "@prisma/client";
export type CycleAction = "suspendre" | "reactiver" | "cloturer";
export declare function nextStatut(action: CycleAction, current: StatutEntreprise): StatutEntreprise | null;
