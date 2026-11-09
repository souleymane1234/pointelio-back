import type { Prisma } from "@prisma/client";
import type { AuditActionCode, AuditObjet } from "./audit-actions.constants";

export interface RecordAuditActionInput {
  acteurId?: number;
  /** Entreprise concernée. Si absent, déduite de l'acteur. */
  entrepriseId?: number | null;
  action: AuditActionCode;
  objet?: AuditObjet;
  objetId?: string | number | bigint;
  details?: Prisma.InputJsonValue;
  ip?: string;
  resultat?: string;
}
