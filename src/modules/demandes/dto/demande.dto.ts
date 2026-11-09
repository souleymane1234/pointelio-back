import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { StatutDemande, TypeDemande } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

const trimSpaces = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

const CIVIL_DATE_MESSAGE = "La date doit être au format YYYY-MM-DD.";

export class CreateDemandeDto {
  @ApiProperty({ enum: TypeDemande })
  @IsEnum(TypeDemande)
  type!: TypeDemande;

  @ApiProperty({ example: "2026-11-02", description: "Date civile inclusive." })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: CIVIL_DATE_MESSAGE })
  dateDebut!: string;

  @ApiProperty({ example: "2026-11-06", description: "Date civile inclusive." })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: CIVIL_DATE_MESSAGE })
  dateFin!: string;

  @ApiPropertyOptional({
    example: 12,
    description:
      "Réservé aux RH / managers : créer une demande pour un autre employé.",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(trimSpaces)
  @IsString()
  @MaxLength(2000)
  commentaire?: string;

  @ApiPropertyOptional({
    example: "https://cdn.example.com/justificatifs/certificat.pdf",
    description: "Obligatoire pour une absence maladie.",
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  justificatifUrl?: string;
}

export class UpdateDemandeDto {
  @ApiPropertyOptional({ enum: TypeDemande })
  @IsOptional()
  @IsEnum(TypeDemande)
  type?: TypeDemande;

  @ApiPropertyOptional({ example: "2026-11-02" })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: CIVIL_DATE_MESSAGE })
  dateDebut?: string;

  @ApiPropertyOptional({ example: "2026-11-06" })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: CIVIL_DATE_MESSAGE })
  dateFin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(trimSpaces)
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(2000)
  commentaire?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(trim)
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(500)
  justificatifUrl?: string | null;
}

export class DeciderDemandeDto {
  @ApiProperty({
    enum: [StatutDemande.APPROUVEE, StatutDemande.REFUSEE],
    example: StatutDemande.APPROUVEE,
  })
  @IsIn([StatutDemande.APPROUVEE, StatutDemande.REFUSEE])
  statut!: typeof StatutDemande.APPROUVEE | typeof StatutDemande.REFUSEE;

  @ApiPropertyOptional({
    description: "Obligatoire en cas de refus.",
    example: "Effectif insuffisant sur cette période.",
  })
  @ValidateIf((o: DeciderDemandeDto) => o.statut === StatutDemande.REFUSEE)
  @Transform(trimSpaces)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  decisionMotif?: string;
}

export class DemandesQueryDto {
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

  @ApiPropertyOptional({ enum: StatutDemande })
  @IsOptional()
  @IsEnum(StatutDemande)
  statut?: StatutDemande;

  @ApiPropertyOptional({ enum: TypeDemande })
  @IsOptional()
  @IsEnum(TypeDemande)
  type?: TypeDemande;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeId?: number;

  @ApiPropertyOptional({
    example: "2026-11-01",
    description: "Filtre les demandes qui chevauchent [dateDebut, dateFin].",
  })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({ example: "2026-11-30" })
  @IsOptional()
  @IsDateString()
  dateFin?: string;
}
