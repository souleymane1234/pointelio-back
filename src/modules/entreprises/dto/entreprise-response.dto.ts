import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { StatutEntreprise } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";

class EntreprisePackRefSchemaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "STARTER" })
  code: string;

  @ApiProperty({ example: "Starter" })
  nom: string;
}

export class EntrepriseProfilSchemaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "ACME Côte d'Ivoire SARL" })
  raisonSociale: string;

  @ApiProperty({ type: String, nullable: true })
  nomCommercial: string | null;

  @ApiProperty({ type: String, nullable: true })
  secteur: string | null;

  @ApiProperty({ example: "CI" })
  pays: string;

  @ApiProperty({ type: String, nullable: true })
  ville: string | null;

  @ApiProperty({ type: String, nullable: true })
  adresse: string | null;

  @ApiProperty({ type: String, nullable: true })
  identifiantLegal: string | null;

  @ApiProperty({ type: String, nullable: true })
  contactNom: string | null;

  @ApiProperty({ type: String, nullable: true })
  contactFonction: string | null;

  @ApiProperty({ type: String, nullable: true })
  contactEmail: string | null;

  @ApiProperty({ type: String, nullable: true })
  contactTel: string | null;

  @ApiProperty({ example: "Africa/Abidjan" })
  fuseauHoraire: string;

  @ApiProperty({ enum: StatutEntreprise })
  statut: StatutEntreprise;

  @ApiProperty({ type: Date, nullable: true })
  dateDemarrage: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  dateEcheance: Date | null;

  @ApiProperty()
  profilComplete: boolean;

  @ApiProperty({ type: EntreprisePackRefSchemaDto })
  pack: EntreprisePackRefSchemaDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class EntrepriseAdminSchemaDto extends EntrepriseProfilSchemaDto {
  @ApiProperty({ example: 1 })
  packId: number;

  @ApiProperty({ type: Number, nullable: true })
  maxSitesOverride: number | null;

  @ApiProperty({ type: Number, nullable: true })
  maxEmployesOverride: number | null;

  @ApiProperty({ type: [String], nullable: true })
  modulesOverride: string[] | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: "Invisible du client.",
  })
  notesInternes: string | null;

  @ApiProperty({ example: 12 })
  utilisateursCount: number;

  @ApiProperty({ example: 2 })
  sitesCount: number;
}

@ApiExtraModels(EntrepriseProfilSchemaDto, EntreprisePackRefSchemaDto)
export class EntrepriseProfilResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: EntrepriseProfilSchemaDto })
  data: EntrepriseProfilSchemaDto;
}

@ApiExtraModels(EntrepriseAdminSchemaDto)
export class EntrepriseResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: EntrepriseAdminSchemaDto })
  data: EntrepriseAdminSchemaDto;
}

@ApiExtraModels(EntrepriseAdminSchemaDto, PaginationMetaSchemaDto)
export class EntreprisesPaginatedResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [EntrepriseAdminSchemaDto] })
  data: EntrepriseAdminSchemaDto[];

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}
