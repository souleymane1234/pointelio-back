export declare const ANOMALIE: {
    readonly HORS_ZONE: "HORS_ZONE";
    readonly A_VERIFIER: "A_VERIFIER";
    readonly RETARD: "RETARD";
    readonly OUBLI_DEPART: "OUBLI_DEPART";
};
export type AnomalieType = (typeof ANOMALIE)[keyof typeof ANOMALIE];
export declare const ANOMALIE_VALUES: readonly AnomalieType[];
