import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { StatutValidation, TypePointage } from "@prisma/client";

export class PresencePointageSchemaDto {
  @ApiProperty({ example: "1024" })
  id: string;

  @ApiProperty({ enum: TypePointage })
  type: TypePointage;

  @ApiProperty()
  heureServeur: Date;

  @ApiProperty({ enum: StatutValidation })
  statutValidation: StatutValidation;

  @ApiProperty({ type: Number, nullable: true, example: 12 })
  retardMinutes: number | null;
}

export class PresenceEmployeSchemaDto {
  @ApiProperty({ example: 12 })
  employeId: number;

  @ApiProperty({ example: "Traoré" })
  nom: string;

  @ApiProperty({ example: "Awa" })
  prenom: string;

  @ApiProperty({ type: String, nullable: true })
  matricule: string | null;

  @ApiProperty({ example: 3 })
  siteId: number;

  @ApiProperty({ example: "Siège Plateau" })
  siteNom: string;

  @ApiProperty({
    description: "Le jour consulté est un jour ouvré du site.",
  })
  jourOuvre: boolean;

  @ApiProperty({ type: String, nullable: true, example: "08:00" })
  heureDebut: string | null;

  @ApiProperty({ type: String, nullable: true, example: "17:00" })
  heureFin: string | null;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 15,
    description:
      "Tolérance de retard du site (minutes). null = l'employeur n'en a pas défini.",
  })
  toleranceMin: number | null;

  @ApiProperty({ type: PresencePointageSchemaDto, nullable: true })
  arrivee: PresencePointageSchemaDto | null;

  @ApiProperty({ type: PresencePointageSchemaDto, nullable: true })
  depart: PresencePointageSchemaDto | null;

  @ApiProperty({ description: "Arrivée après l'heure de début + tolérance." })
  enRetard: boolean;

  @ApiProperty({
    description: "Journée payée : arrivée et départ enregistrés.",
  })
  paieValidee: boolean;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 5000,
    description: "Salaire journalier configuré (FCFA).",
  })
  salaireJournalier: number | null;

  @ApiProperty({
    example: 5000,
    description: "Montant dû ce jour (salaire si paie validée, sinon 0).",
  })
  montantJour: number;
}

export class PresenceJourSchemaDto {
  @ApiProperty({ example: "2026-10-27" })
  date: string;

  @ApiProperty({ example: 12, description: "Employés actifs du périmètre." })
  effectif: number;

  @ApiProperty({ example: 9 })
  presents: number;

  @ApiProperty({ example: 2 })
  retards: number;

  @ApiProperty({ example: 8, description: "Journées avec arrivée + départ." })
  paiesValidees: number;

  @ApiProperty({
    example: 40000,
    description: "Somme des montants du jour (FCFA).",
  })
  masseSalarialeJour: number;

  @ApiProperty({ type: [PresenceEmployeSchemaDto] })
  employes: PresenceEmployeSchemaDto[];
}

@ApiExtraModels(PresenceJourSchemaDto, PresenceEmployeSchemaDto)
export class PresenceResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: PresenceJourSchemaDto })
  data: PresenceJourSchemaDto;
}
