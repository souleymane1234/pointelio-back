import { ApiProperty } from "@nestjs/swagger";

/** Réponse de succès sans `data` (ex. suppression). */
export class SuccessResponseSchemaDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: "Opération réussie" })
  message: string;
}

export class ErrorResponseSchemaDto {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: "Message d'erreur" })
  message: string;

  @ApiProperty({ type: [String], required: false })
  errors?: string[];
}
