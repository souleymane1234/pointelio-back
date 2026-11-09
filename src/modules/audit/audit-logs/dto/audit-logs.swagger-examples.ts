import type { ExamplesObject } from "@nestjs/swagger";
import {
  AUDIT_ACTIONS,
  AUDIT_OBJETS,
} from "../../shared/audit-actions.constants";

const PAGINATION = {
  current_page: 1,
  total_pages: 5,
  per_page: 10,
  total_items: 42,
} as const;

const ACTEURS = {
  admin: { id: 2, nom: "Koné", prenom: "Awa", email: "awa@acme.ci" },
  employe: { id: 12, nom: "Traoré", prenom: "Moussa", email: "moussa@acme.ci" },
} as const;

/** Exemples de réponse pour `GET /admin/audit-trails/audit-logs`. */
export const AUDIT_LOGS_LIST_RESPONSE_SWAGGER_EXAMPLES: ExamplesObject = {
  mixed: {
    summary: "Page mixte — plusieurs types d'actions",
    value: {
      success: true,
      message: "Logs d'audit récupérés avec succès",
      data: [
        {
          id: "1024",
          entrepriseId: 1,
          acteurId: ACTEURS.employe.id,
          acteur: ACTEURS.employe,
          action: AUDIT_ACTIONS.CONNEXION,
          objet: AUDIT_OBJETS.UTILISATEUR,
          objetId: String(ACTEURS.employe.id),
          details: null,
          ip: "196.168.1.42",
          resultat: "OK",
          createdAt: "2026-05-22T08:15:00.000Z",
        },
        {
          id: "1025",
          entrepriseId: 1,
          acteurId: ACTEURS.admin.id,
          acteur: ACTEURS.admin,
          action: AUDIT_ACTIONS.ROLE_MODIFIE,
          objet: AUDIT_OBJETS.UTILISATEUR,
          objetId: String(ACTEURS.employe.id),
          details: { from: "EMPLOYE", to: "MANAGER" },
          ip: "10.0.0.12",
          resultat: "OK",
          createdAt: "2026-05-22T09:00:00.000Z",
        },
      ],
      pagination: PAGINATION,
    },
  },
  empty: {
    summary: "Liste vide — aucun log pour les filtres appliqués",
    value: {
      success: true,
      message: "Logs d'audit récupérés avec succès",
      data: [],
      pagination: {
        current_page: 1,
        total_pages: 1,
        per_page: 10,
        total_items: 0,
      },
    },
  },
};
