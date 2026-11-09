"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_CREATE_SWAGGER_EXAMPLES = void 0;
const client_1 = require("@prisma/client");
exports.USER_CREATE_SWAGGER_EXAMPLES = {
    EMPLOYE: {
        summary: "EMPLOYE — compte mobile avec PIN",
        value: {
            role: client_1.Role.EMPLOYE,
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
            role: client_1.Role.MANAGER,
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
            role: client_1.Role.ADMIN_CLIENT,
            nom: "Diallo",
            prenom: "Fatou",
            telephone: "+2250700000003",
            email: "fatou.diallo@acme.ci",
            password: "ExemplePass8",
            entrepriseId: 1,
        },
    },
};
//# sourceMappingURL=create-user.swagger-examples.js.map