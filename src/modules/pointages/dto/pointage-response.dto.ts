import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import {
  MethodePointage,
  StatutValidation,
  TypePointage,
} from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";
import { ANOMALIE_VALUES, type AnomalieType } from "../anomalies.constants";

export class PointagePersonneSchemaDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: "Traoré" })
  nom: string;

  @ApiProperty({ example: "Awa" })
  prenom: string;

  @ApiProperty({ type: String, nullable: true, example: "EMP-0042" })
  matricule: string | null;

  @ApiProperty({ type: Number, nullable: true, example: 5000, required: false })
  salaireJournalier?: number | null;
}

export class PointageSiteSchemaDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: "Siège Plateau" })
  nom: string;
}

export class PointageSchemaDto {
  @ApiProperty({
    example: "1024",
    description: "Identifiant BigInt sérialisé en texte.",
  })
  id: string;

  @ApiProperty({ example: 1 })
  entrepriseId: number;

  @ApiProperty({ example: 12 })
  employeId: number;

  @ApiProperty({ example: 3 })
  siteId: number;

  @ApiProperty({ type: Number, nullable: true })
  pointeParId: number | null;

  @ApiProperty({ enum: TypePointage })
  type: TypePointage;

  @ApiProperty({ enum: MethodePointage })
  methode: MethodePointage;

  @ApiProperty({ type: Number, nullable: true, example: 5.3197 })
  latitude: number | null;

  @ApiProperty({ type: Number, nullable: true, example: -4.0168 })
  longitude: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 12 })
  precisionM: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 8.4 })
  distanceM: number | null;

  @ApiProperty({ enum: StatutValidation })
  statutValidation: StatutValidation;

  @ApiProperty({ type: String, nullable: true })
  motifStatut: string | null;

  @ApiProperty()
  mockDetecte: boolean;

  @ApiProperty()
  requestId: string;

  @ApiProperty()
  heureServeur: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: PointagePersonneSchemaDto })
  employe: PointagePersonneSchemaDto;

  @ApiProperty({ type: PointageSiteSchemaDto })
  site: PointageSiteSchemaDto;

  @ApiProperty({ type: PointagePersonneSchemaDto, nullable: true })
  pointePar: PointagePersonneSchemaDto | null;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 12,
    description:
      "Minutes de retard au-delà de la tolérance du site (arrivées uniquement).",
  })
  retardMinutes: number | null;

  @ApiProperty({
    description:
      "true si l'employé a une arrivée et un départ le même jour (journée payée).",
  })
  paieValidee: boolean;

  @ApiProperty({
    example: 5000,
    description: "Montant du jour en FCFA (salaire journalier si paie validée).",
  })
  montantJour: number;

  @ApiProperty({
    enum: ANOMALIE_VALUES,
    isArray: true,
    description: "Anomalies calculées (GPS, retard, oubli de départ).",
  })
  anomalies: AnomalieType[];
}

export class PointageCorrectionSchemaDto {
  @ApiProperty({ example: 4 })
  id: number;

  @ApiProperty({ example: "1024" })
  pointageId: string;

  @ApiProperty({ example: 2 })
  auteurId: number;

  @ApiProperty()
  motif: string;

  @ApiProperty({ type: Object })
  avant: Record<string, unknown>;

  @ApiProperty({ type: Object })
  apres: Record<string, unknown>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: PointagePersonneSchemaDto })
  auteur: PointagePersonneSchemaDto;
}

export class SurveillantEmployeSchemaDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: "Traoré" })
  nom: string;

  @ApiProperty({ example: "Awa" })
  prenom: string;

  @ApiProperty({ type: String, nullable: true })
  matricule: string | null;

  @ApiProperty({ type: String, nullable: true })
  poste: string | null;

  @ApiProperty({ type: String, nullable: true })
  photoUrl: string | null;

  @ApiProperty({
    type: PointageSchemaDto,
    nullable: true,
    description: "Dernier pointage du jour civil (fuseau de l'entreprise).",
  })
  dernierPointageJour: Pick<
    PointageSchemaDto,
    "id" | "type" | "heureServeur" | "statutValidation"
  > | null;
}

@ApiExtraModels(
  PointageSchemaDto,
  PointagePersonneSchemaDto,
  PointageSiteSchemaDto,
)
export class PointageResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: PointageSchemaDto })
  data: PointageSchemaDto;
}

@ApiExtraModels(PointageSchemaDto, PaginationMetaSchemaDto)
export class PointagesPaginatedResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [PointageSchemaDto] })
  data: PointageSchemaDto[];

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}

@ApiExtraModels(PointageCorrectionSchemaDto)
export class PointageCorrectionResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: PointageCorrectionSchemaDto })
  data: PointageCorrectionSchemaDto;
}

@ApiExtraModels(PointageCorrectionSchemaDto)
export class PointageCorrectionsResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [PointageCorrectionSchemaDto] })
  data: PointageCorrectionSchemaDto[];
}

@ApiExtraModels(SurveillantEmployeSchemaDto)
export class SurveillantEmployesResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [SurveillantEmployeSchemaDto] })
  data: SurveillantEmployeSchemaDto[];
}
