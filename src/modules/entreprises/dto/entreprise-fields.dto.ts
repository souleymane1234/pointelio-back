import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from "class-validator";

/** `null` ou chaîne vide = effacer ; sinon valeur trimée. */
const nullableText = ({ value }: { value: unknown }) => {
  if (value === null) return null;
  if (typeof value === "string") return value.trim() || null;
  return value;
};

/** Champs du profil d'entreprise, modifiables par l'entreprise et par Pointelio. */
export class EntrepriseProfilFieldsDto {
  @ApiPropertyOptional({ type: String, nullable: true, example: "ACME" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.nomCommercial !== null)
  @IsString()
  @MaxLength(191)
  nomCommercial?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "Commerce" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.secteur !== null)
  @IsString()
  @MaxLength(120)
  secteur?: string | null;

  @ApiPropertyOptional({ example: "CI", description: "Code pays ISO 3166-1." })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toUpperCase() : value,
  )
  @Matches(/^[A-Z]{2}$/, {
    message: "Le pays doit être un code ISO à 2 lettres.",
  })
  pays?: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: "Abidjan" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.ville !== null)
  @IsString()
  @MaxLength(120)
  ville?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "Plateau" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.adresse !== null)
  @IsString()
  @MaxLength(191)
  adresse?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: "CI-ABJ-2026-B-12345",
    description: "RCCM, NCC ou équivalent.",
  })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.identifiantLegal !== null)
  @IsString()
  @MaxLength(120)
  identifiantLegal?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "Awa Koné" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.contactNom !== null)
  @IsString()
  @MaxLength(120)
  contactNom?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "DRH" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.contactFonction !== null)
  @IsString()
  @MaxLength(120)
  contactFonction?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "rh@acme.ci" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.contactEmail !== null)
  @IsEmail()
  @MaxLength(191)
  contactEmail?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: "+2250700000000",
  })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.contactTel !== null)
  @Matches(/^\+?[0-9 ]{8,20}$/, {
    message: "Le téléphone doit contenir 8 à 20 chiffres (préfixe + autorisé).",
  })
  contactTel?: string | null;

  @ApiPropertyOptional({ example: "Africa/Abidjan" })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  fuseauHoraire?: string;
}
