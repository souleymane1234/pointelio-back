import { type Locale } from "../../../../common/i18n";
import { PrismaService } from "../../../prisma/prisma.service";
import type { AdminSendEmailDto } from "../dto/admin-send-email.dto";
import { EmailingService } from "../../emailing.service";
export type AdminSendEmailResult = {
    messageId: string;
    accepted: string[];
    rejected: string[];
    to: string[];
};
export declare class AdminEmailingService {
    private readonly prisma;
    private readonly emailing;
    constructor(prisma: PrismaService, emailing: EmailingService);
    send(dto: AdminSendEmailDto, locale: Locale): Promise<AdminSendEmailResult>;
    private resolveEmailsFromUserIds;
}
