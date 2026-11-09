import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
} from "../../shared/audit-actions.constants";

export class AuditLogsQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  per_page?: number;

  @ApiPropertyOptional({ enum: Object.values(AUDIT_ACTIONS) })
  @IsOptional()
  @IsIn(Object.values(AUDIT_ACTIONS))
  action?: string;

  @ApiPropertyOptional({ enum: Object.values(AUDIT_OBJETS) })
  @IsOptional()
  @IsIn(Object.values(AUDIT_OBJETS))
  objet?: string;

  @ApiPropertyOptional({ example: "12" })
  @IsOptional()
  @IsString()
  objetId?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  acteurId?: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      "Filtre par entreprise (équipe Pointelio uniquement ; ignoré pour les admins d'entreprise).",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  entrepriseId?: number;

  @ApiPropertyOptional({
    description: "Recherche sur l'auteur (prénom, nom ou email).",
    example: "Koné",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Début de période (YYYY-MM-DD ou ISO 8601). Inclus.",
    example: "2026-10-01",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Fin de période (YYYY-MM-DD ou ISO 8601). Inclus.",
    example: "2026-10-16",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
