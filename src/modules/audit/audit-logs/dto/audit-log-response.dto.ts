import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { PaginationMetaSchemaDto } from "../../../../common/dto/pagination-response.dto";
import { AUDIT_ACTIONS } from "../../shared/audit-actions.constants";

export class AuditLogActeurSchemaDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: "Koné" })
  nom: string;

  @ApiProperty({ example: "Awa" })
  prenom: string;

  @ApiProperty({ required: false, nullable: true, example: "awa@acme.ci" })
  email: string | null;
}

export class AuditLogSchemaDto {
  @ApiProperty({ example: "1024", description: "BigInt sérialisé en texte." })
  id: string;

  @ApiProperty({ required: false, nullable: true, example: 1 })
  entrepriseId: number | null;

  @ApiProperty({ required: false, nullable: true, example: 3 })
  acteurId: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: AuditLogActeurSchemaDto,
    description: "Utilisateur auteur de l'action.",
  })
  acteur: AuditLogActeurSchemaDto | null;

  @ApiProperty({ example: AUDIT_ACTIONS.ROLE_MODIFIE })
  action: string;

  @ApiProperty({ required: false, nullable: true, example: "UTILISATEUR" })
  objet: string | null;

  @ApiProperty({ required: false, nullable: true, example: "12" })
  objetId: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Object,
    description: "Données contextuelles variables selon `action` / `objet`.",
  })
  details: Record<string, unknown> | null;

  @ApiProperty({ required: false, nullable: true, example: "196.168.1.42" })
  ip: string | null;

  @ApiProperty({ example: "OK" })
  resultat: string;

  @ApiProperty({ example: "2026-05-22T08:15:00.000Z" })
  createdAt: Date;
}

@ApiExtraModels(
  AuditLogActeurSchemaDto,
  AuditLogSchemaDto,
  PaginationMetaSchemaDto,
)
export class AuditLogsPaginatedResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: "Logs d'audit récupérés avec succès" })
  message: string;

  @ApiProperty({ type: [AuditLogSchemaDto] })
  data: AuditLogSchemaDto[];

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}
