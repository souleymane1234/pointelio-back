"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES_DECOMPTES_EMPLOYES = void 0;
exports.isDecompteEmploye = isDecompteEmploye;
exports.parseModules = parseModules;
exports.computeEntitlements = computeEntitlements;
exports.withinLimit = withinLimit;
const client_1 = require("@prisma/client");
const pack_modules_constants_1 = require("../../common/constants/pack-modules.constants");
exports.ROLES_DECOMPTES_EMPLOYES = [
    client_1.Role.RESPONSABLE_RH,
    client_1.Role.MANAGER,
    client_1.Role.SURVEILLANT,
    client_1.Role.EMPLOYE,
];
function isDecompteEmploye(user) {
    return (user.entrepriseId !== null &&
        exports.ROLES_DECOMPTES_EMPLOYES.includes(user.role) &&
        user.statut !== client_1.StatutCompte.DESACTIVE);
}
function parseModules(value) {
    return Array.isArray(value) ? [...new Set(value.filter(pack_modules_constants_1.isPackModule))] : [];
}
function computeEntitlements(entreprise) {
    const modules = parseModules(entreprise.modulesOverride ?? entreprise.pack.modules);
    const maxSites = entreprise.maxSitesOverride ?? entreprise.pack.maxSites;
    return {
        entrepriseId: entreprise.id,
        statut: entreprise.statut,
        dateEcheance: entreprise.dateEcheance,
        pack: {
            id: entreprise.pack.id,
            code: entreprise.pack.code,
            nom: entreprise.pack.nom,
        },
        limites: {
            maxEmployes: entreprise.maxEmployesOverride ?? entreprise.pack.maxEmployes,
            maxSites: modules.includes(pack_modules_constants_1.PACK_MODULES.MULTI_SITES)
                ? maxSites
                : Math.min(maxSites ?? 1, 1),
        },
        modules,
    };
}
function withinLimit(limit, count, ajout = 1) {
    return limit === null || count + ajout <= limit;
}
//# sourceMappingURL=entitlements.util.js.map