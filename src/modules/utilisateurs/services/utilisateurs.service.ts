import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { StatutCompte } from "@prisma/client";
import { AuditActionsService } from "../../audit/recorder/services/audit-actions.service";
import type { AuthUser } from "../../../common/types/request-context";
import { translate, type Locale } from "../../../common/i18n";
import type { CreateUserDto } from "../dto/create-user.dto";
import type { MotifRhDto, ReaffecterEmployeDto } from "../dto/rh-actions.dto";
import type { UpdateUserDto } from "../dto/update-user.dto";
import type { UsersQueryDto } from "../dto/users-query.dto";
import { UsersCreateService } from "./users-create.service";
import { UsersListService } from "./users-list.service";
import { UsersUpdateService } from "./users-update.service";

/** Façade utilisée par le contrôleur : délègue aux services list / create / update et trace l'audit. */
@Injectable()
export class UtilisateursService {
  constructor(
    private readonly list: UsersListService,
    private readonly createSvc: UsersCreateService,
    private readonly updateSvc: UsersUpdateService,
    private readonly auditActions: AuditActionsService,
  ) {}

  findAll(actor: AuthUser, query: UsersQueryDto) {
    return this.list.findAll(actor, query);
  }

  findOne(actor: AuthUser, id: number, locale: Locale) {
    return this.list.findOne(actor, id, locale);
  }

  /** Compte actif dès la création : les identifiants sont transmis par l'administrateur. */
  async create(actor: AuthUser, dto: CreateUserDto, locale: Locale) {
    const created = await this.createSvc.create(actor, dto, locale);
    await this.auditActions.adminUserCreated(actor.id, created, {
      role: created.role,
      statut: created.statut,
    });
    return created;
  }

  async update(
    actor: AuthUser,
    id: number,
    dto: UpdateUserDto,
    locale: Locale,
  ) {
    const { user, previous } = await this.updateSvc.update(
      actor,
      id,
      dto,
      locale,
    );

    if (user.role !== previous.role) {
      await this.auditActions.adminRoleChanged(actor.id, user, {
        from: previous.role,
        to: user.role,
      });
    }

    if (user.statut !== previous.statut) {
      if (user.statut === StatutCompte.SUSPENDU) {
        await this.auditActions.adminUserSuspended(
          actor.id,
          user,
          dto.suspensionReason ? { reason: dto.suspensionReason } : undefined,
        );
      } else if (user.statut === StatutCompte.ACTIF) {
        await this.auditActions.adminUserRestored(actor.id, user, {
          from: previous.statut,
        });
      } else if (user.statut === StatutCompte.DESACTIVE) {
        await this.auditActions.adminUserFired(
          actor.id,
          user,
          dto.suspensionReason ? { reason: dto.suspensionReason } : undefined,
        );
      }
    }

    const otherFields = Object.entries(dto)
      .filter(
        ([key, value]) =>
          value !== undefined &&
          !["role", "statut", "suspensionReason", "password"].includes(key),
      )
      .map(([key]) => key);
    if (otherFields.length > 0 || dto.password !== undefined) {
      await this.auditActions.adminUserUpdated(actor.id, user, {
        updatedFields: otherFields,
        passwordChanged: dto.password !== undefined,
      });
    }

    return user;
  }

  /** Changer le site (et optionnellement l'horaire) d'un employé. */
  async reaffecter(
    actor: AuthUser,
    id: number,
    dto: ReaffecterEmployeDto,
    locale: Locale,
  ) {
    this.assertNotSelf(actor, id, locale);
    const current = await this.list.findOne(actor, id, locale);
    if (current.statut === StatutCompte.DESACTIVE) {
      throw new UnprocessableEntityException(
        translate(locale, "userAlreadyInactive"),
      );
    }
    const { user } = await this.updateSvc.update(
      actor,
      id,
      {
        siteId: dto.siteId,
        ...(dto.horaireId !== undefined ? { horaireId: dto.horaireId } : {}),
      },
      locale,
    );
    await this.auditActions.adminUserReassigned(actor.id, user, {
      fromSiteId: current.siteId,
      toSiteId: dto.siteId,
      horaireId: dto.horaireId,
    });
    return user;
  }

  async suspendre(
    actor: AuthUser,
    id: number,
    dto: MotifRhDto,
    locale: Locale,
  ) {
    this.assertNotSelf(actor, id, locale);
    const current = await this.list.findOne(actor, id, locale);
    if (current.statut === StatutCompte.DESACTIVE) {
      throw new UnprocessableEntityException(
        translate(locale, "userAlreadyInactive"),
      );
    }
    return this.update(
      actor,
      id,
      { statut: StatutCompte.SUSPENDU, suspensionReason: dto.motif },
      locale,
    );
  }

  async reactiver(actor: AuthUser, id: number, locale: Locale) {
    this.assertNotSelf(actor, id, locale);
    const current = await this.list.findOne(actor, id, locale);
    if (current.statut === StatutCompte.DESACTIVE) {
      throw new UnprocessableEntityException(
        translate(locale, "userCannotRestoreFired"),
      );
    }
    return this.update(actor, id, { statut: StatutCompte.ACTIF }, locale);
  }

  /** Renvoi : le compte passe à DESACTIVE (plus de connexion, plus de décompte pack). */
  async renvoyer(actor: AuthUser, id: number, dto: MotifRhDto, locale: Locale) {
    this.assertNotSelf(actor, id, locale);
    const current = await this.list.findOne(actor, id, locale);
    if (current.statut === StatutCompte.DESACTIVE) {
      throw new UnprocessableEntityException(
        translate(locale, "userAlreadyInactive"),
      );
    }
    return this.update(
      actor,
      id,
      { statut: StatutCompte.DESACTIVE, suspensionReason: dto.motif },
      locale,
    );
  }

  private assertNotSelf(actor: AuthUser, id: number, locale: Locale) {
    if (actor.id === id) {
      throw new ForbiddenException(translate(locale, "userCannotActOnSelf"));
    }
  }
}
