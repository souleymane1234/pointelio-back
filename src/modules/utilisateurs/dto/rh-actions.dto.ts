import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";

export class ReaffecterEmployeDto {
  @ApiProperty({ example: 2, description: "Nouveau site de rattachement." })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  siteId!: number;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 3,
    description: "Nouvel horaire ; null pour retirer l'horaire individuel.",
  })
  @IsOptional()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @Min(1)
  horaireId?: number | null;
}

export class MotifRhDto {
  @ApiPropertyOptional({
    example: "Absences répétées",
    description: "Motif enregistré dans l'audit.",
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() || undefined : value,
  )
  @IsString()
  @MaxLength(500)
  motif?: string;
}
