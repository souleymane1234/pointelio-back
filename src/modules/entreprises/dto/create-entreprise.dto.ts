import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { StatutEntreprise } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { AUTH_EMAIL_PASSWORD_MIN_LENGTH } from "../../auth/shared/auth-validation.constants";
import { EntrepriseProfilFieldsDto } from "./entreprise-fields.dto";

const collapseSpaces = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

/** Premier administrateur client, actif dès la création. */
export class EntrepriseAdminDto {
  @ApiProperty({ example: "Koné" })
  @Transform(collapseSpaces)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nom!: string;

  @ApiProperty({ example: "Awa" })
  @Transform(collapseSpaces)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  prenom!: string;

  @ApiProperty({ example: "awa.kone@acme.ci" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(191)
  email!: string;

  @ApiProperty({
    example: "MotDePasse8",
    description:
      "Mot de passe du compte (8 caractères min.), transmis par l'administrateur.",
  })
  @Matches(new RegExp(`^[\\s\\S]{${AUTH_EMAIL_PASSWORD_MIN_LENGTH},128}$`), {
    message: ({ value }) =>
      typeof value === "string" && value !== ""
        ? `Le mot de passe doit contenir entre ${AUTH_EMAIL_PASSWORD_MIN_LENGTH} et 128 caractères.`
        : "Le mot de passe du compte est obligatoire.",
  })
  password!: string;
}

/** Statuts possibles à la création (suspension / résiliation : cycle de vie). */
export const STATUTS_CREATION = [
  StatutEntreprise.ESSAI,
  StatutEntreprise.ACTIF,
] as const;

export class CreateEntrepriseDto extends EntrepriseProfilFieldsDto {
  @ApiProperty({ example: "ACME Côte d'Ivoire SARL" })
  @Transform(collapseSpaces)
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  raisonSociale!: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  packId!: number;

  @ApiPropertyOptional({
    enum: STATUTS_CREATION,
    default: StatutEntreprise.ESSAI,
  })
  @IsOptional()
  @IsIn(STATUTS_CREATION)
  statut?: (typeof STATUTS_CREATION)[number];

  @ApiPropertyOptional({
    example: "2026-07-01",
    description:
      "Par défaut : aujourd'hui + `essaiJours` du pack pour un essai, aucune sinon.",
  })
  @IsOptional()
  @IsDateString()
  dateEcheance?: string;

  @ApiPropertyOptional({ description: "Notes internes, invisibles du client." })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notesInternes?: string;

  @ApiPropertyOptional({ type: EntrepriseAdminDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EntrepriseAdminDto)
  admin?: EntrepriseAdminDto;
}
