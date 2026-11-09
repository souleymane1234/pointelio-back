import { randomBytes } from "node:crypto";
import { Injectable } from "@nestjs/common";

/**
 * QR statique d'un site : jeton opaque (192 bits) imprimé sur le site.
 * Le régénérer invalide immédiatement l'ancien QR.
 */
@Injectable()
export class QrService {
  generateToken(): string {
    return randomBytes(24).toString("base64url");
  }
}
