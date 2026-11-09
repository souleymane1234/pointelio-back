import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role, StatutCompte } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import {
  adminUserPasswordErrorMessage,
  isAdminUserPasswordValid,
} from "../../auth/shared/auth-validation.constants";
import { normalizePhoneInput } from "../../../common/utils/phone.util";

@ValidatorConstraint({ name: "adminCreateUserPassword", async: false })
class AdminCreateUserPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const role = (args.object as { role?: Role }).role;
    return typeof value === "string" && value.length <= 128 && !!role
      ? isAdminUserPasswordValid(value, role)
      : false;
  }

  defaultMessage(args: ValidationArguments): string {
    if (typeof args.value !== "string" || args.value === "") {
      return "Le mot de passe est obligatoire.";
    }
    const role = (args.object as { role?: Role }).role ?? Role.EMPLOYE;
    return adminUserPasswordErrorMessage(role);
  }
}

const collapseSpaces = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

const emptyToUndefined = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() || undefined : value;

export class CreateUserDto {
  @ApiProperty({ enum: Role, example: Role.EMPLOYE })
  @IsEnum(Role)
  role!: Role;

  @ApiProperty({ example: "Traoré" })
  @Transform(collapseSpaces)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nom!: string;

  @ApiProperty({ example: "Moussa" })
  @Transform(collapseSpaces)
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  prenom!: string;

  @ApiPropertyOptional({
    example: "moussa@acme.ci",
    description: "Facultatif. Identifiant de connexion au back-office.",
  })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() || undefined : value,
  )
  @IsOptional()
  @IsEmail()
  @MaxLength(191)
  email?: string;

  @ApiProperty({
    example: "+2250700000000",
    description: "Obligatoire. Format international avec indicatif pays.",
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "string" && value.trim() === "") return undefined;
    return typeof value === "string" ? normalizePhoneInput(value) : value;
  })
  @Matches(/^\+?[0-9]{8,20}$/, {
    message: ({ value }) =>
      value
        ? "Le numéro de téléphone doit contenir 8 à 20 chiffres (préfixe + autorisé)."
        : "Le numéro de téléphone est obligatoire.",
  })
  telephone!: string;

  @ApiProperty({
    example: "0000",
    description:
      "Obligatoire : le compte est actif dès sa création (aucune validation par e-mail). EMPLOYE / SURVEILLANT : PIN de 4 chiffres ou 8 caractères min. ; autres rôles : 8 caractères min.",
  })
  @Transform(emptyToUndefined)
  @Validate(AdminCreateUserPasswordConstraint)
  password!: string;

  @ApiPropertyOptional({
    enum: StatutCompte,
    description: "Par défaut : ACTIF.",
  })
  @IsOptional()
  @IsEnum(StatutCompte)
  statut?: StatutCompte;

  @ApiPropertyOptional({
    example: 1,
    description:
      "Entreprise du compte (équipe Pointelio uniquement ; imposée pour un admin d'entreprise, ignorée pour SUPER_ADMIN / SUPPORT).",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  entrepriseId?: number;

  @ApiPropertyOptional({ example: 3, description: "Site de rattachement." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  siteId?: number;

  @ApiPropertyOptional({ example: 2, description: "Horaire de travail." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  horaireId?: number;

  @ApiPropertyOptional({
    example: 5000,
    description:
      "Salaire d'une journée (FCFA). Obligatoire pour un EMPLOYE : versé si arrivée + départ le même jour.",
  })
  @ValidateIf((o: CreateUserDto) => o.role === Role.EMPLOYE)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  salaireJournalier?: number;

  @ApiPropertyOptional({
    example: "EMP-0042",
    description: "Unique par entreprise.",
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  matricule?: string;

  @ApiPropertyOptional({ example: "Caissier" })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  poste?: string;

  @ApiPropertyOptional({ example: "2026-01-15" })
  @IsOptional()
  @IsDateString()
  dateEmbauche?: string;

  @ApiPropertyOptional({
    example: "https://cdn.example.com/photos/moussa.jpg",
  })
  @Transform(emptyToUndefined)
  @ValidateIf((o) => o.photoUrl !== undefined)
  @IsString()
  @MaxLength(2048)
  @Matches(/^https?:\/\//, {
    message: "La photo doit être une URL http(s) valide.",
  })
  photoUrl?: string;
}
