"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWAGGER_MOBILE_DESCRIPTION = exports.SWAGGER_DESCRIPTION = exports.SWAGGER_MOBILE_PATH = exports.SWAGGER_PATH = exports.SWAGGER_AUDIENCE_NOTE = exports.SWAGGER_TAG = void 0;
exports.filterOpenApiByTag = filterOpenApiByTag;
exports.SWAGGER_TAG = {
    mobile: "Mobile — client",
    employeur: "Employeur — back-office",
    plateforme: "Plateforme — Pointellio",
};
exports.SWAGGER_AUDIENCE_NOTE = {
    mobile: "**À utiliser par l'application mobile client** (rôles `EMPLOYE` et `SURVEILLANT`).",
    employeur: "**Back-office employeur** (rôles `ADMIN_CLIENT`, `RESPONSABLE_RH`, `MANAGER`). Pas pour l'app employé.",
    plateforme: "**Équipe Pointellio** (`SUPER_ADMIN`, `SUPPORT`). Hors périmètre de l'app mobile client.",
};
const HTTP_METHODS = [
    "get",
    "put",
    "post",
    "delete",
    "options",
    "head",
    "patch",
    "trace",
];
exports.SWAGGER_PATH = "api/v1/docs";
exports.SWAGGER_MOBILE_PATH = "api/v1/docs/mobile";
const MOBILE_ROUTES = `
### Session
| Méthode | Route | Usage |
|---|---|---|
| POST | \`/auth/phone/login\` | Connexion mobile (téléphone + PIN) |
| POST | \`/auth/refresh-token\` | Renouveler les jetons |
| POST | \`/auth/logout\` | Déconnexion |

### Compte
| Méthode | Route | Usage |
|---|---|---|
| GET | \`/profile/me\` | Profil connecté |
| PATCH | \`/profile/me\` | Mettre à jour nom, prénom, e-mail, photo |
| PATCH | \`/profile/me/password\` | Changer son PIN / mot de passe (actuel requis) |
| GET | \`/me/entitlements\` | Modules et limites (afficher/masquer les écrans) |
| POST | \`/auth/deactivate-account\` | Désactiver son compte |

### Pointage
| Méthode | Route | Usage |
|---|---|---|
| POST | \`/pointages/qr\` | Badger (QR + GPS). Idempotence via \`requestId\` |
| GET | \`/pointages\` | Historique (l'employé ne voit que les siens) |
| GET | \`/pointages/:id\` | Détail |
| GET | \`/pointages/surveillant/employes\` | Liste du site (surveillant) |
| POST | \`/pointages/surveillant\` | Badger un employé du site |

### Demandes (module CONGES)
| Méthode | Route | Usage |
|---|---|---|
| GET | \`/demandes\` | Mes demandes |
| POST | \`/demandes\` | Créer (justificatif obligatoire si maladie) |
| GET | \`/demandes/:id\` | Détail |
| PATCH | \`/demandes/:id\` | Modifier une demande en attente |
| POST | \`/demandes/:id/annuler\` | Annuler |

### Notifications in-app, fichiers, présence
| Méthode | Route | Usage |
|---|---|---|
| GET | \`/notifications\` | Boîte de réception |
| GET | \`/notifications/:id\` | Détail |
| PATCH | \`/notifications/:id/read\` | Marquer lue |
| PATCH | \`/notifications/read-all\` | Tout marquer lu |
| POST | \`/uploads/content\` | Justificatif (multipart) |
| GET | \`/dashboard/presence\` | Présence du jour (surveillant : son site) |
`.trim();
exports.SWAGGER_DESCRIPTION = `
Deux documentations :

- **Complète** (cette page) : toutes les routes
- **[Mobile client](/api/v1/docs/mobile)** : uniquement les routes de l'app employé / surveillant

Header \`language\` : \`fr\` ou \`en\`. Authentification : Bearer JWT.

---

## Pas de SMS, pas d'OTP

Aucun envoi de SMS sur la plateforme. Il n'y a pas de code OTP.

- Mobile : connexion \`téléphone + PIN\` uniquement
- Back-office : connexion \`e-mail + mot de passe\`
- Création d'un compte (\`POST /admin/users\`) : **téléphone et mot de passe obligatoires**, e-mail facultatif. Le compte est actif immédiatement, sans validation par e-mail ; l'administrateur transmet lui-même les identifiants. Employé / surveillant : PIN de 4 chiffres
- Changer son PIN / mot de passe : \`PATCH /profile/me/password\` (\`currentPassword\` + \`newPassword\`)
- PIN / mot de passe oublié : un admin RH le réinitialise (\`PATCH /admin/users/:id\` avec \`password\`)
- Comptes invités créés avant la suppression de la validation par e-mail : un admin leur définit un mot de passe (\`PATCH /admin/users/:id\` avec \`password\` et \`statut: ACTIF\`)
- Notifications push : pas encore (inbox in-app seulement)

---

## Application mobile — côté client

Rôles : \`EMPLOYE\`, \`SURVEILLANT\`. Ne pas appeler \`/auth/admin/login\` ni \`/auth/email/login\` depuis l'app employé.

${MOBILE_ROUTES}

Les routes taguées **Mobile — client** sont celles à brancher dans l'app.

---

## Back-office employeur

Rôles : \`ADMIN_CLIENT\`, \`RESPONSABLE_RH\`, \`MANAGER\`. Connexion : \`POST /auth/email/login\` ou \`POST /auth/admin/login\`.

| Usage | Route |
|---|---|
| Sites (jours, GPS, tolérance facultative) | \`/sites\` |
| Horaires | \`/horaires\` |
| Présence / retards / paie du jour | \`GET /dashboard/presence\` |
| Créer / lister les comptes (téléphone obligatoire, e-mail facultatif) | \`/admin/users\` |
| Profil de l'entreprise (admin client) | \`GET\` / \`PATCH /entreprise/profil\` |
| Réaffecter | \`POST /admin/users/:id/reaffecter\` |
| Suspendre / réactiver | \`POST /admin/users/:id/suspendre\` · \`/reactiver\` |
| Renvoyer | \`POST /admin/users/:id/renvoyer\` |
| Réinitialiser le PIN | \`PATCH /admin/users/:id\` \`{ "password": "1234" }\` |
| Décider une demande | \`POST /demandes/:id/decider\` |
| Anomalies / corrections de pointage | \`GET /pointages/anomalies\` · \`POST /pointages/:id/corrections\` |
---

## Plateforme Pointellio

Tags **Plateforme — Pointellio** : packs, entreprises, abonnements admin, support. Hors périmètre de l'app mobile client.
`.trim();
exports.SWAGGER_MOBILE_DESCRIPTION = `
Documentation **restreinte à l'application mobile client** (employé / surveillant).

Connexion : \`POST /auth/phone/login\` (\`phone_number\` + PIN). **Pas de SMS ni d'OTP.** Le PIN initial est donné par l'admin à la création du compte ; l'employé peut le changer via \`PATCH /profile/me/password\`. Un PIN oublié est réinitialisé par un admin RH.

Header \`language\` : \`fr\` ou \`en\`. Auth : Bearer JWT.

${MOBILE_ROUTES}

Voir aussi la [documentation complète](/api/v1/docs) (back-office employeur et équipe Pointellio).
`.trim();
function filterOpenApiByTag(document, tag, options) {
    const paths = {};
    const usedTags = new Set();
    for (const [path, item] of Object.entries(document.paths ?? {})) {
        if (!item)
            continue;
        const next = { ...item };
        let kept = false;
        for (const method of HTTP_METHODS) {
            const op = item[method];
            if (!op)
                continue;
            if (op.tags?.includes(tag)) {
                kept = true;
                const tags = (op.tags ?? []).filter((name) => name !== tag);
                next[method] = { ...op, tags };
                for (const name of tags)
                    usedTags.add(name);
            }
            else {
                delete next[method];
            }
        }
        if (kept) {
            paths[path] = next;
        }
    }
    return {
        ...document,
        info: {
            ...document.info,
            title: `${document.info.title}${options.titleSuffix}`,
            description: options.description,
        },
        paths,
        tags: (document.tags ?? []).filter((entry) => usedTags.has(entry.name)),
    };
}
//# sourceMappingURL=swagger-tags.js.map