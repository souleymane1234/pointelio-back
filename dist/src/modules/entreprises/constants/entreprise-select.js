"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTREPRISE_ADMIN_SELECT = exports.ENTREPRISE_PROFIL_SELECT = void 0;
exports.normalizeEntrepriseAdmin = normalizeEntrepriseAdmin;
exports.isProfilComplete = isProfilComplete;
exports.ENTREPRISE_PROFIL_SELECT = {
    id: true,
    raisonSociale: true,
    nomCommercial: true,
    secteur: true,
    pays: true,
    ville: true,
    adresse: true,
    identifiantLegal: true,
    contactNom: true,
    contactFonction: true,
    contactEmail: true,
    contactTel: true,
    fuseauHoraire: true,
    statut: true,
    dateDemarrage: true,
    dateEcheance: true,
    profilComplete: true,
    createdAt: true,
    updatedAt: true,
    pack: { select: { id: true, code: true, nom: true } },
};
exports.ENTREPRISE_ADMIN_SELECT = {
    ...exports.ENTREPRISE_PROFIL_SELECT,
    packId: true,
    maxSitesOverride: true,
    maxEmployesOverride: true,
    modulesOverride: true,
    notesInternes: true,
    _count: { select: { utilisateurs: true, sites: true } },
};
function normalizeEntrepriseAdmin(row) {
    const { _count, ...entreprise } = row;
    return {
        ...entreprise,
        utilisateursCount: _count.utilisateurs,
        sitesCount: _count.sites,
    };
}
function isProfilComplete(e) {
    return Boolean(e.secteur &&
        e.ville &&
        e.adresse &&
        e.contactNom &&
        (e.contactEmail || e.contactTel));
}
//# sourceMappingURL=entreprise-select.js.map