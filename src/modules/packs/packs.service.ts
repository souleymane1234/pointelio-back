import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { translate, type Locale } from "../../common/i18n";
import type { MessageKey } from "../../common/i18n/translate";
import { buildPaginationQuery } from "../../common/utils/pagination.util";
import { validationErrorResponse } from "../../common/utils/response.util";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { AuditActionsService } from "../audit/recorder/services/audit-actions.service";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
} from "../audit/shared/audit-actions.constants";
import { normalizePack, PACK_SELECT } from "./constants/pack-select";
import type { CreatePackDto } from "./dto/create-pack.dto";
import type { PacksQueryDto } from "./dto/packs-query.dto";
import type { UpdatePackDto } from "./dto/update-pack.dto";

/** Offres commerciales : modifiables depuis le backoffice, sans toucher au code. */
@Injectable()
export class PacksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditActions: AuditActionsService,
  ) {}

  async findAll(query: PacksQueryDto) {
    const where: Prisma.PackWhereInput = {};
    if (query.actif !== undefined) where.actif = query.actif;
    if (query.search) {
      where.OR = [
        { code: { contains: query.search } },
        { nom: { contains: query.search } },
      ];
    }

    const totalItems = await this.prisma.pack.count({ where });
    const { skip, perPage, pagination } = buildPaginationQuery(
      totalItems,
      query.page,
      query.per_page,
    );
    const rows = await this.prisma.pack.findMany({
      where,
      select: PACK_SELECT,
      orderBy: [{ ordre: "asc" }, { id: "asc" }],
      skip,
      take: perPage,
    });
    return { data: rows.map(normalizePack), pagination };
  }

  async findOne(id: number, locale: Locale) {
    const pack = await this.prisma.pack.findUnique({
      where: { id },
      select: PACK_SELECT,
    });
    if (!pack) {
      throw new NotFoundException(translate(locale, "packNotFound"));
    }
    return normalizePack(pack);
  }

  async create(acteurId: number, dto: CreatePackDto, locale: Locale) {
    await this.assertCodeAvailable(dto.code, locale);
    const pack = await this.prisma.pack.create({
      data: { ...dto, modules: dto.modules },
      select: PACK_SELECT,
    });
    await this.audit(acteurId, AUDIT_ACTIONS.PACK_CREE, pack.id, {
      code: pack.code,
    });
    return normalizePack(pack);
  }

  async update(
    acteurId: number,
    id: number,
    dto: UpdatePackDto,
    locale: Locale,
  ) {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw this.invalid("packUpdateEmpty", locale);
    }
    await this.findOne(id, locale);
    if (dto.code !== undefined) {
      await this.assertCodeAvailable(dto.code, locale, id);
    }

    const pack = await this.prisma.pack.update({
      where: { id },
      data: dto,
      select: PACK_SELECT,
    });
    await this.audit(acteurId, AUDIT_ACTIONS.PACK_MODIFIE, id, {
      updatedFields: Object.keys(dto),
    });
    return normalizePack(pack);
  }

  /** Désactivation : le pack n'est plus proposé, les entreprises abonnées le conservent. */
  async deactivate(acteurId: number, id: number, locale: Locale) {
    await this.findOne(id, locale);
    const pack = await this.prisma.pack.update({
      where: { id },
      data: { actif: false },
      select: PACK_SELECT,
    });
    await this.audit(acteurId, AUDIT_ACTIONS.PACK_DESACTIVE, id);
    return normalizePack(pack);
  }

  private async assertCodeAvailable(
    code: string,
    locale: Locale,
    excludeId?: number,
  ) {
    const existing = await this.prisma.pack.findFirst({
      where: { code, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (existing) {
      throw this.invalid("packCodeAlreadyUsed", locale);
    }
  }

  private audit(
    acteurId: number,
    action:
      | typeof AUDIT_ACTIONS.PACK_CREE
      | typeof AUDIT_ACTIONS.PACK_MODIFIE
      | typeof AUDIT_ACTIONS.PACK_DESACTIVE,
    packId: number,
    details?: Prisma.InputJsonValue,
  ) {
    return this.auditActions.domainAction({
      acteurId,
      action,
      objet: AUDIT_OBJETS.PACK,
      objetId: packId,
      entrepriseId: null,
      details,
    });
  }

  private invalid(key: MessageKey, locale: Locale) {
    return new UnprocessableEntityException(
      validationErrorResponse([translate(locale, key)], undefined, locale),
    );
  }
}
