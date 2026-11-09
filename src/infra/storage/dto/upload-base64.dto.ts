import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Matches } from "class-validator";

/** Corps JSON pour un upload encodé en data URI base64. */
export class UploadBase64Dto {
  @ApiProperty({
    example: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    description: "Contenu en data URI : data:<mime>;base64,<payload>",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^data:[^;]+;base64,/i, {
    message: "content doit être une data URI (data:<mime>;base64,...)",
  })
  content: string;
}
