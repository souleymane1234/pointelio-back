import { EntrepriseProfilFieldsDto } from "./entreprise-fields.dto";
export declare class UpdateEntrepriseDto extends EntrepriseProfilFieldsDto {
    raisonSociale?: string;
    notesInternes?: string | null;
}
export declare class UpdateProfilEntrepriseDto extends EntrepriseProfilFieldsDto {
}
export declare class MotifDto {
    motif?: string;
}
