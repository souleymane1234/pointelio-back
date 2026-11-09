export declare const PACK_MODULES: {
    readonly QR: "QR";
    readonly GPS: "GPS";
    readonly CONGES: "CONGES";
    readonly HORAIRES_MULTIPLES: "HORAIRES_MULTIPLES";
    readonly MULTI_SITES: "MULTI_SITES";
    readonly RAPPORTS_AVANCES: "RAPPORTS_AVANCES";
    readonly ROLES_AVANCES: "ROLES_AVANCES";
    readonly SURVEILLANT: "SURVEILLANT";
};
export type PackModule = (typeof PACK_MODULES)[keyof typeof PACK_MODULES];
export declare const PACK_MODULE_VALUES: readonly PackModule[];
export declare function isPackModule(value: unknown): value is PackModule;
