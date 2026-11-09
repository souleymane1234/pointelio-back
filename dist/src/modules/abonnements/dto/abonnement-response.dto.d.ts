import { EntitlementsSchemaDto } from "../../entitlements/dto/entitlements-response.dto";
export declare class AbonnementSchemaDto extends EntitlementsSchemaDto {
    dateDemarrage: Date | null;
    prixMensuel: number;
    bloque: boolean;
}
export declare class AbonnementResponseSchemaDto {
    success: true;
    message: string;
    data: AbonnementSchemaDto;
}
