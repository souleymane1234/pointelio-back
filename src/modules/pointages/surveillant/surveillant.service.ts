import { Injectable } from "@nestjs/common";
import {
  MethodePointage,
  Role,
  StatutCompte,
  StatutValidation,
} from "@prisma/client";
import type { Locale } from "../../../common/i18n";
import type { AuthUser } from "../../../common/types/request-context";
import { zonedDayBounds } from "../../../common/utils/zoned-time.util";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import type { PointerSurveillantDto } from "../dto/pointage.dto";
import { PointagesService } from "../pointages.service";
import { ValidationGpsService } from "../validation-gps.service";

@Injectable()
export class SurveillantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointages: PointagesService,
    private readonly gps: ValidationGpsService,
  ) {}

  async employesDuSite(user: AuthUser, entrepriseId: number, locale: Locale) {
    const siteId = await this.pointages.actorSiteId(
      user.id,
      entrepriseId,
      locale,
    );
    const tz = await this.pointages.timeZone(entrepriseId);
    const { start, end } = zonedDayBounds(new Date(), tz);

    const rows = await this.prisma.tenant.utilisateur.findMany({
      where: {
        entrepriseId,
        siteId,
        role: Role.EMPLOYE,
        statut: StatutCompte.ACTIF,
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        matricule: true,
        poste: true,
        photoUrl: true,
        pointages: {
          where: { heureServeur: { gte: start, lt: end } },
          orderBy: { heureServeur: "desc" },
          take: 1,
          select: {
            id: true,
            type: true,
            heureServeur: true,
            statutValidation: true,
          },
        },
      },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    });

    return rows.map(({ pointages, ...employe }) => {
      const last = pointages[0];
      return {
        ...employe,
        dernierPointageJour: last
          ? {
              id: String(last.id),
              type: last.type,
              heureServeur: last.heureServeur,
              statutValidation: last.statutValidation,
            }
          : null,
      };
    });
  }

  async pointerPour(
    user: AuthUser,
    entrepriseId: number,
    dto: PointerSurveillantDto,
    locale: Locale,
  ) {
    const existing = await this.pointages.findByRequestId(
      entrepriseId,
      dto.requestId,
    );
    if (existing) {
      return {
        replay: true as const,
        pointage: await this.pointages.findOne(
          user,
          entrepriseId,
          existing.id,
          locale,
        ),
      };
    }

    const siteId = await this.pointages.actorSiteId(
      user.id,
      entrepriseId,
      locale,
    );
    await this.pointages.requireActifEmploye(
      entrepriseId,
      dto.employeId,
      siteId,
      locale,
    );
    await this.pointages.assertSequence(
      entrepriseId,
      dto.employeId,
      dto.type,
      locale,
    );

    const hasGps = dto.latitude !== undefined && dto.longitude !== undefined;
    let latitude: number | null = null;
    let longitude: number | null = null;
    let precisionM: number | null = null;
    let distanceM: number | null = null;
    let statutValidation: StatutValidation = StatutValidation.VALIDE;
    let motifStatut: string | null = "pointage par surveillant";
    const mockDetecte = dto.mockDetecte === true;

    if (hasGps) {
      const site = await this.prisma.tenant.site.findFirst({
        where: { id: siteId, entrepriseId },
        select: {
          latitude: true,
          longitude: true,
          rayonM: true,
          precisionMaxM: true,
        },
      });
      latitude = dto.latitude ?? null;
      longitude = dto.longitude ?? null;
      precisionM = dto.precisionM ?? 0;
      if (site && latitude !== null && longitude !== null) {
        const gps = this.gps.evaluate(
          {
            latitude,
            longitude,
            precisionM: precisionM ?? 0,
            mockDetecte,
          },
          {
            latitude: Number(site.latitude),
            longitude: Number(site.longitude),
            rayonM: site.rayonM,
            precisionMaxM: site.precisionMaxM,
          },
        );
        distanceM = gps.distanceM;
        statutValidation = gps.statut;
        motifStatut = `pointage par surveillant, ${gps.motifStatut}`;
      }
    } else if (mockDetecte) {
      statutValidation = StatutValidation.A_VERIFIER;
      motifStatut = "pointage par surveillant, position simulée détectée";
    }

    return this.pointages.createOrReplay({
      entrepriseId,
      acteurId: user.id,
      employeId: dto.employeId,
      siteId,
      pointeParId: user.id,
      type: dto.type,
      methode: MethodePointage.SURVEILLANT,
      latitude,
      longitude,
      precisionM,
      distanceM,
      statutValidation,
      motifStatut,
      mockDetecte,
      requestId: dto.requestId,
    });
  }
}
