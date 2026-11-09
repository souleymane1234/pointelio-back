import type { Prisma } from "@prisma/client";
export declare const PACK_SELECT: {
    id: true;
    code: true;
    nom: true;
    prixMensuel: true;
    description: true;
    maxEmployes: true;
    maxSites: true;
    essaiJours: true;
    modules: true;
    ordre: true;
    actif: true;
    createdAt: true;
    updatedAt: true;
    _count: {
        select: {
            entreprises: true;
        };
    };
};
type PackRow = Prisma.PackGetPayload<{
    select: typeof PACK_SELECT;
}>;
export declare function normalizePack(row: PackRow): {
    modules: import("../../../common/constants/pack-modules.constants").PackModule[];
    entreprisesCount: number;
    id: number;
    nom: string;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    prixMensuel: number;
    description: string | null;
    maxEmployes: number | null;
    maxSites: number | null;
    essaiJours: number;
    ordre: number;
    actif: boolean;
};
export {};
