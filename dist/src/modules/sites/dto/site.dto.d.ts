export declare class SiteJourHoraireDto {
    jour: number;
    heureDebut: string;
    heureFin: string;
}
export declare class CreateSiteDto {
    nom: string;
    adresse?: string | null;
    latitude: number;
    longitude: number;
    rayonM?: number;
    precisionMaxM?: number;
    toleranceMin?: number | null;
    horairesJours: SiteJourHoraireDto[];
}
declare const UpdateSiteDto_base: import("@nestjs/common").Type<Partial<CreateSiteDto>>;
export declare class UpdateSiteDto extends UpdateSiteDto_base {
    actif?: boolean;
}
export declare class SitesQueryDto {
    page?: number;
    per_page?: number;
    search?: string;
    actif?: boolean;
}
export {};
