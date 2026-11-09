import { EntrepriseProfilFieldsDto } from "./entreprise-fields.dto";
export declare class EntrepriseAdminDto {
    nom: string;
    prenom: string;
    email: string;
    password: string;
}
export declare const STATUTS_CREATION: readonly ["ESSAI", "ACTIF"];
export declare class CreateEntrepriseDto extends EntrepriseProfilFieldsDto {
    raisonSociale: string;
    packId: number;
    statut?: (typeof STATUTS_CREATION)[number];
    dateEcheance?: string;
    notesInternes?: string;
    admin?: EntrepriseAdminDto;
}
