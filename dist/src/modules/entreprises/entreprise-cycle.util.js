"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextStatut = nextStatut;
const client_1 = require("@prisma/client");
const TRANSITIONS = {
    suspendre: {
        from: [
            client_1.StatutEntreprise.ESSAI,
            client_1.StatutEntreprise.ACTIF,
            client_1.StatutEntreprise.PAIEMENT_EN_ATTENTE,
            client_1.StatutEntreprise.EN_RETARD,
        ],
        to: client_1.StatutEntreprise.SUSPENDU,
    },
    reactiver: {
        from: [client_1.StatutEntreprise.SUSPENDU],
        to: client_1.StatutEntreprise.ACTIF,
    },
    cloturer: {
        from: Object.values(client_1.StatutEntreprise).filter((s) => s !== client_1.StatutEntreprise.RESILIE),
        to: client_1.StatutEntreprise.RESILIE,
    },
};
function nextStatut(action, current) {
    const transition = TRANSITIONS[action];
    return transition.from.includes(current) ? transition.to : null;
}
//# sourceMappingURL=entreprise-cycle.util.js.map