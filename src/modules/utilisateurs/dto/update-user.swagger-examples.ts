import type { ExamplesObject } from "@nestjs/swagger";
import { Role, StatutCompte } from "@prisma/client";

/** Exemples Swagger pour `PATCH /admin/users/:id`. */
export const USER_UPDATE_SWAGGER_EXAMPLES: ExamplesObject = {
  suspend: {
    summary: "Suspendre un compte",
    value: {
      statut: StatutCompte.SUSPENDU,
      suspensionReason: "Départ de l'entreprise",
    },
  },
  restore: {
    summary: "Réactiver un compte",
    value: { statut: StatutCompte.ACTIF },
  },
  promote: {
    summary: "Changer de rôle",
    value: { role: Role.MANAGER },
  },
  rattachement: {
    summary: "Réaffecter (changer de site et d'horaire)",
    value: { siteId: 2, horaireId: 3 },
  },
  fire: {
    summary: "Renvoyer (désactiver le compte)",
    value: {
      statut: StatutCompte.DESACTIVE,
      suspensionReason: "Fin de contrat",
    },
  },
  password: {
    summary: "Réinitialiser le PIN",
    value: { password: "1234" },
  },
};
