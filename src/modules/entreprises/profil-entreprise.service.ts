import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { translate, type Locale } from "../../common/i18n";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
} from "../audit/shared/audit-actions.constants";
import {
  ENTREPRISE_PROFIL_SELECT,
  isProfilComplete,
} from "./constants/entreprise-select";
import type { UpdateProfilEntrepriseDto } from "./dto/update-entreprise.dto";

/** Profil complété par l'entreprise cliente elle-même. */
@Injectable()
export class ProfilEntrepriseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditActions: AuditActionsService,
  ) {}

  async get(entrepriseId: number, locale: Locale) {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: ENTREPRISE_PROFIL_SELECT,
    });
    if (!entreprise) {
      throw new NotFoundException(translate(locale, "entrepriseNotFound"));
    }
    return entreprise;
  }

  async update(
    acteurId: number,
    entrepriseId: number,
    dto: UpdateProfilEntrepriseDto,
    locale: Locale,
  ) {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw new UnprocessableEntityException(
        validationErrorResponse(
          [translate(locale, "entrepriseUpdateEmpty")],
          undefined,
          locale,
        ),
      );
    }
    const current = await this.get(entrepriseId, locale);

    const updated = await this.prisma.entreprise.update({
      where: { id: entrepriseId },
      data: {
        ...dto,
        profilComplete: isProfilComplete({ ...current, ...dto }),
      },
      select: ENTREPRISE_PROFIL_SELECT,
    });
    await this.auditActions.domainAction({
      acteurId,
      action: AUDIT_ACTIONS.ENTREPRISE_MODIFIEE,
      objet: AUDIT_OBJETS.ENTREPRISE,
      objetId: entrepriseId,
      entrepriseId,
      details: { updatedFields: Object.keys(dto), source: "profil" },
    });
    return updated;
  }
}
