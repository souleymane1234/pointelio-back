import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
  type AuditActionCode,
  type AuditObjet,
} from "../../shared/audit-actions.constants";
import { AuditTrailRecorderService } from "./audit-trail-recorder.service";

type TargetUser = { id: number; entrepriseId: number | null };

@Injectable()
export class AuditActionsService {
  constructor(private readonly recorder: AuditTrailRecorderService) {}

  authLogin(acteurId: number, details?: Prisma.InputJsonValue) {
    return this.selfAction(AUDIT_ACTIONS.CONNEXION, acteurId, details);
  }

  authRefreshToken(acteurId: number, details?: Prisma.InputJsonValue) {
    return this.selfAction(AUDIT_ACTIONS.TOKEN_RENOUVELE, acteurId, details);
  }

  authLogout(acteurId: number, details?: Prisma.InputJsonValue) {
    return this.selfAction(AUDIT_ACTIONS.DECONNEXION, acteurId, details);
  }

  authPasswordReset(acteurId: number, details?: Prisma.InputJsonValue) {
    return this.selfAction(
      AUDIT_ACTIONS.MOT_DE_PASSE_REINITIALISE,
      acteurId,
      details,
    );
  }

  authAccountDeactivate(acteurId: number, details?: Prisma.InputJsonValue) {
    return this.selfAction(AUDIT_ACTIONS.COMPTE_DESACTIVE, acteurId, details);
  }

  profileUpdated(acteurId: number, details?: Prisma.InputJsonValue) {
    return this.selfAction(AUDIT_ACTIONS.PROFIL_MODIFIE, acteurId, details);
  }

  adminUserCreated(
    acteurId: number,
    target: TargetUser,
    details?: Prisma.InputJsonValue,
  ) {
    return this.userAction(
      AUDIT_ACTIONS.UTILISATEUR_CREE,
      acteurId,
      target,
      details,
    );
  }

  adminUserUpdated(
    acteurId: number,
    target: TargetUser,
    details?: Prisma.InputJsonValue,
  ) {
    return this.userAction(
      AUDIT_ACTIONS.UTILISATEUR_MODIFIE,
      acteurId,
      target,
      details,
    );
  }

  adminRoleChanged(
    acteurId: number,
    target: TargetUser,
    details?: Prisma.InputJsonValue,
  ) {
    return this.userAction(
      AUDIT_ACTIONS.ROLE_MODIFIE,
      acteurId,
      target,
      details,
    );
  }

  adminUserSuspended(
    acteurId: number,
    target: TargetUser,
    details?: Prisma.InputJsonValue,
  ) {
    return this.userAction(AUDIT_ACTIONS.SUSPENSION, acteurId, target, details);
  }

  adminUserRestored(
    acteurId: number,
    target: TargetUser,
    details?: Prisma.InputJsonValue,
  ) {
    return this.userAction(
      AUDIT_ACTIONS.REACTIVATION,
      acteurId,
      target,
      details,
    );
  }

  adminUserReassigned(
    acteurId: number,
    target: TargetUser,
    details?: Prisma.InputJsonValue,
  ) {
    return this.userAction(
      AUDIT_ACTIONS.EMPLOYE_REAFFECTE,
      acteurId,
      target,
      details,
    );
  }

  adminUserFired(
    acteurId: number,
    target: TargetUser,
    details?: Prisma.InputJsonValue,
  ) {
    return this.userAction(
      AUDIT_ACTIONS.EMPLOYE_RENVOYE,
      acteurId,
      target,
      details,
    );
  }

  adminNotificationSent(
    acteurId: number,
    entrepriseId: number | null | undefined,
    details?: Prisma.InputJsonValue,
  ) {
    return this.recorder.recordAction({
      acteurId,
      entrepriseId,
      action: AUDIT_ACTIONS.NOTIFICATION_ENVOYEE,
      objet: AUDIT_OBJETS.NOTIFICATION,
      details,
    });
  }

  auditExported(acteurId: number, details?: Prisma.InputJsonValue) {
    return this.recorder.recordAction({
      acteurId,
      action: AUDIT_ACTIONS.EXPORT,
      objet: AUDIT_OBJETS.AUDIT,
      details,
    });
  }

  fileUploaded(
    acteurId: number,
    filePublicId: string,
    details?: Prisma.InputJsonValue,
  ) {
    return this.recorder.recordAction({
      acteurId,
      action: AUDIT_ACTIONS.FICHIER_UPLOADE,
      objet: AUDIT_OBJETS.FICHIER,
      objetId: filePublicId,
      details,
    });
  }

  /**
   * Action d'un module métier sur un objet d'une entreprise.
   * `entrepriseId` explicite : celle de l'objet, pas forcément celle de l'acteur.
   */
  domainAction(input: {
    acteurId: number;
    action: AuditActionCode;
    objet: AuditObjet;
    objetId: number | string;
    entrepriseId: number | null;
    details?: Prisma.InputJsonValue;
  }) {
    return this.recorder.recordAction(input);
  }

  private selfAction(
    action: AuditActionCode,
    acteurId: number,
    details?: Prisma.InputJsonValue,
  ) {
    return this.recorder.recordAction({
      acteurId,
      action,
      objet: AUDIT_OBJETS.UTILISATEUR,
      objetId: acteurId,
      details,
    });
  }

  private userAction(
    action: AuditActionCode,
    acteurId: number,
    target: TargetUser,
    details?: Prisma.InputJsonValue,
  ) {
    return this.recorder.recordAction({
      acteurId,
      entrepriseId: target.entrepriseId,
      action,
      objet: AUDIT_OBJETS.UTILISATEUR,
      objetId: target.id,
      details,
    });
  }
}
