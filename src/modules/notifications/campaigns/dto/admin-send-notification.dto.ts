import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class AdminSendNotificationDto {
  @ApiProperty({ maxLength: 120, example: "Rappel" })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  titre: string;

  @ApiProperty({
    maxLength: 500,
    example: "Pensez à pointer votre départ avant 18 h.",
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @ApiPropertyOptional({
    example: 1,
    description:
      "Envoi par rôle : limite aux comptes d'une entreprise (équipe Pointelio uniquement ; imposé pour un admin d'entreprise).",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  entrepriseId?: number;
}
