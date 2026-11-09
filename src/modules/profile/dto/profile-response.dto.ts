import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Role, StatutCompte } from "@prisma/client";

class ProfileEntrepriseSchemaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "ACME Côte d'Ivoire SARL" })
  raisonSociale: string;

  @ApiProperty({ type: String, nullable: true, example: "ACME" })
  nomCommercial: string | null;
}

class ProfileSiteSchemaDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: "Siège Plateau" })
  nom: string;
}

class ProfileUserSchemaDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ type: Number, nullable: true, example: 1 })
  entrepriseId: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 3 })
  siteId: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 2 })
  horaireId: number | null;

  @ApiProperty({ type: String, nullable: true, example: "EMP-0042" })
  matricule: string | null;

  @ApiProperty({ example: "Traoré" })
  nom: string;

  @ApiProperty({ example: "Moussa" })
  prenom: string;

  @ApiProperty({ type: String, nullable: true, example: "moussa@acme.ci" })
  email: string | null;

  @ApiProperty({ type: String, nullable: true, example: "+2250700000000" })
  telephone: string | null;

  @ApiProperty({ enum: Role, example: Role.EMPLOYE })
  role: Role;

  @ApiProperty({ enum: StatutCompte, example: StatutCompte.ACTIF })
  statut: StatutCompte;

  @ApiProperty({ type: String, nullable: true, example: "Caissier" })
  poste: string | null;

  @ApiProperty({ type: String, nullable: true, format: "date-time" })
  dateEmbauche: string | null;

  @ApiProperty({ type: String, nullable: true })
  photoUrl: string | null;

  @ApiProperty({ type: String, nullable: true, format: "date-time" })
  derniereConnexion: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ type: ProfileEntrepriseSchemaDto, nullable: true })
  entreprise: ProfileEntrepriseSchemaDto | null;

  @ApiProperty({ type: ProfileSiteSchemaDto, nullable: true })
  site: ProfileSiteSchemaDto | null;

  @ApiProperty({
    type: Number,
    example: 3,
    description: "Nombre de notifications non lues (badge).",
    required: false,
  })
  unreadNotificationsCount?: number;
}

@ApiExtraModels(ProfileUserSchemaDto)
export class ProfileMeResponseSchemaDto {
  @ApiProperty()
  success: true;

  @ApiProperty({ example: "Profil récupéré avec succès" })
  message: string;

  @ApiProperty({ type: ProfileUserSchemaDto })
  data: ProfileUserSchemaDto;
}
