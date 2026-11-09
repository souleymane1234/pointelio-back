import { type Locale } from "../../../common/i18n";
import { PrismaService } from "../../../infra/prisma/prisma.service";
export declare class UserIdentifiersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    normalizeTelephone(raw: string, locale: Locale): string;
    assertAvailable(values: {
        email?: string | null;
        telephone?: string | null;
        matricule?: string | null;
        entrepriseId: number | null;
    }, locale: Locale, excludeId?: number): Promise<void>;
    private invalid;
}
