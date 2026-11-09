import type { PackModule } from "../../common/constants/pack-modules.constants";
import { type Locale } from "../../common/i18n";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { type Entitlements } from "./entitlements.util";
export declare class EntitlementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getForEntreprise(entrepriseId: number, locale: Locale): Promise<Entitlements>;
    getUsage(entrepriseId: number): Promise<{
        employes: number;
        sites: number;
    }>;
    hasModule(entrepriseId: number, module: PackModule): Promise<boolean>;
    assertModule(entrepriseId: number, module: PackModule, locale: Locale): Promise<void>;
    assertCanAddSite(entrepriseId: number, locale: Locale): Promise<void>;
    assertCanAddEmploye(entrepriseId: number, locale: Locale, ajout?: number): Promise<void>;
    private countEmployes;
    private limitReached;
}
