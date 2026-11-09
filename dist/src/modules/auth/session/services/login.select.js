"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localLoginUserSelect = exports.authUserSelect = void 0;
exports.authUserSelect = {
    id: true,
    entrepriseId: true,
    siteId: true,
    matricule: true,
    nom: true,
    prenom: true,
    email: true,
    telephone: true,
    role: true,
    poste: true,
    photoUrl: true,
};
exports.localLoginUserSelect = {
    ...exports.authUserSelect,
    passwordHash: true,
    statut: true,
};
//# sourceMappingURL=login.select.js.map