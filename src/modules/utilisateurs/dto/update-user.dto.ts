import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role, StatutCompte } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { ADMIN_APP_USER_PASSWORD_LENGTH } from "../../auth/shared/auth-validation.constants";
import { normalizePhoneInput } from "../../../common/utils/phone.util";

const collapseSpaces = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

/** `null` ou chaîne vide = effacer ; sinon valeur trimée. */
const nullableText = ({ value }: { value: unknown }) => {
  if (value === null) return null;
  if (typeof value === "string") return value.trim() || null;
  return value;
};

/** Mise à jour partielle d'un utilisateur (admin). Au moins un champ requis. */
export class UpdateUserDto {
  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    enum: StatutCompte,
    description:
      "SUSPENDU pour suspendre, ACTIF pour réactiver, DESACTIVE pour renvoyer. Préférer les endpoints dédiés /reaffecter, /suspendre, /reactiver, /renvoyer.",
  })
  @IsOptional()
  @IsEnum(StatutCompte)
  statut?: StatutCompte;

  @ApiPropertyOptional({
    description:
      "Motif de suspension (enregistré uniquement dans l'audit, non persisté sur le compte).",
    example: "Départ de l'entreprise",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() || undefined : value,
  )
  @IsString()
  @MaxLength(500)
  suspensionReason?: string;

  @ApiPropertyOptional({ example: "Traoré" })
  @IsOptional()
  @Transform(collapseSpaces)
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  nom?: string;

  @ApiPropertyOptional({ example: "Moussa" })
  @IsOptional()
  @Transform(collapseSpaces)
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  prenom?: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: "nouveau@acme.ci",
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null) return null;
    if (typeof value === "string") return value.trim().toLowerCase() || null;
    return value;
  })
  @ValidateIf((o) => o.email !== null)
  @IsEmail()
  @MaxLength(191)
  email?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: "+2250707070707",
    description: "null ou chaîne vide = retirer le téléphone.",
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null) return null;
    if (typeof value === "string" && value.trim() === "") return null;
    if (typeof value === "string") return normalizePhoneInput(value);
    return value;
  })
  @ValidateIf((o) => o.telephone !== null)
  @IsString()
  @Matches(/^\+?[0-9]{8,20}$/, {
    message:
      "Le numéro de téléphone doit contenir 8 à 20 chiffres (préfixe + autorisé).",
  })
  telephone?: string | null;

  @ApiPropertyOptional({
    example: "0000",
    description:
      "Réinitialise le mot de passe / PIN (pas de SMS ni d'OTP). EMPLOYE / SURVEILLANT : PIN de 4 chiffres ou 8 caractères min. ; autres rôles : 8 caractères min.",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  )
  @IsString()
  @MinLength(ADMIN_APP_USER_PASSWORD_LENGTH)
  @MaxLength(128)
  password?: string;

  @ApiPropertyOptional({
    example: 1,
    description: "Changement d'entreprise (équipe Pointelio uniquement).",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  entrepriseId?: number;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 3 })
  @IsOptional()
  @Type(() => Number)
  @ValidateIf((o) => o.siteId !== null)
  @IsInt()
  @Min(1)
  siteId?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 2 })
  @IsOptional()
  @Type(() => Number)
  @ValidateIf((o) => o.horaireId !== null)
  @IsInt()
  @Min(1)
  horaireId?: number | null;

  @ApiPropertyOptional({
    example: 5000,
    description: "Salaire journalier en FCFA (EMPLOYE).",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  salaireJournalier?: number;

  @ApiPropertyOptional({ type: String, nullable: true, example: "EMP-0042" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.matricule !== null)
  @IsString()
  @MaxLength(50)
  matricule?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "Caissier" })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.poste !== null)
  @IsString()
  @MaxLength(120)
  poste?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "2026-01-15" })
  @IsOptional()
  @ValidateIf((o) => o.dateEmbauche !== null)
  @IsDateString()
  dateEmbauche?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description:
      "URL publique de la photo ; null (ou chaîne vide) pour effacer.",
  })
  @IsOptional()
  @Transform(nullableText)
  @ValidateIf((o) => o.photoUrl !== null)
  @IsString()
  @MaxLength(2048)
  @Matches(/^https?:\/\//, {
    message: "La photo doit être une URL http(s) valide.",
  })
  photoUrl?: string | null;
}
