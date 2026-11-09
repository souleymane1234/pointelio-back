import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role, StatutCompte } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

/** Query liste paginée des utilisateurs. */
export class UsersQueryDto {
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

  @ApiPropertyOptional({
    description:
      "Recherche libre : nom, prénom, e-mail, téléphone ou matricule (contient).",
    example: "Traoré",
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() || undefined : value,
  )
  search?: string;

  @ApiPropertyOptional({ enum: StatutCompte })
  @IsOptional()
  @IsEnum(StatutCompte)
  statut?: StatutCompte;

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    example: 1,
    description:
      "Filtre par entreprise (équipe Pointelio uniquement ; ignoré pour un admin d'entreprise).",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  entrepriseId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  siteId?: number;
}
