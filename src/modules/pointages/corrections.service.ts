import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import type { AuthUser } from "../../common/types/request-context";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
} from "../audit/shared/audit-actions.constants";
import type { CorrigerPointageDto } from "./dto/pointage.dto";
import {
  CORRECTION_SELECT,
  normalizeCorrection,
  POINTAGE_SELECT,
  snapshotPointage,
} from "./pointage.select";
import { PointagesService } from "./pointages.service";

/**
 * La valeur d'origine n'est pas perdue : chaque correction stocke avant/après
 * et met à jour le pointage (type, site, heure, statut). GPS d'origine conservé.
 */
@Injectable()
export class CorrectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointages: PointagesService,
    private readonly auditActions: AuditActionsService,
  ) {}

  async list(
    user: AuthUser,
    entrepriseId: number,
    pointageId: bigint,
    locale: Locale,
  ) {
    await this.pointages.findOne(user, entrepriseId, pointageId, locale);
    const rows = await this.prisma.pointageCorrection.findMany({
      where: { pointageId },
      select: CORRECTION_SELECT,
      orderBy: { createdAt: "asc" },
    });
    return rows.map(normalizeCorrection);
  }

  async corriger(
    user: AuthUser,
    entrepriseId: number,
    pointageId: bigint,
    dto: CorrigerPointageDto,
    locale: Locale,
  ) {
    const { motif, ...patch } = dto;
    if (
      patch.type === undefined &&
      patch.siteId === undefined &&
      patch.heureServeur === undefined &&
      patch.statutValidation === undefined &&
      patch.motifStatut === undefined
    ) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "pointageCorrectionEmpty")],
          undefined,
          locale,
        ),
      );
    }

    const current = await this.prisma.tenant.pointage.findFirst({
      where: { id: pointageId, entrepriseId },
      select: POINTAGE_SELECT,
    });
    if (!current) {
      throw new NotFoundException(translate(locale, "pointageNotFound"));
    }
    this.pointages.assertCanRead(user, current);
    await this.pointages.assertCanReadSite(user, entrepriseId, current.siteId);

    if (patch.siteId !== undefined) {
      const site = await this.prisma.tenant.site.findFirst({
        where: { id: patch.siteId, entrepriseId },
        select: { id: true },
      });
      if (!site) {
        throw new UnprocessableEntityException(
          validationErrorResponse(
            [translate(locale, "siteNotFound")],
            undefined,
            locale,
          ),
        );
      }
    }

    const avant = snapshotPointage(current);
    const data: Prisma.PointageUncheckedUpdateInput = {};
    if (patch.type !== undefined) data.type = patch.type;
    if (patch.siteId !== undefined) data.siteId = patch.siteId;
    if (patch.heureServeur !== undefined) {
      data.heureServeur = new Date(patch.heureServeur);
    }
    if (patch.statutValidation !== undefined) {
      data.statutValidation = patch.statutValidation;
    }
    if (patch.motifStatut !== undefined) data.motifStatut = patch.motifStatut;

    const [updated, correction] = await this.prisma.$transaction([
      this.prisma.pointage.update({
        where: { id: pointageId, entrepriseId },
        data,
        select: POINTAGE_SELECT,
      }),
      this.prisma.pointageCorrection.create({
        data: {
          pointageId,
          auteurId: user.id,
          motif,
          avant,
          apres: {
            ...avant,
            ...(patch.type !== undefined ? { type: patch.type } : {}),
            ...(patch.siteId !== undefined ? { siteId: patch.siteId } : {}),
            ...(patch.heureServeur !== undefined
              ? { heureServeur: new Date(patch.heureServeur).toISOString() }
              : {}),
            ...(patch.statutValidation !== undefined
              ? { statutValidation: patch.statutValidation }
              : {}),
            ...(patch.motifStatut !== undefined
              ? { motifStatut: patch.motifStatut }
              : {}),
          },
        },
        select: CORRECTION_SELECT,
      }),
    ]);

    await this.auditActions.domainAction({
      acteurId: user.id,
      action: AUDIT_ACTIONS.POINTAGE_CORRIGE,
      objet: AUDIT_OBJETS.POINTAGE,
      objetId: String(updated.id),
      entrepriseId,
      details: { motif, correctionId: correction.id },
    });

    return normalizeCorrection(correction);
  }
}
