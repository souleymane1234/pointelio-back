import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { Role, StatutCompte } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../common/dto/pagination-response.dto";

class RefEntrepriseSchemaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "ACME Côte d'Ivoire SARL" })
  raisonSociale: string;
}

class RefNomSchemaDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: "Siège Plateau" })
  nom: string;
}

export class AdminUserDetailSchemaDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 1 })
  entrepriseId: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 3 })
  siteId: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 2 })
  horaireId: number | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "EMP-0042" })
  matricule: string | null;

  @ApiProperty({ example: "Traoré" })
  nom: string;

  @ApiProperty({ example: "Moussa" })
  prenom: string;

  @ApiProperty({ example: "Moussa Traoré" })
  fullName: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  email: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  telephone: string | null;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ enum: StatutCompte })
  statut: StatutCompte;

  @ApiProperty({
    description:
      "Le compte a un mot de passe. Faux pour un compte invité qui ne l'a pas encore défini.",
  })
  hasPassword: boolean;

  @ApiPropertyOptional({ type: String, nullable: true })
  poste: string | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 5000,
    description: "Salaire d'une journée validée (arrivée + départ), en FCFA.",
  })
  salaireJournalier: number | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  dateEmbauche: Date | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  photoUrl: string | null;

  @ApiProperty()
  mfaActif: boolean;

  @ApiPropertyOptional({ type: Date, nullable: true })
  derniereConnexion: Date | null;

  @ApiPropertyOptional({ type: RefEntrepriseSchemaDto, nullable: true })
  entreprise: RefEntrepriseSchemaDto | null;

  @ApiPropertyOptional({ type: RefNomSchemaDto, nullable: true })
  site: RefNomSchemaDto | null;

  @ApiPropertyOptional({ type: RefNomSchemaDto, nullable: true })
  horaire: RefNomSchemaDto | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

@ApiExtraModels(
  AdminUserDetailSchemaDto,
  RefEntrepriseSchemaDto,
  RefNomSchemaDto,
)
export class UserResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: "Utilisateur récupéré avec succès" })
  message: string;

  @ApiProperty({ type: AdminUserDetailSchemaDto })
  data: AdminUserDetailSchemaDto;
}

@ApiExtraModels(AdminUserDetailSchemaDto, PaginationMetaSchemaDto)
export class UsersPaginatedResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: "Utilisateurs récupérés avec succès" })
  message: string;

  @ApiProperty({ type: [AdminUserDetailSchemaDto] })
  data: AdminUserDetailSchemaDto[];

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}
