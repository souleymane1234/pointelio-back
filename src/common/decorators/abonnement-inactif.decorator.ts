import { SetMetadata } from "@nestjs/common";
import { ABONNEMENT_INACTIF_AUTORISE_KEY } from "../constants/auth.constants";

/**
 * Laisse passer la route quand l'abonnement est suspendu ou expiré
 * (profil, déconnexion, consultation de l'abonnement…).
 */
export const AutoriseAbonnementInactif = () =>
  SetMetadata(ABONNEMENT_INACTIF_AUTORISE_KEY, true);
