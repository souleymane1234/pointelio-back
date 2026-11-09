import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from "class-validator";

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const HEURE_MESSAGE = "L'heure doit être au format HH:mm (00:00 à 23:59).";

export class CreateHoraireDto {
  @ApiProperty({ example: "Journée" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nom!: string;

  @ApiProperty({ example: "08:00" })
  @Matches(HEURE, { message: HEURE_MESSAGE })
  heureDebut!: string;

  @ApiProperty({
    example: "17:00",
    description:
      "Peut être antérieure au début (horaire de nuit, ex. 22:00 → 06:00).",
  })
  @Matches(HEURE, { message: HEURE_MESSAGE })
  heureFin!: string;

  @ApiPropertyOptional({
    example: 15,
    default: 15,
    description: "Tolérance de retard en minutes.",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(240)
  toleranceMin?: number;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: "Jours travaillés : 1 = lundi … 7 = dimanche.",
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  joursTravail!: number[];
}

export class UpdateHoraireDto extends PartialType(CreateHoraireDto) {}
