import type { Locale } from "../../../common/i18n";
import type { AuthUser } from "../../../common/types/request-context";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import type { PointerSurveillantDto } from "../dto/pointage.dto";
import { PointagesService } from "../pointages.service";
import { ValidationGpsService } from "../validation-gps.service";
export declare class SurveillantService {
    private readonly prisma;
    private readonly pointages;
    private readonly gps;
    constructor(prisma: PrismaService, pointages: PointagesService, gps: ValidationGpsService);
    employesDuSite(user: AuthUser, entrepriseId: number, locale: Locale): Promise<{
        dernierPointageJour: {
            id: string;
            type: import("@prisma/client").$Enums.TypePointage;
            heureServeur: Date;
            statutValidation: import("@prisma/client").$Enums.StatutValidation;
        } | null;
        id: number;
        matricule: string | null;
        nom: string;
        prenom: string;
        poste: string | null;
        photoUrl: string | null;
    }[]>;
    pointerPour(user: AuthUser, entrepriseId: number, dto: PointerSurveillantDto, locale: Locale): Promise<{
        replay: false;
        pointage: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            employe: {
                salaireJournalier: number | null;
                id: number;
                matricule: string | null;
                nom: string;
                prenom: string;
            };
            site: {
                id: number;
                nom: string;
            };
            pointePar: {
                id: number;
                matricule: string | null;
                nom: string;
                prenom: string;
            } | null;
            retardMinutes: number | null;
            paieValidee: boolean;
            montantJour: number;
            anomalies: import("../anomalies.constants").AnomalieType[];
            entrepriseId: number;
            siteId: number;
            createdAt: Date;
            type: import("@prisma/client").$Enums.TypePointage;
            employeId: number;
            pointeParId: number | null;
            methode: import("@prisma/client").$Enums.MethodePointage;
            precisionM: number | null;
            distanceM: number | null;
            statutValidation: import("@prisma/client").$Enums.StatutValidation;
            motifStatut: string | null;
            mockDetecte: boolean;
            requestId: string;
            heureServeur: Date;
        };
    } | {
        replay: true;
        pointage: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            employe: {
                salaireJournalier: number | null;
                id: number;
                matricule: string | null;
                nom: string;
                prenom: string;
            };
            site: {
                id: number;
                nom: string;
            };
            pointePar: {
                id: number;
                matricule: string | null;
                nom: string;
                prenom: string;
            } | null;
            retardMinutes: number | null;
            paieValidee: boolean;
            montantJour: number;
            anomalies: import("../anomalies.constants").AnomalieType[];
            entrepriseId: number;
            siteId: number;
            createdAt: Date;
            type: import("@prisma/client").$Enums.TypePointage;
            employeId: number;
            pointeParId: number | null;
            methode: import("@prisma/client").$Enums.MethodePointage;
            precisionM: number | null;
            distanceM: number | null;
            statutValidation: import("@prisma/client").$Enums.StatutValidation;
            motifStatut: string | null;
            mockDetecte: boolean;
            requestId: string;
            heureServeur: Date;
        };
    }>;
}
