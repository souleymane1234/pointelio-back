import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { EntrepriseProfilFieldsDto } from "./entreprise-fields.dto";

/**
 * Mise à jour par Pointelio (hors statut et pack : voir cycle de vie et abonnement).
 * Au moins un champ requis.
 */
export class UpdateEntrepriseDto extends EntrepriseProfilFieldsDto {
  @ApiPropertyOptional({ example: "ACME Côte d'Ivoire SARL" })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  raisonSociale?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.notesInternes !== null)
  @IsString()
  @MaxLength(5000)
  notesInternes?: string | null;
}

/** Profil complété par l'entreprise elle-même. Au moins un champ requis. */
export class UpdateProfilEntrepriseDto extends EntrepriseProfilFieldsDto {}

export class MotifDto {
  @ApiPropertyOptional({
    example: "Impayé depuis 60 jours",
    description: "Enregistré dans l'audit.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  motif?: string;
}
