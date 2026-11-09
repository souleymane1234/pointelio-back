import { BadRequestException, Injectable } from "@nestjs/common";
import { translate, type Locale } from "../../../../common/i18n";
import { PrismaService } from "../../../prisma/prisma.service";
import type { AdminSendEmailDto } from "../dto/admin-send-email.dto";
import { EmailingService } from "../../emailing.service";

export type AdminSendEmailResult = {
  messageId: string;
  accepted: string[];
  rejected: string[];
  /** Destinataires effectifs après résolution userIds + fusion avec emails. */
  to: string[];
};

@Injectable()
export class AdminEmailingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailing: EmailingService,
  ) {}

  async send(
    dto: AdminSendEmailDto,
    locale: Locale,
  ): Promise<AdminSendEmailResult> {
    const fromUsers = await this.resolveEmailsFromUserIds(dto.userIds, locale);
    const direct = dto.emails ?? [];
    const to = [...new Set([...fromUsers, ...direct])];

    if (to.length === 0) {
      throw new BadRequestException(
        translate(locale, "adminEmailRecipientsRequired"),
      );
    }

    const result = await this.emailing.send({
      to,
      subject: dto.subject,
      ...(dto.text?.trim() ? { text: dto.text } : {}),
      ...(dto.html?.trim() ? { html: dto.html } : {}),
      ...(dto.cc?.length ? { cc: dto.cc } : {}),
      ...(dto.bcc?.length ? { bcc: dto.bcc } : {}),
      ...(dto.replyTo ? { replyTo: dto.replyTo } : {}),
      ...(dto.fromEmail ? { fromEmail: dto.fromEmail } : {}),
      ...(dto.fromName ? { fromName: dto.fromName } : {}),
      ...(dto.headers ? { headers: dto.headers } : {}),
    });

    return {
      ...result,
      to,
    };
  }

  private async resolveEmailsFromUserIds(
    userIds: number[] | undefined,
    locale: Locale,
  ): Promise<string[]> {
    if (!userIds?.length) {
      return [];
    }

    const uniqueIds = [...new Set(userIds)];
    const users = await this.prisma.utilisateur.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true, email: true },
    });

    if (users.length !== uniqueIds.length) {
      const found = new Set(users.map((u) => u.id));
      const missing = uniqueIds.filter((id) => !found.has(id));
      throw new BadRequestException(
        `${translate(locale, "adminEmailUserIdsNotFound")}: ${missing.join(", ")}`,
      );
    }

    return users
      .map((u) => u.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email));
  }
}
