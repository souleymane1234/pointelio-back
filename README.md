# TheFlow — NestJS Template

```
 _____ _            ___ _
/__   \ |__   ___  / __\ | _____      __
  / /\/ '_ \ / _ \/ _\ | |/ _ \ \ /\ / /
 / /  | | | |  __/ /   | | (_) \ V  V /
 \/   |_| |_|\___\/    |_|\___/ \_/\_/
```

Socle backend NestJS prêt pour la production : authentification JWT (téléphone + PIN ou e-mail + mot de passe, sans SMS ni OTP), permissions fines backoffice, audit, notifications in-app / push / temps réel, e-mails, uploads et cache en mémoire.

Un module d'exemple (`src/examples`) montre la convention à suivre pour chaque nouveau domaine.

## Stack

- **NestJS 11**, TypeScript
- **Prisma 7** (adapter MariaDB) sur MySQL, schéma multi-fichiers
- **Socket.IO** (namespace `/realtime`)
- **Swagger** (thème sombre) sur `/api/v1/docs`
- Intégrations optionnelles : **Cloudinary** (uploads), **Firebase** (push), **SMTP** (nodemailer)

## Démarrage rapide

```bash
npm install
cp .env.example .env          # puis renseigner JWT_SECRET (32 caractères min.)
docker compose up -d          # MySQL + Mailpit locaux
npm run prisma:generate       # génère le client Prisma (requis avant seed / start)
npm run prisma:migrate:deploy # applique la migration initiale
npm run prisma:seed           # admin@app.local / ChangeMe123! + un utilisateur démo
npm run start:dev
```

`npm run prisma:generate` est à relancer après chaque modification de `prisma/models/*.prisma` (`npm run prisma:migrate` le fait automatiquement). Sans lui, le seed échoue avec `Cannot find module '.prisma/client/default'`.

Les versions des dépendances sont figées par `package-lock.json` : préférer `npm ci` pour installer exactement les mêmes versions que le template.

- API : http://localhost:5000/api/v1
- Swagger : http://localhost:5000/api/v1/docs
- Santé : `/api/v1/health/live` et `/api/v1/health/ready` (MySQL)

Au démarrage, le terminal affiche la bannière TheFlow avec les URLs utiles (`src/common/banner/startup-banner.ts`). Les couleurs sont désactivées hors terminal interactif ou avec `NO_COLOR=1`.

## Personnaliser le template pour un nouveau projet

1. `package.json` : `name`, `description`.
2. `src/common/constants/app.constants.ts` : `APP_NAME` (Swagger, bannière) et `CACHE_KEY_PREFIX`.
3. `src/common/i18n/locales/*.json` : `emailBrandTitle`, `emailSignatureTeam`, textes de pied d'e-mail.
4. `src/emailing/templates/brand.constants.ts` : palette des e-mails.
5. `docker-compose.yml` : noms des conteneurs locaux.
6. Générer les domaines avec `npm run modules:generate -- <domaine>`, puis supprimer le module d'exemple quand il ne sert plus (voir plus bas).

## Modules inclus

| Module | Rôle |
| --- | --- |
| `auth` | Téléphone + PIN (mobile), e-mail + mot de passe (back-office), login admin, refresh, logout, désactivation de compte. Pas de SMS ni d'OTP. |
| `profile` | `GET`/`PATCH /profile/me`, enregistrement du token push |
| `admin/user` | CRUD utilisateurs, réaffectation / suspension / renvoi, réinitialisation du PIN |
| `admin/access` | Catalogue de permissions, modèles (`SUPER_ADMIN`, `USER_MANAGER`, `MARKETING_MANAGER`), `@RequirePermission` |
| `audit-trails` | Journal d'audit (explicite + intercepteur HTTP), logs e-mails, événements analytics, export CSV |
| `notifications` | Notifications in-app, push Firebase, temps réel Socket.IO, envois admin (utilisateur / rôle) |
| `emailing` | Envoi SMTP, endpoint admin, layout HTML + template générique |
| `annonces`, `newsletter` | Annonces avec suivi de lecture, inscriptions newsletter |
| `common/uploads` | Upload Cloudinary (multipart et base64) |
| `cache` | Cache mémoire global, `createCacheNamespace` |
| `socket` | Gateway `/realtime` authentifiée par JWT |
| `health` | Sondes liveness / readiness |

