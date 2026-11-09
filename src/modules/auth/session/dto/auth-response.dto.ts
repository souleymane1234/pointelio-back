import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

class AuthUserSchemaDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 1,
    description: "Null pour l'équipe Pointelio (SUPER_ADMIN / SUPPORT).",
  })
  entrepriseId: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 3 })
  siteId: number | null;

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

  @ApiProperty({ type: String, nullable: true, example: "Caissier" })
  poste: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: "https://example.com/photo.jpg",
  })
  photoUrl: string | null;
}

export class AuthDataSchemaDto {
  @ApiProperty({ name: "access_token" })
  access_token: string;

  @ApiProperty({ name: "refresh_token" })
  refresh_token: string;

  @ApiProperty({ type: AuthUserSchemaDto })
  user: AuthUserSchemaDto;
}

class AuthRefreshDataSchemaDto {
  @ApiProperty({ name: "access_token" })
  access_token: string;

  @ApiProperty({ name: "refresh_token" })
  refresh_token: string;
}

@ApiExtraModels(AuthUserSchemaDto, AuthDataSchemaDto, AuthRefreshDataSchemaDto)
export class AuthRegisterLoginResponseSchemaDto {
  @ApiProperty()
  success: true;

  @ApiProperty({ example: "Connexion réussie" })
  message: string;

  @ApiProperty({ type: AuthDataSchemaDto })
  data: AuthDataSchemaDto;
}

export class AuthRefreshResponseSchemaDto {
  @ApiProperty()
  success: true;

  @ApiProperty({ example: "Tokens renouvelés" })
  message: string;

  @ApiProperty({ type: AuthRefreshDataSchemaDto })
  data: AuthRefreshDataSchemaDto;
}
