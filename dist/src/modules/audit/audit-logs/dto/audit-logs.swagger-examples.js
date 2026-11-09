"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUDIT_LOGS_LIST_RESPONSE_SWAGGER_EXAMPLES = void 0;
const audit_actions_constants_1 = require("../../shared/audit-actions.constants");
const PAGINATION = {
    current_page: 1,
    total_pages: 5,
    per_page: 10,
    total_items: 42,
};
const ACTEURS = {
    admin: { id: 2, nom: "Koné", prenom: "Awa", email: "awa@acme.ci" },
    employe: { id: 12, nom: "Traoré", prenom: "Moussa", email: "moussa@acme.ci" },
};
exports.AUDIT_LOGS_LIST_RESPONSE_SWAGGER_EXAMPLES = {
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
                    action: audit_actions_constants_1.AUDIT_ACTIONS.CONNEXION,
                    objet: audit_actions_constants_1.AUDIT_OBJETS.UTILISATEUR,
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
                    action: audit_actions_constants_1.AUDIT_ACTIONS.ROLE_MODIFIE,
                    objet: audit_actions_constants_1.AUDIT_OBJETS.UTILISATEUR,
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
//# sourceMappingURL=audit-logs.swagger-examples.js.map