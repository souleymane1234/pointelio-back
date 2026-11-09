import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const HEURE_MESSAGE = "L'heure doit être au format HH:mm (00:00 à 23:59).";

export class SiteJourHoraireDto {
  @ApiProperty({
    example: 1,
    description: "Jour ISO : 1 = lundi … 7 = dimanche.",
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(7)
  jour!: number;

  @ApiProperty({ example: "08:00", description: "Heure d'arrivée attendue." })
  @Matches(HEURE, { message: HEURE_MESSAGE })
  heureDebut!: string;

  @ApiProperty({
    example: "17:00",
    description: "Heure de descente. Peut être antérieure (horaire de nuit).",
  })
  @Matches(HEURE, { message: HEURE_MESSAGE })
  heureFin!: string;
}

export class CreateSiteDto {
  @ApiProperty({ example: "Siège Plateau" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nom!: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: "Avenue Chardy, Plateau",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() || null : value,
  )
  @ValidateIf((o) => o.adresse !== null)
  @IsString()
  @MaxLength(191)
  adresse?: string | null;

  @ApiProperty({ example: 5.3197 })
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @ApiProperty({ example: -4.0168 })
  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  @ApiPropertyOptional({
    example: 30,
    default: 30,
    description: "Rayon de validation du pointage, en mètres.",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(2000)
  rayonM?: number;

  @ApiPropertyOptional({
    example: 50,
    default: 50,
    description:
      "Précision GPS maximale acceptée ; au-delà, le mobile demande de réessayer.",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(500)
  precisionMaxM?: number;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 15,
    description:
      "Facultatif. Minutes de retard acceptées avant de marquer l'employé en retard. null ou omis = aucune tolérance.",
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(240)
  toleranceMin?: number | null;

  @ApiProperty({
    type: [SiteJourHoraireDto],
    example: [
      { jour: 1, heureDebut: "08:00", heureFin: "17:00" },
      { jour: 2, heureDebut: "08:00", heureFin: "17:00" },
      { jour: 3, heureDebut: "08:00", heureFin: "17:00" },
      { jour: 4, heureDebut: "08:00", heureFin: "17:00" },
      { jour: 5, heureDebut: "08:00", heureFin: "17:00" },
    ],
    description:
      "Jours travaillés choisis par l'employeur, avec heure d'arrivée et de descente. Uniquement les jours listés sont ouvrés (1 = lundi … 7 = dimanche).",
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique((item: SiteJourHoraireDto) => item.jour)
  @ValidateNested({ each: true })
  @Type(() => SiteJourHoraireDto)
  horairesJours!: SiteJourHoraireDto[];
}

export class UpdateSiteDto extends PartialType(CreateSiteDto) {
  @ApiPropertyOptional({
    description: "Réactiver un site désactivé (soumis à la limite de sites).",
  })
  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}

export class SitesQueryDto {
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

  @ApiPropertyOptional({ description: "Recherche sur le nom ou l'adresse." })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() || undefined : value,
  )
  search?: string;

  @ApiPropertyOptional({ description: "true | false" })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return undefined;
  })
  @IsBoolean()
  actif?: boolean;
}
