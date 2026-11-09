import { ApiPropertyOptional } from "@nestjs/swagger";
import { StatutEntreprise } from "@prisma/client";
import { Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Min,
  ValidateIf,
} from "class-validator";
import { PACK_MODULE_VALUES } from "../../../common/constants/pack-modules.constants";

/** Statuts de facturation (suspension / résiliation : cycle de vie de l'entreprise). */
export const STATUTS_ABONNEMENT = [
  StatutEntreprise.ESSAI,
  StatutEntreprise.ACTIF,
  StatutEntreprise.PAIEMENT_EN_ATTENTE,
  StatutEntreprise.EN_RETARD,
] as const;

/** Changement d'offre (Pointelio). `null` sur une surcharge = revenir au pack. */
export class UpdateAbonnementDto {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  packId?: number;

  @ApiPropertyOptional({ enum: STATUTS_ABONNEMENT })
  @IsOptional()
  @IsIn(STATUTS_ABONNEMENT)
  statut?: (typeof STATUTS_ABONNEMENT)[number];

  @ApiPropertyOptional({ type: String, nullable: true, example: "2026-12-31" })
  @IsOptional()
  @ValidateIf((o) => o.dateEcheance !== null)
  @IsDateString()
  dateEcheance?: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 25 })
  @IsOptional()
  @ValidateIf((o) => o.maxEmployesOverride !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxEmployesOverride?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 3 })
  @IsOptional()
  @ValidateIf((o) => o.maxSitesOverride !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxSitesOverride?: number | null;

  @ApiPropertyOptional({
    enum: PACK_MODULE_VALUES,
    isArray: true,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o) => o.modulesOverride !== null)
  @IsArray()
  @ArrayUnique()
  @IsIn(PACK_MODULE_VALUES, { each: true })
  modulesOverride?: string[] | null;
}
