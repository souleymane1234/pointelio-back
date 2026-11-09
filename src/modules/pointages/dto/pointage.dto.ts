import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  MethodePointage,
  StatutValidation,
  TypePointage,
} from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { ANOMALIE_VALUES, type AnomalieType } from "../anomalies.constants";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

const trimSpaces = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

export class PointerQrDto {
  @ApiProperty({
    example: "q3V9r0wq5x0Jb4kz2Yc8mQ1h7sT6uP2d",
    description: "Jeton lu sur le QR statique du site.",
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  qrToken!: string;

  @ApiProperty({ enum: TypePointage })
  @IsEnum(TypePointage)
  type!: TypePointage;

  @ApiProperty({ example: 5.3197 })
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @ApiProperty({ example: -4.0168 })
  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  @ApiProperty({
    example: 12,
    description: "Précision GPS du terminal, en mètres.",
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5000)
  precisionM!: number;

  @ApiProperty({
    example: "8f3a2b1c-9d8e-4f5a-b6c7-d8e9f0a1b2c3",
    description: "Identifiant d'idempotence (double appui / retry réseau).",
  })
  @Transform(trim)
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  requestId!: string;

  @ApiPropertyOptional({
    description: "true si le terminal signale une position simulée.",
  })
  @IsOptional()
  @IsBoolean()
  mockDetecte?: boolean;
}

export class PointerSurveillantDto {
  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeId!: number;

  @ApiProperty({ enum: TypePointage })
  @IsEnum(TypePointage)
  type!: TypePointage;

  @ApiProperty({
    example: "surv-8f3a2b1c-9d8e-4f5a",
    description: "Identifiant d'idempotence.",
  })
  @Transform(trim)
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  requestId!: string;

  @ApiPropertyOptional({ example: 5.3197 })
  @ValidateIf((o: PointerSurveillantDto) => o.longitude !== undefined)
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: -4.0168 })
  @ValidateIf((o: PointerSurveillantDto) => o.latitude !== undefined)
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5000)
  precisionM?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mockDetecte?: boolean;
}

export class CorrigerPointageDto {
  @ApiProperty({
    example: "Erreur de badge : départ saisi à la place d'une arrivée.",
  })
  @Transform(trimSpaces)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  motif!: string;

  @ApiPropertyOptional({ enum: TypePointage })
  @IsOptional()
  @IsEnum(TypePointage)
  type?: TypePointage;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  siteId?: number;

  @ApiPropertyOptional({
    example: "2026-10-27T08:05:00.000Z",
    description: "Heure serveur corrigée (ISO 8601).",
  })
  @IsOptional()
  @IsDateString()
  heureServeur?: string;

  @ApiPropertyOptional({ enum: StatutValidation })
  @IsOptional()
  @IsEnum(StatutValidation)
  statutValidation?: StatutValidation;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(191)
  motifStatut?: string;
}

export class PointagesQueryDto {
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

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  siteId?: number;

  @ApiPropertyOptional({ enum: TypePointage })
  @IsOptional()
  @IsEnum(TypePointage)
  type?: TypePointage;

  @ApiPropertyOptional({ enum: MethodePointage })
  @IsOptional()
  @IsEnum(MethodePointage)
  methode?: MethodePointage;

  @ApiPropertyOptional({ enum: StatutValidation })
  @IsOptional()
  @IsEnum(StatutValidation)
  statutValidation?: StatutValidation;

  @ApiPropertyOptional({
    example: "2026-10-01T00:00:00.000Z",
    description: "Borne inférieure (heureServeur, inclusive).",
  })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({
    example: "2026-10-31T23:59:59.000Z",
    description: "Borne supérieure (heureServeur, exclusive si date seule).",
  })
  @IsOptional()
  @IsDateString()
  dateFin?: string;
}

export class AnomaliesQueryDto extends PointagesQueryDto {
  @ApiPropertyOptional({
    enum: ANOMALIE_VALUES,
    description: "Filtrer sur un type d'anomalie (défaut : toutes).",
  })
  @IsOptional()
  @IsEnum(ANOMALIE_VALUES)
  anomalie?: AnomalieType;
}
