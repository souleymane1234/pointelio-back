import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class LogoutDto {
  @ApiPropertyOptional({
    name: "refresh_token",
    description:
      "Token de rafraîchissement à invalider en plus du token d’accès (recommandé pour une déconnexion complète).",
    example: "eyJhbGciOiJIUzI1NiIs...",
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
