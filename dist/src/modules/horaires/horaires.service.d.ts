import { type Locale } from "../../common/i18n";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import { EntitlementsService } from "../entitlements/entitlements.service";
import type { CreateHoraireDto, UpdateHoraireDto } from "./dto/horaire.dto";
export declare class HorairesService {
    private readonly prisma;
    private readonly entitlements;
    private readonly auditActions;
    constructor(prisma: PrismaService, entitlements: EntitlementsService, auditActions: AuditActionsService);
    findAll(entrepriseId: number): Promise<{
        joursTravail: number[];
        utilisateursCount: number;
        id: number;
        entrepriseId: number;
        nom: string;
        createdAt: Date;
        toleranceMin: number;
        heureDebut: string;
        heureFin: string;
    }[]>;
    findOne(entrepriseId: number, id: number, locale: Locale): Promise<{
        joursTravail: number[];
        utilisateursCount: number;
        id: number;
        entrepriseId: number;
        nom: string;
        createdAt: Date;
        toleranceMin: number;
        heureDebut: string;
        heureFin: string;
    }>;
    create(acteurId: number, entrepriseId: number, dto: CreateHoraireDto, locale: Locale): Promise<{
        joursTravail: number[];
        utilisateursCount: number;
        id: number;
        entrepriseId: number;
        nom: string;
        createdAt: Date;
        toleranceMin: number;
        heureDebut: string;
        heureFin: string;
    }>;
    update(acteurId: number, entrepriseId: number, id: number, dto: UpdateHoraireDto, locale: Locale): Promise<{
        joursTravail: number[];
        utilisateursCount: number;
        id: number;
        entrepriseId: number;
        nom: string;
        createdAt: Date;
        toleranceMin: number;
        heureDebut: string;
        heureFin: string;
    }>;
    remove(acteurId: number, entrepriseId: number, id: number, locale: Locale): Promise<void>;
    private audit;
    private invalid;
}
