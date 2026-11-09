import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../../infra/prisma/prisma.service";

/** Met à jour `derniereConnexion` à l'ouverture et au renouvellement de session. */
@Injectable()
export class AuthUserSessionService {
  private readonly logger = new Logger(AuthUserSessionService.name);

  constructor(private readonly prisma: PrismaService) {}

  touchLastLoginAt(userId: number): void {
    void this.prisma.utilisateur
      .update({
        where: { id: userId },
        data: { derniereConnexion: new Date() },
      })
      .catch((err: unknown) => {
        this.logger.warn(
          `Failed to update derniereConnexion for user ${userId}`,
          err instanceof Error ? err.stack : String(err),
        );
      });
  }
}
