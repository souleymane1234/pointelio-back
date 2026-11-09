/**
 * Lance un profil Artillery sur le parcours `scenarios/flow.yml`.
 * Cible : ARTILLERY_BASE_URL, sinon BASE_URL, sinon http://localhost:3000/api/v1.
 * Fonctionne sous Windows, Linux et macOS (Node, pas de syntaxe shell).
 */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const artilleryRoot = __dirname;
const backendRoot = path.resolve(artilleryRoot, '../..');

const PROFILES = {
  smoke: {
    phases: [{ name: 'smoke', duration: 15, arrivalCount: 2, maxVusers: 2 }],
    thresholds: { auth_admin_login: 800, profile_me: 500 },
  },
  load: {
    phases: [
      { name: 'ramp-up', duration: 120, arrivalRate: 2, rampTo: 10, maxVusers: 50 },
      { name: 'hold', duration: 300, arrivalRate: 10, maxVusers: 50 },
      { name: 'ramp-down', duration: 60, arrivalRate: 2, maxVusers: 10 },
    ],
    thresholds: { auth_admin_login: 800, profile_me: 500, examples_list: 500 },
  },
};

function isBlockedProductionUrl(url) {
  if (process.env.ALLOW_PRODUCTION === '1' || process.env.ALLOW_PRODUCTION === 'true') {
    return false;
  }
  if (/localhost|127\.0\.0\.1|192\.168\.|\.local(?:\/|$)/i.test(url)) return false;
  if (/\b(dev|staging|test)\b/i.test(url)) return false;
  return true;
}

function resolveBaseUrl() {
  const raw = (
    process.env.ARTILLERY_BASE_URL ||
    process.env.BASE_URL ||
    'http://localhost:3000/api/v1'
  )
    .trim()
    .replace(/\/$/, '');

  if (isBlockedProductionUrl(raw)) {
    console.error(
      `URL refusée (hors local/dev/staging) : ${raw}. Définir ALLOW_PRODUCTION=1 seulement si c'est voulu.`,
    );
    process.exit(1);
  }
  return raw;
}

function buildOverrides(profile) {
  return {
    config: {
      phases: profile.phases,
      plugins: {
        ensure: {
          maxErrorRate: 1,
          thresholds: Object.entries(profile.thresholds).map(([name, p95]) => ({
            [`plugins.metrics-by-endpoint.response_time.${name}.p95`]: p95,
          })),
        },
      },
    },
  };
}

function main() {
  const name = process.argv[2];
  const profile = PROFILES[name];
  if (!profile) {
    console.error(
      `Profil inconnu "${name || ''}". Attendu : ${Object.keys(PROFILES).join(', ')}`,
    );
    process.exit(1);
  }

  process.env.ARTILLERY_BASE_URL = resolveBaseUrl();
  if (!process.env.LANGUAGE?.trim()) process.env.LANGUAGE = 'fr';
  process.env.ARTILLERY_ADMIN_EMAIL ||= process.env.SEED_ADMIN_EMAIL || 'admin@app.local';
  process.env.ARTILLERY_ADMIN_PASSWORD ||= process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

  const resultsDir = path.join(artilleryRoot, 'results');
  fs.mkdirSync(resultsDir, { recursive: true });
  const output = path.join(resultsDir, `${name}.json`);
  const script = path.join(artilleryRoot, 'scenarios', 'flow.yml');
  const config = path.join(artilleryRoot, 'config', 'common.yml');
  const artilleryBin = path.join(backendRoot, 'node_modules', 'artillery', 'bin', 'run');

  console.log(`[artillery] profil ${name}`);
  console.log(`[artillery] target ${process.env.ARTILLERY_BASE_URL}`);
  console.log(`[artillery] sortie ${output}`);

  const child = spawn(
    process.execPath,
    [
      artilleryBin,
      'run',
      script,
      '--config',
      config,
      '--overrides',
      JSON.stringify(buildOverrides(profile)),
      '--output',
      output,
    ],
    { cwd: backendRoot, stdio: 'inherit', env: process.env },
  );

  child.on('exit', (code) => process.exit(code ?? 1));
}

main();
