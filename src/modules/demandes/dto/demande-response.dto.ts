import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { StatutDemande, TypeDemande } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";

export class DemandePersonneSchemaDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: "Traoré" })
  nom: string;

  @ApiProperty({ example: "Awa" })
  prenom: string;

  @ApiProperty({ type: String, nullable: true, example: "EMP-0042" })
  matricule: string | null;
}

export class DemandeSchemaDto {
  @ApiProperty({ example: 8 })
  id: number;

  @ApiProperty({ example: 1 })
  entrepriseId: number;

  @ApiProperty({ example: 12 })
  employeId: number;

  @ApiProperty({ enum: TypeDemande })
  type: TypeDemande;

  @ApiProperty({ example: "2026-11-02" })
  dateDebut: string;

  @ApiProperty({ example: "2026-11-06" })
  dateFin: string;

  @ApiProperty({ type: Number, nullable: true, example: 5 })
  nbJours: number | null;

  @ApiProperty({ type: String, nullable: true })
  commentaire: string | null;

  @ApiProperty({ type: String, nullable: true })
  justificatifUrl: string | null;

  @ApiProperty({ enum: StatutDemande })
  statut: StatutDemande;

  @ApiProperty({ type: Number, nullable: true })
  decideurId: number | null;

  @ApiProperty({ type: String, nullable: true })
  decisionMotif: string | null;

  @ApiProperty({ type: Date, nullable: true })
  decideAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: DemandePersonneSchemaDto })
  employe: DemandePersonneSchemaDto;

  @ApiProperty({ type: DemandePersonneSchemaDto, nullable: true })
  decideur: DemandePersonneSchemaDto | null;
}

@ApiExtraModels(DemandeSchemaDto, DemandePersonneSchemaDto)
export class DemandeResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: DemandeSchemaDto })
  data: DemandeSchemaDto;
}

@ApiExtraModels(DemandeSchemaDto, PaginationMetaSchemaDto)
export class DemandesPaginatedResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [DemandeSchemaDto] })
  data: DemandeSchemaDto[];

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}
