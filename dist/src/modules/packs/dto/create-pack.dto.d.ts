export declare class CreatePackDto {
    code: string;
    nom: string;
    prixMensuel: number;
    description?: string;
    maxEmployes?: number | null;
    maxSites?: number | null;
    essaiJours?: number;
    modules: string[];
    ordre?: number;
    actif?: boolean;
}
