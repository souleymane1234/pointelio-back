export type JourHoraire = {
    jour: number;
    heureDebut: string;
    heureFin: string;
};
export declare function parseHorairesJours(value: unknown): JourHoraire[];
export declare function horaireDuJour(jours: JourHoraire[], isoWeekday: number): JourHoraire | null;
export declare function hasDuplicateJours(jours: {
    jour: number;
}[]): boolean;
