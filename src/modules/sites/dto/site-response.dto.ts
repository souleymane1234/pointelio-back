import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";

export class SiteJourHoraireSchemaDto {
  @ApiProperty({ example: 1, description: "1 = lundi … 7 = dimanche." })
  jour: number;

  @ApiProperty({ example: "08:00" })
  heureDebut: string;

  @ApiProperty({ example: "17:00" })
  heureFin: string;
}

export class SiteSchemaDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: 1 })
  entrepriseId: number;

  @ApiProperty({ example: "Siège Plateau" })
  nom: string;

  @ApiProperty({ type: String, nullable: true })
  adresse: string | null;

  @ApiProperty({ example: 5.3197 })
  latitude: number;

  @ApiProperty({ example: -4.0168 })
  longitude: number;

  @ApiProperty({ example: 30 })
  rayonM: number;

  @ApiProperty({ example: 50 })
  precisionMaxM: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 15,
    description:
      "Minutes de retard acceptées. null = l'employeur n'a pas défini de tolérance.",
  })
  toleranceMin: number | null;

  @ApiProperty({
    type: [SiteJourHoraireSchemaDto],
    description:
      "Jours et plages choisis par l'employeur (1 = lundi … 7 = dimanche).",
  })
  horairesJours: SiteJourHoraireSchemaDto[];

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    type: [Number],
    description: "Jours ouvrés (dérivé de horairesJours).",
  })
  joursTravail: number[];

  @ApiProperty({
    example: "q3V9r0wq5x0Jb4kz2Yc8mQ1h7sT6uP2d",
    description: "Jeton du QR statique à imprimer sur le site.",
  })
  qrToken: string;

  @ApiProperty()
  actif: boolean;

  @ApiProperty({ example: 12, description: "Utilisateurs rattachés." })
  employesCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

@ApiExtraModels(SiteSchemaDto, SiteJourHoraireSchemaDto)
export class SiteResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: SiteSchemaDto })
  data: SiteSchemaDto;
}

@ApiExtraModels(
  SiteSchemaDto,
  SiteJourHoraireSchemaDto,
  PaginationMetaSchemaDto,
)
export class SitesPaginatedResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [SiteSchemaDto] })
  data: SiteSchemaDto[];

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}
