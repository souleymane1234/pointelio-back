"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_UPDATE_SWAGGER_EXAMPLES = void 0;
const client_1 = require("@prisma/client");
exports.USER_UPDATE_SWAGGER_EXAMPLES = {
    suspend: {
        summary: "Suspendre un compte",
        value: {
            statut: client_1.StatutCompte.SUSPENDU,
            suspensionReason: "Départ de l'entreprise",
        },
    },
    restore: {
        summary: "Réactiver un compte",
        value: { statut: client_1.StatutCompte.ACTIF },
    },
    promote: {
        summary: "Changer de rôle",
        value: { role: client_1.Role.MANAGER },
    },
    rattachement: {
        summary: "Réaffecter (changer de site et d'horaire)",
        value: { siteId: 2, horaireId: 3 },
    },
    fire: {
        summary: "Renvoyer (désactiver le compte)",
        value: {
            statut: client_1.StatutCompte.DESACTIVE,
            suspensionReason: "Fin de contrat",
        },
    },
    password: {
        summary: "Réinitialiser le PIN",
        value: { password: "1234" },
    },
};
//# sourceMappingURL=update-user.swagger-examples.js.map