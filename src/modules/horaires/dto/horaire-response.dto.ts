import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

export class HoraireSchemaDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 1 })
  entrepriseId: number;

  @ApiProperty({ example: "Journée" })
  nom: string;

  @ApiProperty({ example: "08:00" })
  heureDebut: string;

  @ApiProperty({ example: "17:00" })
  heureFin: string;

  @ApiProperty({ example: 15 })
  toleranceMin: number;

  @ApiProperty({ example: [1, 2, 3, 4, 5], type: [Number] })
  joursTravail: number[];

  @ApiProperty({ example: 8 })
  utilisateursCount: number;

  @ApiProperty()
  createdAt: Date;
}

@ApiExtraModels(HoraireSchemaDto)
export class HoraireResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: HoraireSchemaDto })
  data: HoraireSchemaDto;
}

@ApiExtraModels(HoraireSchemaDto)
export class HorairesResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [HoraireSchemaDto] })
  data: HoraireSchemaDto[];
}
