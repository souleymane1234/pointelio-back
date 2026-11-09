"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAbonnementBloque = isAbonnementBloque;
const client_1 = require("@prisma/client");
function isAbonnementBloque(statut, dateEcheance, now = new Date()) {
    if (statut === client_1.StatutEntreprise.SUSPENDU ||
        statut === client_1.StatutEntreprise.RESILIE) {
        return true;
    }
    return (statut === client_1.StatutEntreprise.ESSAI &&
        dateEcheance !== null &&
        dateEcheance.getTime() < now.getTime());
}
//# sourceMappingURL=abonnement.util.js.map