import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { PaginationMetaSchemaDto } from "../../../../common/dto/pagination-response.dto";
import { AdminNotificationSendTarget } from "./admin-sent-notifications-query.dto";

class AdminSentByUserSchemaDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: "Koné" })
  nom: string;

  @ApiProperty({ example: "Awa" })
  prenom: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  email: string | null;
}

export class AdminSentNotificationItemSchemaDto {
  @ApiProperty({
    example: "1024",
    description: "Identifiant de l'envoi (id du log d'audit, BigInt en texte).",
  })
  id: string;

  @ApiProperty({ example: "Rappel" })
  titre: string;

  @ApiProperty({ example: "Pensez à pointer votre départ avant 18 h." })
  message: string;

  @ApiProperty({
    enum: AdminNotificationSendTarget,
    example: AdminNotificationSendTarget.ROLE,
  })
  target: AdminNotificationSendTarget;

  @ApiPropertyOptional({ type: Number, nullable: true })
  targetUserId: number | null;

  @ApiPropertyOptional({ enum: Role, nullable: true })
  targetRole: Role | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 1 })
  entrepriseId: number | null;

  @ApiProperty({ example: 42 })
  recipientCount: number;

  @ApiProperty({ example: "2026-06-30T10:00:00.000Z" })
  sentAt: Date;

  @ApiPropertyOptional({ type: AdminSentByUserSchemaDto, nullable: true })
  sentBy: AdminSentByUserSchemaDto | null;
}

export class AdminSentNotificationsPaginatedResponseSchemaDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "Notifications envoyées récupérées avec succès" })
  message: string;

  @ApiProperty({ type: [AdminSentNotificationItemSchemaDto] })
  data: AdminSentNotificationItemSchemaDto[];

  @ApiProperty({ type: PaginationMetaSchemaDto })
  pagination: PaginationMetaSchemaDto;
}

export class AdminSentNotificationDetailResponseSchemaDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "Détail notification envoyée récupéré avec succès" })
  message: string;

  @ApiProperty({ type: AdminSentNotificationItemSchemaDto })
  data: AdminSentNotificationItemSchemaDto;
}
