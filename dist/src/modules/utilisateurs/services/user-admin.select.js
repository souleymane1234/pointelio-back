"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ADMIN_SELECT = exports.USERS_BCRYPT_ROUNDS = void 0;
exports.normalizeUserAdmin = normalizeUserAdmin;
exports.USERS_BCRYPT_ROUNDS = 10;
exports.USER_ADMIN_SELECT = {
    id: true,
    entrepriseId: true,
    siteId: true,
    horaireId: true,
    matricule: true,
    nom: true,
    prenom: true,
    email: true,
    telephone: true,
    passwordHash: true,
    role: true,
    statut: true,
    poste: true,
    salaireJournalier: true,
    dateEmbauche: true,
    photoUrl: true,
    mfaActif: true,
    derniereConnexion: true,
    createdAt: true,
    updatedAt: true,
    entreprise: { select: { id: true, raisonSociale: true } },
    site: { select: { id: true, nom: true } },
    horaire: { select: { id: true, nom: true } },
};
function normalizeUserAdmin(u) {
    const { passwordHash, ...rest } = u;
    return {
        ...rest,
        fullName: `${u.prenom} ${u.nom}`.trim(),
        hasPassword: Boolean(passwordHash),
    };
}
//# sourceMappingURL=user-admin.select.js.map