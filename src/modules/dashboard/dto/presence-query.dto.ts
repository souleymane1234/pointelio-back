import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Matches, Min } from "class-validator";

export class PresenceQueryDto {
  @ApiPropertyOptional({
    example: "2026-10-27",
    description:
      "Jour civil (YYYY-MM-DD). Défaut : aujourd'hui (fuseau entreprise).",
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "La date doit être au format YYYY-MM-DD.",
  })
  date?: string;

  @ApiPropertyOptional({ example: 3, description: "Filtrer sur un site." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  siteId?: number;
}

const DATE_MESSAGE = "La date doit être au format YYYY-MM-DD.";

export class PresencePeriodeQueryDto {
  @ApiProperty({ example: "2026-11-02", description: "Premier jour (inclus)." })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: DATE_MESSAGE })
  du!: string;

  @ApiProperty({
    example: "2026-11-08",
    description: "Dernier jour (inclus). 62 jours maximum.",
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: DATE_MESSAGE })
  au!: string;

  @ApiPropertyOptional({ example: 3, description: "Filtrer sur un site." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  siteId?: number;

  @ApiPropertyOptional({
    example: 12,
    description:
      "Un seul employé : la réponse inclut aussi son détail jour par jour (`employes[0].detail`).",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeId?: number;
}
