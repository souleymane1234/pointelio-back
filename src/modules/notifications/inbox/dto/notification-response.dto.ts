import { PaginationMetaSchemaDto } from "../../../../common/dto/pagination-response.dto";
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

export class NotificationSchemaDto {
  @ApiProperty({ example: 42 })
  id: number;

  @ApiProperty({ example: 12 })
  utilisateurId: number;

  @ApiProperty({ example: "Demande approuvée" })
  titre: string;

  @ApiProperty({ example: "Votre congé du 2 au 6 juin a été approuvé." })
  message: string;

  @ApiProperty({ example: "SYSTEM" })
  type: string;

  @ApiPropertyOptional({
    type: Date,
    nullable: true,
    description: "Date de lecture ; null si non lue.",
  })
  luAt: Date | null;

  @ApiProperty()
  createdAt: Date;
}

@ApiExtraModels(NotificationSchemaDto)
export class NotificationResponseSchemaDto {
  @ApiProperty()
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: NotificationSchemaDto })
  data: NotificationSchemaDto;
}

@ApiExtraModels(NotificationSchemaDto, PaginationMetaSchemaDto)
export class NotificationsPaginatedResponseSchemaDto {
  @ApiProperty()
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [NotificationSchemaDto] })
  data: NotificationSchemaDto[];

  @ApiProperty({
    type: Number,
    example: 12,
    description:
      "Nombre de notifications non lues (badge), indépendant des filtres de la page.",
  })
  count: number;

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}

export class MarkAllNotificationsReadSchemaDto {
  @ApiProperty()
  success: true;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: Object,
    example: { updatedCount: 3 },
  })
  data: {
    updatedCount: number;
  };
}
