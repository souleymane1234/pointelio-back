#!/usr/bin/env node
/**
 * Génère un module CRUD admin à partir du module d'exemple (`src/examples`).
 *
 *   npm run modules:generate -- products
 *   npm run modules:generate -- products blog-posts categories
 *   npm run modules:generate -- people:person      (pluriel:singulier explicite)
 *   npm run modules:generate -- products --with-cron --dry-run
 *
 * Options :
 *   --with-cron  conserve le cron de purge des entrées inactives (désactivé par défaut)
 *   --dry-run    affiche les fichiers concernés sans rien écrire
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE_DIR = path.join(ROOT, "src/examples");
const TEMPLATE_PRISMA = path.join(ROOT, "prisma/models/example.prisma");

const FILES = {
  appModule: path.join(ROOT, "src/app.module.ts"),
  permissionsCatalog: path.join(
    ROOT,
    "src/admin/access/constants/permissions.catalog.ts",
  ),
  accessIndex: path.join(ROOT, "src/admin/access/index.ts"),
  auditActions: path.join(
    ROOT,
    "src/audit-trails/recorder/services/audit-actions.service.ts",
  ),
  enums: path.join(ROOT, "prisma/models/enums.prisma"),
  userModel: path.join(ROOT, "prisma/models/user-auth.prisma"),
  i18nFr: path.join(ROOT, "src/common/i18n/locales/fr.json"),
  i18nEn: path.join(ROOT, "src/common/i18n/locales/en.json"),
};

const KEBAB_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const RESERVED_WORDS = new Set(
  (
    "break case catch class const continue debugger default delete do else enum export extends " +
    "false finally for function if implements import in instanceof interface let new null package " +
    "private protected public return static super switch this throw true try typeof var void " +
    "while with yield await"
  ).split(" "),
);

// ─── CLI ────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const domains = args.filter((a) => !a.startsWith("--"));
const dryRun = flags.has("--dry-run");
const withCron = flags.has("--with-cron");

const unknownFlags = [...flags].filter(
  (f) => !["--dry-run", "--with-cron"].includes(f),
);
if (unknownFlags.length > 0) {
  fail(`Option inconnue : ${unknownFlags.join(", ")}`);
}
if (domains.length === 0) {
  fail(
    "Aucun domaine fourni.\n" +
      "  Usage : npm run modules:generate -- <domaine> [<domaine>...] [--with-cron] [--dry-run]\n" +
      "  Ex.   : npm run modules:generate -- products blog-posts people:person",
  );
}

// ─── Noms ───────────────────────────────────────────────────

function toKebab(raw) {
  return raw
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function mapLastWord(kebab, fn) {
  const words = kebab.split("-");
  words[words.length - 1] = fn(words[words.length - 1]);
  return words.join("-");
}

const UNCOUNTABLE = new Set([
  "news",
  "series",
  "species",
  "data",
  "media",
  "info",
  "information",
  "equipment",
  "feedback",
  "staff",
]);

const IRREGULAR_PLURALS = {
  people: "person",
  children: "child",
  men: "man",
  women: "woman",
  analyses: "analysis",
  statuses: "status",
};

function singularize(word) {
  if (UNCOUNTABLE.has(word)) return word;
  if (IRREGULAR_PLURALS[word]) return IRREGULAR_PLURALS[word];
  if (/[^aeiou]ies$/.test(word)) return word.slice(0, -3) + "y";
  if (/(ss|x|z|ch|sh)es$/.test(word)) return word.slice(0, -2);
  if (/[^s]s$/.test(word)) return word.slice(0, -1);
  return word;
}

function pluralize(word) {
  if (UNCOUNTABLE.has(word)) return word;
  const irregular = Object.keys(IRREGULAR_PLURALS).find(
    (plural) => IRREGULAR_PLURALS[plural] === word,
  );
  if (irregular) return irregular;
  if (/[^aeiou]y$/.test(word)) return word.slice(0, -1) + "ies";
  if (/(s|x|z|ch|sh)$/.test(word)) return word + "es";
  return word + "s";
}

function forms(kebab) {
  const words = kebab.split("-");
  const pascal = words.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  return {
    kebab,
    pascal,
    camel: pascal[0].toLowerCase() + pascal.slice(1),
    upper: words.join("_").toUpperCase(),
    snake: words.join("_"),
    label: words.join(" "),
  };
}

function parseDomain(raw) {
  const [pluralRaw, singularRaw] = raw.split(":");
  let plural = toKebab(pluralRaw);
  let singular = singularRaw ? toKebab(singularRaw) : undefined;

  if (!singular) {
    const lastWord = plural.split("-").pop();
    if (plural.endsWith("s") || IRREGULAR_PLURALS[lastWord]) {
      singular = mapLastWord(plural, singularize);
    } else {
      singular = plural;
      plural = mapLastWord(singular, pluralize);
    }
  }

  for (const name of [plural, singular]) {
    if (!KEBAB_RE.test(name)) {
      fail(
        `« ${raw} » : nom invalide (« ${name} »). Lettres minuscules, chiffres et tirets uniquement.`,
      );
    }
  }
  const reserved = [plural, singular].find((name) =>
    RESERVED_WORDS.has(forms(name).camel),
  );
  if (reserved) {
    fail(
      `« ${raw} » : « ${reserved} » est un mot réservé JavaScript. ` +
        "Précisez pluriel et singulier, ex. `news-items:news-item`.",
    );
  }
  if (plural === singular) {
    fail(
      `« ${raw} » : le pluriel et le singulier sont identiques (« ${plural} »). ` +
        "Précisez-les explicitement, ex. `news-items:news-item`.",
    );
  }
  return { raw, plural: forms(plural), singular: forms(singular) };
}

// ─── Réécriture du template ─────────────────────────────────

/** Découpe une source TS/Prisma en segments code / chaîne / commentaire. */
function splitSegments(src) {
  const segments = [];
  let kind = "code";
  let start = 0;
  let quote = null;
  let i = 0;
  const push = (end, nextKind) => {
    if (end > start) segments.push({ text: src.slice(start, end), kind });
    start = end;
    kind = nextKind;
  };

  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (kind === "code") {
      if (c === "/" && next === "/") {
        push(i, "comment-line");
        i += 2;
      } else if (c === "/" && next === "*") {
        push(i, "comment-block");
        i += 2;
      } else if (c === '"' || c === "'" || c === "`") {
        push(i, "string");
        quote = c;
        i += 1;
      } else {
        i += 1;
      }
    } else if (kind === "string") {
      if (c === "\\") {
        i += 2;
      } else if (c === quote) {
        i += 1;
        push(i, "code");
      } else {
        i += 1;
      }
    } else if (kind === "comment-line") {
      if (c === "\n") push(i, "code");
      i += 1;
    } else if (c === "*" && next === "/") {
      i += 2;
      push(i, "code");
    } else {
      i += 1;
    }
  }
  push(src.length, "code");
  return segments;
}

