import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../../infra/prisma/prisma.service";
import { getRequestStore } from "../../../../common/context/request-store";
import type { RecordAuditActionInput } from "../../shared/audit-trails.types";

@Injectable()
export class AuditTrailRecorderService {
  private readonly logger = new Logger(AuditTrailRecorderService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** N'échoue jamais : un audit perdu ne doit pas faire échouer l'action métier. */
  async recordAction(input: RecordAuditActionInput): Promise<void> {
    try {
      const ctx = getRequestStore();
      const entrepriseId =
        input.entrepriseId !== undefined
          ? input.entrepriseId
          : await this.resolveActeurEntreprise(input.acteurId);

      await this.prisma.auditLog.create({
        data: {
          acteurId: input.acteurId,
          entrepriseId,
          action: input.action,
          objet: input.objet,
          objetId:
            input.objetId !== undefined ? String(input.objetId) : undefined,
          details: input.details ?? undefined,
          ip: input.ip ?? ctx?.ip,
          ...(input.resultat ? { resultat: input.resultat } : {}),
        },
      });
    } catch (error) {
      this.logger.warn(
        `Failed to persist audit action: ${(error as Error).message}`,
      );
    }
  }

  private async resolveActeurEntreprise(
    acteurId: number | undefined,
  ): Promise<number | null> {
    if (!acteurId) return null;
    const acteur = await this.prisma.utilisateur.findUnique({
      where: { id: acteurId },
      select: { entrepriseId: true },
    });
    return acteur?.entrepriseId ?? null;
  }
}
