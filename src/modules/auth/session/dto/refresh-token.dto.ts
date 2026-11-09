import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiPropertyOptional({
    name: "refresh_token",
    description: "Token de rafraîchissement",
    example: "eyJhbGciOiJIUzI1NiIs...",
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
