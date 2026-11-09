import { ApiPropertyOptional } from "@nestjs/swagger";
import { StatutEntreprise } from "@prisma/client";
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

export class EntreprisesQueryDto {
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
    description: "Raison sociale, nom commercial ou e-mail de contact.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() || undefined : value,
  )
  search?: string;

  @ApiPropertyOptional({ enum: StatutEntreprise })
  @IsOptional()
  @IsEnum(StatutEntreprise)
  statut?: StatutEntreprise;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  packId?: number;
}
