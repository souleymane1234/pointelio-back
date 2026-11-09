import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { PACK_MODULE_VALUES } from "../../../common/constants/pack-modules.constants";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";

export class PackSchemaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "STARTER" })
  code: string;

  @ApiProperty({ example: "Starter" })
  nom: string;

  @ApiProperty({ example: 25000, description: "FCFA / mois." })
  prixMensuel: number;

  @ApiProperty({ type: String, nullable: true })
  description: string | null;

  @ApiProperty({ type: Number, nullable: true, example: 10 })
  maxEmployes: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 1 })
  maxSites: number | null;

  @ApiProperty({ example: 14 })
  essaiJours: number;

  @ApiProperty({ enum: PACK_MODULE_VALUES, isArray: true })
  modules: string[];

  @ApiProperty({ example: 1 })
  ordre: number;

  @ApiProperty({ example: true })
  actif: boolean;

  @ApiProperty({ example: 4, description: "Entreprises abonnées à ce pack." })
  entreprisesCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

@ApiExtraModels(PackSchemaDto)
export class PackResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: "Pack récupéré avec succès" })
  message: string;

  @ApiProperty({ type: PackSchemaDto })
  data: PackSchemaDto;
}

@ApiExtraModels(PackSchemaDto, PaginationMetaSchemaDto)
export class PacksPaginatedResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: "Packs récupérés avec succès" })
  message: string;

  @ApiProperty({ type: [PackSchemaDto] })
  data: PackSchemaDto[];

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}
