import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

const collapseSpaces = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "Traoré" })
  @IsOptional()
  @Transform(collapseSpaces)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nom?: string;

  @ApiPropertyOptional({ example: "Moussa" })
  @IsOptional()
  @Transform(collapseSpaces)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  prenom?: string;

  @ApiPropertyOptional({ example: "moussa@acme.ci" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description:
      "URL publique de la photo (ex. retour du service d'upload). Chaîne vide pour la retirer.",
    example: "https://example.com/storage/avatars/user-1.jpg",
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  photoUrl?: string;
}