Socle transversal (`src/common`) : format de réponse uniforme, filtre global d'exceptions, validation 422, i18n fr/en, Helmet, CORS, rate limiting, blocage d'IP, mode maintenance, contrôle de version mobile, profilage des requêtes.

## Authentification

Pas de SMS ni d'OTP (ni sur mobile, ni sur le back-office). Les notifications push arriveront plus tard.

- Mobile : `POST /auth/phone/login` `{ phone_number, secret_code }` (PIN à 4 chiffres)
- Back-office employeur : `POST /auth/email/login` `{ email, password }`
- Admin Pointellio / RH web : `POST /auth/admin/login`
- Session : `POST /auth/refresh-token`, `POST /auth/logout`, `POST /auth/deactivate-account`
- Activation d'un compte invité : `POST /invitations/verifier` puis `POST /invitations/accepter` (lien e-mail, pas un code)
- PIN ou mot de passe oublié : un admin RH le réinitialise via `PATCH /admin/users/:id` (`password`)

## Rôles et permissions

- Deux rôles : `USER` (application) et `ADMIN` (backoffice), avec `AdminLevel` (`ADMIN`, `EMPLOYEE`, `SUPPORT`).
- `@Roles(Role.ADMIN)` restreint un contrôleur ; le contrôle est fait par `JwtAuthGuard`.
- `@RequirePermission("module.sousModule.action")` ajoute une permission fine (`PermissionsGuard` global).
- Un admin de niveau `ADMIN` sans `metadata.access` a tous les droits (accès « legacy »). Les droits fins sont stockés dans `AdminProfile.metadata.access`.
- Nouvelles permissions : `src/admin/access/constants/permissions.catalog.ts`.

## Organisation des dossiers

Chaque module NestJS vit dans `src/<module>/`. Deux formes :

- **Module mono-entité** (`examples`, `newsletter`, `annonces`, `profile`, `admin/user`, `admin/access`) : fichiers à plat, rangés par type (structure ci-dessous).
- **Module multi-entités** : un sous-dossier par entité, chacun avec la même structure, plus `shared/` pour ce qui est commun.

```
src/auth/
  auth.module.ts
  shared/          # guard JWT, @Public, @CurrentUser, constantes de validation
  session/         # admin/login, refresh-token, logout, tokens, révocation
  registration/    # création de compte commune aux deux parcours
  phone/           # connexion mobile (téléphone + PIN)
  email/           # connexion back-office (e-mail + mot de passe)
  account/         # désactivation de compte

src/notifications/
  notifications.module.ts, notifications.service.ts  # façade exportée
  inbox/           # notifications de l'utilisateur connecté
  campaigns/       # envois admin et historique
  push/            # Firebase Cloud Messaging
  delivery/        # dispatch in-app + push + Socket.IO
  shared/          # cache

src/audit-trails/
  audit-trails.module.ts, audit-trails.service.ts
  audit-logs/  email-logs/  analytics-events/   # une entité consultable chacune
  recorder/        # enregistrement (intercepteur HTTP, AuditActionsService, contexte)
  shared/          # types

src/emailing/
  emailing.module.ts, emailing.service.ts   # façade exportée
  send/            # transport SMTP et validation
  admin/           # endpoint d'envoi admin
  templates/       # layout HTML et templates
```

`common/` contient uniquement le transversal (filtres, intercepteurs, i18n, utilitaires, helper `ApiDocumentation`) : la doc Swagger d'un endpoint vit dans le dossier `decorators/` de son entité.

## Convention d'un module

```
src/<domaine>/
  <domaine>.module.ts
  <domaine>.controller.ts        # routes fines : locale, appel service, enveloppe de réponse
  <domaine>.service.ts           # façade : délègue read/write, puis audit et jobs
  config/<domaine>-cache.config.ts   # createCacheNamespace + TTL
  constants/<entité>-select.ts   # select Prisma réutilisé
  decorators/api-<domaine>.decorator.ts  # toute la doc Swagger hors du contrôleur
  dto/                           # DTO d'entrée (class-validator) et schémas de réponse Swagger
  services/
    <domaine>-read.service.ts    # lectures mises en cache
    <domaine>-write.service.ts   # écritures + bump de génération du cache
    <domaine>-validation.service.ts
    <domaine>-cache.service.ts
  jobs/                          # producteur, worker, processor, crons
  utils/                         # fonctions pures + *.spec.ts
```

### Générer un domaine

