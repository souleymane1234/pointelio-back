import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";
import { PACK_MODULE_VALUES } from "../../../common/constants/pack-modules.constants";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class CreatePackDto {
  @ApiProperty({ example: "STARTER", description: "Majuscules, chiffres, _." })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toUpperCase() : value,
  )
  @Matches(/^[A-Z][A-Z0-9_]{1,49}$/, {
    message: "Le code doit contenir 2 à 50 caractères : A-Z, 0-9 ou _.",
  })
  code!: string;

  @ApiProperty({ example: "Starter" })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nom!: string;

  @ApiProperty({ example: 25000, description: "Prix mensuel en FCFA." })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  prixMensuel!: number;

  @ApiPropertyOptional({ example: "Idéal pour les petites équipes." })
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(191)
  description?: string;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 10,
    description: "null = illimité.",
  })
  @IsOptional()
  @ValidateIf((o) => o.maxEmployes !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxEmployes?: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 1,
    description: "null = illimité.",
  })
  @IsOptional()
  @ValidateIf((o) => o.maxSites !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxSites?: number | null;

  @ApiPropertyOptional({ example: 14, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  essaiJours?: number;

  @ApiProperty({
    enum: PACK_MODULE_VALUES,
    isArray: true,
    example: ["QR", "GPS"],
  })
  @IsArray()
  @ArrayUnique()
  @IsIn(PACK_MODULE_VALUES, { each: true })
  modules!: string[];

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ordre?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
