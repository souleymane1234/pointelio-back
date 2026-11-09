import { ApiProperty } from "@nestjs/swagger";
import { StatutEntreprise } from "@prisma/client";
import { PACK_MODULE_VALUES } from "../../../common/constants/pack-modules.constants";

class EntitlementsPackSchemaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "STARTER" })
  code: string;

  @ApiProperty({ example: "Starter" })
  nom: string;
}

class EntitlementsLimitesSchemaDto {
  @ApiProperty({ type: Number, nullable: true, example: 10 })
  maxEmployes: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 1 })
  maxSites: number | null;
}

class EntitlementsUsageSchemaDto {
  @ApiProperty({ example: 7 })
  employes: number;

  @ApiProperty({ example: 1 })
  sites: number;
}

export class EntitlementsSchemaDto {
  @ApiProperty({ example: 1 })
  entrepriseId: number;

  @ApiProperty({ enum: StatutEntreprise })
  statut: StatutEntreprise;

  @ApiProperty({ type: Date, nullable: true })
  dateEcheance: Date | null;

  @ApiProperty({ type: EntitlementsPackSchemaDto })
  pack: EntitlementsPackSchemaDto;

  @ApiProperty({
    type: EntitlementsLimitesSchemaDto,
    description: "null = illimité. Sans MULTI_SITES, maxSites vaut 1.",
  })
  limites: EntitlementsLimitesSchemaDto;

  @ApiProperty({ enum: PACK_MODULE_VALUES, isArray: true })
  modules: string[];

  @ApiProperty({ type: EntitlementsUsageSchemaDto })
  usage: EntitlementsUsageSchemaDto;
}

export class EntitlementsResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: "Droits récupérés avec succès" })
  message: string;

  @ApiProperty({
    type: EntitlementsSchemaDto,
    nullable: true,
    description: "null pour l'équipe Pointelio (aucune entreprise).",
  })
  data: EntitlementsSchemaDto | null;
}
