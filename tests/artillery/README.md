# Tests de charge Artillery

Squelette de tests de charge : un parcours de référence (`scenarios/flow.yml`) et deux profils de charge (`smoke`, `load`) définis dans `run.js`.

## Lancer

```bash
npm run artillery:smoke   # 2 utilisateurs virtuels, 15 s
npm run artillery:load    # montée à 10 arrivées/s, ~8 min
```

Les scripts chargent le `.env` racine. Variables utiles :

| Variable | Défaut |
| --- | --- |
| `ARTILLERY_BASE_URL` (ou `BASE_URL`) | `http://localhost:3000/api/v1` |
| `ARTILLERY_ADMIN_EMAIL` | `SEED_ADMIN_EMAIL`, sinon `admin@app.local` |
| `ARTILLERY_ADMIN_PASSWORD` | `SEED_ADMIN_PASSWORD`, sinon `ChangeMe123!` |

Une URL qui n'est ni locale ni `dev` / `staging` / `test` est refusée, sauf `ALLOW_PRODUCTION=1`.

Les rapports JSON sont écrits dans `results/` (ignoré par git).

## Étendre

- Ajouter des requêtes nommées (`name: ...`) dans `scenarios/flow.yml`. Les métriques sont agrégées par nom.
- Ajouter un profil (phases et seuils p95 par requête) dans `PROFILES` de `run.js`, puis un script `artillery:<profil>` dans `package.json`.
- Les helpers partagés (ex. `withAuth`) vivent dans `processors/auth.js`.
