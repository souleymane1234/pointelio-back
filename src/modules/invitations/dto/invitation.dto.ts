import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ADMIN_APP_USER_PASSWORD_LENGTH } from "../../auth/shared/auth-validation.constants";

export class InvitationTokenDto {
  @ApiProperty({ description: "Jeton reçu dans le lien d'activation." })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  token!: string;
}

export class AcceptInvitationDto extends InvitationTokenDto {
  @ApiProperty({
    example: "MotDePasse8",
    description:
      "EMPLOYE / SURVEILLANT : PIN de 4 chiffres ou 8 caractères min. ; autres rôles : 8 caractères min.",
  })
  @IsString()
  @MinLength(ADMIN_APP_USER_PASSWORD_LENGTH)
  @MaxLength(128)
  password!: string;
}
