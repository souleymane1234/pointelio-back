import { ApiProperty } from "@nestjs/swagger";
import { EntitlementsSchemaDto } from "../../entitlements/dto/entitlements-response.dto";

export class AbonnementSchemaDto extends EntitlementsSchemaDto {
  @ApiProperty({ type: Date, nullable: true })
  dateDemarrage: Date | null;

  @ApiProperty({ example: 25000, description: "FCFA / mois (prix du pack)." })
  prixMensuel: number;

  @ApiProperty({
    description: "Abonnement suspendu, résilié ou essai échu : accès bloqué.",
  })
  bloque: boolean;
}

export class AbonnementResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: "Abonnement récupéré avec succès" })
  message: string;

  @ApiProperty({ type: AbonnementSchemaDto })
  data: AbonnementSchemaDto;
}
