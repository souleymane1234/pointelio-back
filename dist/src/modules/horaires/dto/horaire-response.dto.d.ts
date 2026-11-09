export declare class HoraireSchemaDto {
    id: number;
    entrepriseId: number;
    nom: string;
    heureDebut: string;
    heureFin: string;
    toleranceMin: number;
    joursTravail: number[];
    utilisateursCount: number;
    createdAt: Date;
}
export declare class HoraireResponseSchemaDto {
    success: true;
    message: string;
    data: HoraireSchemaDto;
}
export declare class HorairesResponseSchemaDto {
    success: true;
    message: string;
    data: HoraireSchemaDto[];
}
