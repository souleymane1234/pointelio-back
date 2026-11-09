import type { ExamplesObject } from "@nestjs/swagger";
import { Role } from "@prisma/client";

/**
 * Exemples Swagger pour `POST /admin/users`.
 * Dans Swagger UI : menu déroulant **Examples** sur le body pour préremplir le JSON.
 */
export const USER_CREATE_SWAGGER_EXAMPLES: ExamplesObject = {
  EMPLOYE: {
    summary: "EMPLOYE — compte mobile avec PIN",
    value: {
      role: Role.EMPLOYE,
      nom: "Traoré",
      prenom: "Moussa",
      telephone: "+2250700000000",
      password: "0000",
      siteId: 1,
      horaireId: 1,
      salaireJournalier: 5000,
      matricule: "EMP-0042",
      poste: "Caissier",
      dateEmbauche: "2026-01-15",
    },
  },
  MANAGER: {
    summary: "MANAGER — compte back-office",
    value: {
      role: Role.MANAGER,
      nom: "Koné",
      prenom: "Awa",
      telephone: "+2250700000002",
      email: "awa.kone@acme.ci",
      password: "ExemplePass8",
      siteId: 1,
    },
  },
  ADMIN_CLIENT: {
    summary: "ADMIN_CLIENT — créé par l'équipe Pointelio",
    description: "`entrepriseId` requis pour l'équipe Pointelio.",
    value: {
      role: Role.ADMIN_CLIENT,
      nom: "Diallo",
      prenom: "Fatou",
      telephone: "+2250700000003",
      email: "fatou.diallo@acme.ci",
      password: "ExemplePass8",
      entrepriseId: 1,
    },
  },
};