const TOKEN_RE =
  /examples\.examples\.|EXAMPLES|EXAMPLE|Examples|Example|(?<![A-Za-z])examples|(?<![A-Za-z])example|(?<!\p{L})(?:de l'|[LlDd]')?[Ee]xemples?(?!\p{L})/gu;

const FRENCH_RE = /^(de l'|[LlDd]')?([Ee])xemple(s?)$/;

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

/** « l'exemple » → « le blog post », « de l'exemple » → « du blog post », « d'exemples » → « de blog posts ». */
function renameFrench(token, d) {
  const [, article = "", initial, plural] = token.match(FRENCH_RE);
  const label = plural ? d.plural.label : d.singular.label;
  const prefix = {
    "": "",
    "de l'": "du ",
    "l'": "le ",
    "L'": "Le ",
    "d'": "de ",
    "D'": "De ",
  }[article];
  return prefix + (initial === "E" && !prefix ? capitalize(label) : label);
}

/**
 * Remplace chaque variante du nom « example » par celle du domaine.
 * En minuscules : camelCase dans le code (`examplesRead`, `prisma.example`),
 * kebab-case dans les chaînes et commentaires (chemins, routes, clés de cache).
 * La clé d'option Swagger `example:` est conservée.
 */
function rename(text, kind, d) {
  return text.replace(TOKEN_RE, (token, offset, whole) => {
    const rest = whole.slice(offset + token.length);
    const followedByUpper = /^[A-Z]/.test(rest);
    const lower = (f) =>
      kind === "code" || followedByUpper ? f.camel : f.kebab;
    if (FRENCH_RE.test(token)) return renameFrench(token, d);
    if (
      kind === "code" &&
      /^examples?$/.test(token) &&
      /^\s*:(?!:)/.test(rest)
    ) {
      return token;
    }
    switch (token) {
      case "examples.examples.":
        return `${d.plural.snake}.${d.plural.snake}.`;
      case "EXAMPLES":
        return d.plural.upper;
      case "EXAMPLE":
        return d.singular.upper;
      case "Examples":
        return d.plural.pascal;
      case "Example":
        return d.singular.pascal;
      case "examples":
        return lower(d.plural);
      default:
        return lower(d.singular);
    }
  });
}

