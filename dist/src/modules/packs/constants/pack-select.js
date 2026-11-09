"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACK_SELECT = void 0;
exports.normalizePack = normalizePack;
const entitlements_util_1 = require("../../entitlements/entitlements.util");
exports.PACK_SELECT = {
    id: true,
    code: true,
    nom: true,
    prixMensuel: true,
    description: true,
    maxEmployes: true,
    maxSites: true,
    essaiJours: true,
    modules: true,
    ordre: true,
    actif: true,
    createdAt: true,
    updatedAt: true,
    _count: { select: { entreprises: true } },
};
function normalizePack(row) {
    const { _count, ...pack } = row;
    return {
        ...pack,
        modules: (0, entitlements_util_1.parseModules)(pack.modules),
        entreprisesCount: _count.entreprises,
    };
}
//# sourceMappingURL=pack-select.js.map