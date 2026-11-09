import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { AUTH_SECRET_CODE_MIN_LENGTH } from "../../shared/auth-validation.constants";
import { normalizePhoneInput } from "../../../../common/utils/phone.util";

/** Connexion téléphone + code PIN. */
export class PhoneLoginDto {
  @ApiProperty({
    name: "phone_number",
    example: "+2250707070707",
    description:
      "Numéro au format international E.164 avec indicatif pays obligatoire.",
  })
  @Transform(({ value }) =>
    typeof value === "string" ? normalizePhoneInput(value) : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Matches(/^\+[0-9]{8,20}$/, {
    message: "Le numéro doit inclure l'indicatif pays (ex. +2250707070707).",
  })
  phone_number!: string;

  @ApiProperty({
    name: "secret_code",
    example: "1234",
    minLength: AUTH_SECRET_CODE_MIN_LENGTH,
    maxLength: 128,
    description: "Code PIN / mot de passe du compte.",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(AUTH_SECRET_CODE_MIN_LENGTH)
  @MaxLength(128)
  secret_code!: string;
}
