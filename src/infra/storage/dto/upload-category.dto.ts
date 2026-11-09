import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, MaxLength } from "class-validator";

/** Champs texte du formulaire multipart (hors fichier). */
export class UploadCategoryDto {
  @ApiPropertyOptional({
    example: "profiles",
    description: "Dossier logique (ex. profiles, documents).",
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(64)
  category?: string;
}
