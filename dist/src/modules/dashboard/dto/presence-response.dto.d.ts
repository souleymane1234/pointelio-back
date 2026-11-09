import { StatutValidation, TypePointage } from "@prisma/client";
export declare class PresencePointageSchemaDto {
    id: string;
    type: TypePointage;
    heureServeur: Date;
    statutValidation: StatutValidation;
    retardMinutes: number | null;
}
export declare class PresenceEmployeSchemaDto {
    employeId: number;
    nom: string;
    prenom: string;
    matricule: string | null;
    siteId: number;
    siteNom: string;
    jourOuvre: boolean;
    heureDebut: string | null;
    heureFin: string | null;
    toleranceMin: number | null;
    arrivee: PresencePointageSchemaDto | null;
    depart: PresencePointageSchemaDto | null;
    enRetard: boolean;
    paieValidee: boolean;
    salaireJournalier: number | null;
    montantJour: number;
}
export declare class PresenceJourSchemaDto {
    date: string;
    effectif: number;
    presents: number;
    retards: number;
    paiesValidees: number;
    masseSalarialeJour: number;
    employes: PresenceEmployeSchemaDto[];
}
export declare class PresenceResponseSchemaDto {
    success: true;
    message: string;
    data: PresenceJourSchemaDto;
}
