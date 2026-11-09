import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    example: "0000",
    description: "Mot de passe ou PIN actuel.",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  currentPassword!: string;

  @ApiProperty({
    example: "4821",
    description:
      "EMPLOYE / SURVEILLANT : PIN de 4 chiffres ou 8 caractères min. ; autres rôles : 8 caractères min.",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  newPassword!: string;
}
