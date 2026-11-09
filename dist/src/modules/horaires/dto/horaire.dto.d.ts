export declare class CreateHoraireDto {
    nom: string;
    heureDebut: string;
    heureFin: string;
    toleranceMin?: number;
    joursTravail: number[];
}
declare const UpdateHoraireDto_base: import("@nestjs/common").Type<Partial<CreateHoraireDto>>;
export declare class UpdateHoraireDto extends UpdateHoraireDto_base {
}
export {};