```bash
npm run modules:generate -- products                    # un domaine
npm run modules:generate -- products blog-posts orders  # plusieurs d'un coup
npm run modules:generate -- people:person               # pluriel:singulier si le pluriel est irrégulier
npm run modules:generate -- products --dry-run          # liste les fichiers sans rien écrire
npm run modules:generate -- products --with-cron        # garde le cron de purge des inactifs
```

Le nom est donné au pluriel en kebab-case (le singulier est déduit : `categories` → `category`). Le script copie `src/examples` en renommant fichiers, classes, constantes, routes (`/admin/products`), clés de cache et de queue, puis :

- crée `prisma/models/product.prisma` et la relation `productsCreated` sur `User` ;
- ajoute `PRODUCT` / `PRODUCT_CREATE|UPDATE|DELETE` aux enums d'audit et les méthodes `product*` à `AuditActionsService` ;
- ajoute `PRODUCTS_PERMISSIONS` (`products.products.view|create|update|delete`) au catalogue et à `src/admin/access/index.ts` ;
- ajoute les clés i18n dans `fr.json` / `en.json` ;
- importe `ProductsModule` dans `src/app.module.ts` ;
- formate le tout (Prettier, `prisma format`).

Il refuse un domaine dont le dossier, le modèle Prisma ou les permissions existent déjà (ex. `users` : le modèle `User` existe). Ensuite : adapter les champs (modèle Prisma, DTO, `constants/<entité>-select.ts`), relire les libellés générés, puis `npm run prisma:migrate -- --name add_products`.

Le générateur utilise `src/examples` et `prisma/models/example.prisma` comme modèle : les garder tant que vous générez des domaines.

### Supprimer le module d'exemple

Supprimer le module d'exemple : `src/examples`, `prisma/models/example.prisma`, la relation `examplesCreated` du modèle `User`, `EXAMPLES_PERMISSIONS`, les méthodes `example*` de `AuditActionsService`, les valeurs `EXAMPLE*` des enums d'audit et les clés i18n `example*`.

## Format des réponses

```json
{ "success": true, "message": "…", "data": {} }
```

Listes paginées (statut **206**) :

```json
{
  "success": true,
  "message": "…",
  "data": [],
  "pagination": { "current_page": 1, "total_pages": 1, "per_page": 10, "total_items": 0 }
}
```

Erreurs :

```json
{ "success": false, "message": "Les données fournies sont invalides", "errors": ["…"] }
```

Statuts particuliers : **422** validation, **410** mise à jour mobile requise (si `VERSION_CHECK_ENABLED=1`), **600** maintenance (`MAINTENANCE_ENABLED=1`).

## En-têtes attendus

| En-tête | Requis |
| --- | --- |
| `Accept: application/json` | Oui (sauf routes listées dans `ACCEPT_HEADER_EXEMPT_PATHS`) |
| `language: fr \| en` | Non (défaut `fr`) |
| `Authorization: Bearer <access_token>` | Routes non `@Public()` |
| `app-mobile-platform`, `app-mobile-version` | Si `VERSION_CHECK_ENABLED=1` |

## Socket.IO

```ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000/realtime", {
  path: "/socket.io",
  transports: ["websocket"],
  auth: { token: accessToken },
});

socket.on("notifications.new", (notification) => console.log(notification));
```

Chaque utilisateur rejoint la room `user:<id>` à la connexion.

## Scripts

```bash
npm run start:dev               # watch
npm run build && npm start      # build compilé
npm run lint                    # ESLint (--fix)
npm test                        # tests unitaires
npm run test:e2e                # tests e2e (PostgreSQL requis)
npm run prisma:migrate          # nouvelle migration (dev)
npm run prisma:migrate:deploy   # applique les migrations
npm run prisma:generate         # client Prisma
npm run prisma:seed             # comptes admin + démo
npm run prisma:studio
npm run modules:generate -- <domaine>   # nouveau module depuis src/examples
npm run artillery:smoke         # charge légère (voir tests/artillery/README.md)
npm run artillery:load
```

## Déploiement

- **Railway** : `railway.toml` (migrations puis `npm run start`).
- **CI** : `.gitlab-ci.yml` (validate Prisma, lint, typecheck, tests, build).

En production, `src/config/validation.ts` refuse de démarrer avec un `JWT_SECRET` faible ou avec les options de debug (`SOCKET_AUTH_ALLOW_PLAIN_USERID`, `INVITATION_RETURN_TOKEN_IN_RESPONSE`).

## License

[MIT](LICENSE)

## Auteur

TheFlow - Ylias Gadie
