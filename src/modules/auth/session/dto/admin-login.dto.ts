import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { AUTH_SECRET_CODE_MIN_LENGTH } from "../../shared/auth-validation.constants";

export class AdminLoginDto {
  @ApiProperty({
    example: "admin@app.local",
    description: "Adresse email du compte admin.",
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: "ChangeMe123!",
    minLength: AUTH_SECRET_CODE_MIN_LENGTH,
    maxLength: 128,
    description: "Mot de passe du compte admin.",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(AUTH_SECRET_CODE_MIN_LENGTH)
  @MaxLength(128)
  password: string;
}