function transformSource(src, d) {
  let dropNextNewline = false;
  const out = splitSegments(src)
    .map(({ text, kind }) => {
      if (kind.startsWith("comment") && /Module d'exemple/.test(text)) {
        dropNextNewline = true;
        return "";
      }
      if (dropNextNewline) {
        dropNextNewline = false;
        text = text.replace(/^\n/, "");
      }
      return rename(text, kind, d);
    })
    .join("");
  return out.replace(/^\n+/, "");
}

function transformPath(relPath, d) {
  return relPath.replace(/examples|example/g, (t) =>
    t === "examples" ? d.plural.kebab : d.singular.kebab,
  );
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

// ─── Enregistrement dans les fichiers partagés ──────────────

function insertBefore(content, marker, text, { from = 0, file }) {
  const idx = content.indexOf(marker, from);
  if (idx === -1) {
    fail(`Repère introuvable dans ${rel(file)} : ${JSON.stringify(marker)}`);
  }
  return content.slice(0, idx) + text + content.slice(idx);
}

function indexOrFail(content, marker, file, from = 0) {
  const idx = content.indexOf(marker, from);
  if (idx === -1) {
    fail(`Repère introuvable dans ${rel(file)} : ${JSON.stringify(marker)}`);
  }
  return idx;
}

function registerPermissions(content, d) {
  const file = FILES.permissionsCatalog;
  const constName = `${d.plural.upper}_PERMISSIONS`;
  const key = `${d.plural.snake}.${d.plural.snake}`;

  content = insertBefore(
    content,
    "export const ALL_PERMISSION_KEYS = [",
    `export const ${constName} = {\n` +
      `  VIEW: "${key}.view",\n` +
      `  CREATE: "${key}.create",\n` +
      `  UPDATE: "${key}.update",\n` +
      `  DELETE: "${key}.delete",\n` +
      `} as const;\n\n`,
    { file },
  );

  const allKeys = indexOrFail(
    content,
    "export const ALL_PERMISSION_KEYS = [",
    file,
  );
  content = insertBefore(
    content,
    "] as const;",
    `  ...Object.values(${constName}),\n`,
    { from: allKeys, file },
  );

  const catalog = indexOrFail(
    content,
    "export function getPermissionsCatalog",
    file,
  );
  return insertBefore(
    content,
    "  ];\n}",
    `    groupFrom("${d.plural.snake}", "${d.plural.snake}", [\n` +
      ["VIEW", "CREATE", "UPDATE", "DELETE"]
        .map((a) => `      ${constName}.${a},\n`)
        .join("") +
      `    ]),\n`,
    { from: catalog, file },
  );
}

function registerAccessExport(content, d) {
  return insertBefore(
    content,
    "  ALL_PERMISSION_KEYS,\n}",
    `  ${d.plural.upper}_PERMISSIONS,\n`,
    { file: FILES.accessIndex },
  );
}

function registerAuditEnums(content, d) {
  const file = FILES.enums;
  const entity = indexOrFail(content, "enum AuditEntity {", file);
  content = insertBefore(content, "\n}", `\n  ${d.singular.upper}`, {
    from: entity,
    file,
  });
  const action = indexOrFail(content, "enum AuditAction {", file);
  return insertBefore(
    content,
    "\n}",
    ["CREATE", "UPDATE", "DELETE"]
      .map((a) => `\n  ${d.singular.upper}_${a}`)
      .join(""),
    { from: action, file },
  );
}

function registerAuditActions(content, d) {
  const methods = [
    ["Created", "CREATE"],
    ["Updated", "UPDATE"],
    ["Deleted", "DELETE"],
  ]
    .map(
      ([suffix, action]) =>
        `\n  ${d.singular.camel}${suffix}(\n` +
        `    actorUserId: string,\n` +
        `    ${d.singular.camel}Id: string,\n` +
        `    metadata?: Prisma.InputJsonValue,\n` +
        `  ) {\n` +
        `    return this.recorder.recordAction({\n` +
        `      actorUserId,\n` +
        `      action: AuditAction.${d.singular.upper}_${action},\n` +
        `      entity: AuditEntity.${d.singular.upper},\n` +
        `      entityId: ${d.singular.camel}Id,\n` +
        `      metadata,\n` +
        `    });\n` +
        `  }\n`,
    )
    .join("");
  const classEnd = content.lastIndexOf("\n}");
  if (classEnd === -1)
    fail(`Fin de classe introuvable dans ${rel(FILES.auditActions)}`);
  return content.slice(0, classEnd) + methods + content.slice(classEnd);
}

function registerUserRelation(content, d) {
  const file = FILES.userModel;
  const start = indexOrFail(content, "model User {", file);
  const end = indexOrFail(content, "\n}", file, start);
  const attrs = content.indexOf("\n\n  @@", start);
  const at = attrs !== -1 && attrs < end ? attrs : end;
  const line = `\n  ${d.plural.camel}Created ${d.singular.pascal}[] @relation("${d.singular.pascal}CreatedBy")`;
  return content.slice(0, at) + line + content.slice(at);
}

function registerAppModule(content, d) {
  const file = FILES.appModule;
  const lastImport = content.lastIndexOf("\nimport ");
  if (lastImport === -1) fail(`Imports introuvables dans ${rel(file)}`);
  const importEnd = indexOrFail(content, ";\n", file, lastImport) + 2;
  content =
    content.slice(0, importEnd) +
    `import { ${d.plural.pascal}Module } from "./${d.plural.kebab}/${d.plural.kebab}.module";\n` +
    content.slice(importEnd);

  const imports = indexOrFail(content, "\n  imports: [", file);
  return insertBefore(
    content,
    "\n  ],\n  providers:",
    `\n    ${d.plural.pascal}Module,`,
    {
      from: imports,
      file,
    },
  );
}

const I18N = {
  fr: (d) => ({
    [`${d.plural.camel}Fetched`]: `${capitalize(d.plural.label)} récupérés avec succès`,
    [`${d.singular.camel}Fetched`]: `${capitalize(d.singular.label)} récupéré avec succès`,
    [`${d.singular.camel}Created`]: `${capitalize(d.singular.label)} créé`,
    [`${d.singular.camel}Updated`]: `${capitalize(d.singular.label)} mis à jour`,
    [`${d.singular.camel}Deleted`]: `${capitalize(d.singular.label)} supprimé`,
    [`${d.singular.camel}NotFound`]: `${capitalize(d.singular.label)} introuvable`,
    [`${d.singular.camel}UpdateEmpty`]: "Aucun champ à mettre à jour",
  }),
  en: (d) => ({
    [`${d.plural.camel}Fetched`]: `${capitalize(d.plural.label)} retrieved successfully`,
    [`${d.singular.camel}Fetched`]: `${capitalize(d.singular.label)} retrieved successfully`,
    [`${d.singular.camel}Created`]: `${capitalize(d.singular.label)} created`,
    [`${d.singular.camel}Updated`]: `${capitalize(d.singular.label)} updated`,
    [`${d.singular.camel}Deleted`]: `${capitalize(d.singular.label)} deleted`,
    [`${d.singular.camel}NotFound`]: `${capitalize(d.singular.label)} not found`,
    [`${d.singular.camel}UpdateEmpty`]: "No field to update",
  }),
};

function registerI18n(content, d, locale) {
  const messages = { ...JSON.parse(content), ...I18N[locale](d) };
  return JSON.stringify(messages, null, 2) + "\n";
}

// ─── Vérifications ──────────────────────────────────────────

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function rel(file) {
  return path.relative(ROOT, file);
}

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function checkDomain(d) {
  const problems = [];
  const targetDir = path.join(ROOT, "src", d.plural.kebab);
  const targetPrisma = path.join(
    ROOT,
    "prisma/models",
    `${d.singular.kebab}.prisma`,
  );

  if (fs.existsSync(targetDir)) problems.push(`${rel(targetDir)} existe déjà`);
  if (fs.existsSync(targetPrisma))
    problems.push(`${rel(targetPrisma)} existe déjà`);

  const modelsDir = path.join(ROOT, "prisma/models");
  const modelRe = new RegExp(
    `^\\s*(model|enum|type)\\s+${d.singular.pascal}\\s*\\{`,
    "m",
  );
  for (const file of fs.readdirSync(modelsDir)) {
    if (modelRe.test(read(path.join(modelsDir, file)))) {
      problems.push(
        `le modèle Prisma ${d.singular.pascal} existe déjà (prisma/models/${file})`,
      );
    }
  }
  if (
    new RegExp(`^\\s+${d.singular.upper}\\s*$`, "m").test(read(FILES.enums))
  ) {
    problems.push(
      `la valeur d'enum ${d.singular.upper} existe déjà (prisma/models/enums.prisma)`,
    );
  }
  if (
    read(FILES.permissionsCatalog).includes(`${d.plural.upper}_PERMISSIONS`)
  ) {
    problems.push(
      `${d.plural.upper}_PERMISSIONS existe déjà dans le catalogue`,
    );
  }
  if (problems.length > 0) {
    fail(
      `« ${d.raw} » ne peut pas être généré :\n  - ${problems.join("\n  - ")}`,
    );
  }
}

// ─── Génération ─────────────────────────────────────────────

function generate(d) {
  const written = [];
  const write = (file, content) => {
    written.push(file);
    if (dryRun) return;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  };
  const update = (file, fn) => write(file, fn(read(file)));

  const targetDir = path.join(ROOT, "src", d.plural.kebab);
  for (const file of listFiles(TEMPLATE_DIR)) {
    const relPath = path.relative(TEMPLATE_DIR, file);
    if (!withCron && /-cleanup\.cron\.ts$/.test(relPath)) continue;

    let source = read(file);
    if (!withCron && relPath === "examples.module.ts") {
      source = source
        .split("\n")
        .filter((line) => !/CleanupCron/.test(line))
        .join("\n");
    }
    write(
      path.join(targetDir, transformPath(relPath, d)),
      transformSource(source, d),
    );
  }

  write(
    path.join(ROOT, "prisma/models", `${d.singular.kebab}.prisma`),
    transformSource(read(TEMPLATE_PRISMA), d),
  );

  update(FILES.userModel, (c) => registerUserRelation(c, d));
  update(FILES.enums, (c) => registerAuditEnums(c, d));
  update(FILES.permissionsCatalog, (c) => registerPermissions(c, d));
  update(FILES.accessIndex, (c) => registerAccessExport(c, d));
  update(FILES.auditActions, (c) => registerAuditActions(c, d));
  update(FILES.appModule, (c) => registerAppModule(c, d));
  update(FILES.i18nFr, (c) => registerI18n(c, d, "fr"));
  update(FILES.i18nEn, (c) => registerI18n(c, d, "en"));

  return written;
}

function runQuietly(cmd, cmdArgs) {
  try {
    execFileSync(cmd, cmdArgs, { cwd: ROOT, stdio: "pipe" });
    return true;
  } catch (error) {
    const output = `${error.stdout ?? ""}${error.stderr ?? ""}`.trim();
    if (output) console.warn(output);
    return false;
  }
}

if (!fs.existsSync(TEMPLATE_DIR) || !fs.existsSync(TEMPLATE_PRISMA)) {
  fail(
    "Template introuvable : le générateur copie `src/examples` et `prisma/models/example.prisma`. " +
      "Restaurez-les (git checkout) pour générer un module.",
  );
}

const parsed = domains.map(parseDomain);
const seen = new Set();
for (const d of parsed) {
  if (seen.has(d.plural.kebab))
    fail(`« ${d.plural.kebab} » est fourni plusieurs fois.`);
  seen.add(d.plural.kebab);
  checkDomain(d);
}

const touched = new Set();
for (const d of parsed) {
  const files = generate(d);
  files.forEach((f) => touched.add(f));
  console.log(
    `${dryRun ? "[dry-run] " : ""}✔ ${d.plural.kebab} (${d.plural.pascal}Module, modèle ${d.singular.pascal}, routes /admin/${d.plural.kebab})`,
  );
}

if (dryRun) {
  console.log("\nFichiers qui seraient créés ou modifiés :");
  [...touched].forEach((f) => console.log(`  ${rel(f)}`));
  process.exit(0);
}

const tsFiles = [...touched].filter((f) => f.endsWith(".ts"));
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
if (!runQuietly(npx, ["prettier", "--write", ...tsFiles])) {
  console.warn("⚠ prettier a échoué : lancez `npm run format`.");
}
if (!runQuietly(npx, ["prisma", "format"])) {
  console.warn("⚠ prisma format a échoué : lancez `npm run prisma:format`.");
}

const names = parsed.map((d) => d.plural.kebab).join(", ");
console.log(`
Prochaines étapes :
  1. Adapter les champs : prisma/models/<entité>.prisma, dto/ et constants/<entité>-select.ts de ${names}.
  2. Relire les libellés Swagger / i18n générés (fr.json, en.json).
  3. npm run prisma:migrate -- --name add_${parsed.map((d) => d.plural.snake).join("_")}
  4. npm run start:dev
`);
