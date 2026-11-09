import "dotenv/config";
import { PrismaClient, Role, StatutCompte, StatutEntreprise } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as bcrypt from "bcrypt";
import { mariadbPoolConfigFromUrl } from "../src/infra/prisma/mariadb-pool-config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(mariadbPoolConfigFromUrl(connectionString)),
});

const SEED_ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL ?? "admin@pointelio.local";
/** Mot de passe commun des comptes e-mail de test (back-office). */
const TEST_PASSWORD = "TestPointelio1";
const DEMO_EMPLOYE_PIN = "0000";
const DEMO_SURVEILLANT_PIN = "1111";

async function upsertUtilisateur(data: {
  email?: string;
  telephone?: string;
  nom: string;
  prenom: string;
  role: Role;
  passwordHash: string;
  entrepriseId?: number;
  siteId?: number;
  horaireId?: number;
  matricule?: string;
  salaireJournalier?: number;
}) {
  const where = data.email
    ? { email: data.email }
    : { telephone: data.telephone as string };
  return prisma.utilisateur.upsert({
    where,
    update: {
      nom: data.nom,
      prenom: data.prenom,
      role: data.role,
      statut: StatutCompte.ACTIF,
      passwordHash: data.passwordHash,
      entrepriseId: data.entrepriseId ?? null,
      siteId: data.siteId ?? null,
      horaireId: data.horaireId ?? null,
      matricule: data.matricule ?? null,
      salaireJournalier: data.salaireJournalier ?? null,
    },
    create: { ...data, statut: StatutCompte.ACTIF },
    select: { id: true },
  });
}

/**
 * Packs par défaut : créés une seule fois, jamais écrasés (les prix, limites et
 * modules se gèrent ensuite depuis le backoffice). Valeurs provisoires.
 */
const DEFAULT_PACKS = [
  {
    code: "STARTER",
    nom: "Starter",
    ordre: 1,
    maxEmployes: 10,
    maxSites: 1,
    essaiJours: 14,
    modules: ["QR", "GPS", "CONGES"],
  },
  {
    code: "BUSINESS",
    nom: "Business",
    ordre: 2,
    maxEmployes: 50,
    maxSites: 3,
    essaiJours: 14,
    modules: [
      "QR",
      "GPS",
      "CONGES",
      "HORAIRES_MULTIPLES",
      "MULTI_SITES",
      "SURVEILLANT",
    ],
  },
  {
    code: "BUSINESS_PLUS",
    nom: "Business+",
    ordre: 3,
    maxEmployes: 150,
    maxSites: 10,
    essaiJours: 14,
    modules: [
      "QR",
      "GPS",
      "CONGES",
      "HORAIRES_MULTIPLES",
      "MULTI_SITES",
      "SURVEILLANT",
      "RAPPORTS_AVANCES",
    ],
  },
  {
    code: "ENTREPRISE",
    nom: "Entreprise",
    ordre: 4,
    maxEmployes: null,
    maxSites: null,
    essaiJours: 0,
    modules: [
      "QR",
      "GPS",
      "CONGES",
      "HORAIRES_MULTIPLES",
      "MULTI_SITES",
      "SURVEILLANT",
      "RAPPORTS_AVANCES",
      "ROLES_AVANCES",
    ],
  },
];

async function seedPacks() {
  for (const pack of DEFAULT_PACKS) {
    await prisma.pack.upsert({
      where: { code: pack.code },
      update: {},
      create: { ...pack, prixMensuel: 0 },
    });
    console.log(`  ✓ Pack ${pack.code}`);
  }
}

async function seedDemoEntreprise(passwordHash: string) {
  const business = await prisma.pack.findUniqueOrThrow({
    where: { code: "BUSINESS" },
    select: { id: true },
  });
  const entrepriseExistante = await prisma.entreprise.findFirst({
    where: { raisonSociale: "Entreprise Démo" },
    select: { id: true },
  });
  const entreprise = entrepriseExistante
    ? await prisma.entreprise.update({
        where: { id: entrepriseExistante.id },
        data: {
          packId: business.id,
          statut: StatutEntreprise.ACTIF,
          profilComplete: true,
          dateEcheance: null,
        },
        select: { id: true },
      })
    : await prisma.entreprise.create({
        data: {
          raisonSociale: "Entreprise Démo",
          nomCommercial: "Démo",
          ville: "Abidjan",
          packId: business.id,
          statut: StatutEntreprise.ACTIF,
          dateDemarrage: new Date(),
          profilComplete: true,
        },
        select: { id: true },
      });

  const horairesJours = [1, 2, 3, 4, 5].map((jour) => ({
    jour,
    heureDebut: "08:00",
    heureFin: "17:00",
  }));
  const site =
    (await prisma.site.findFirst({
      where: { entrepriseId: entreprise.id, nom: "Siège" },
      select: { id: true },
    })) ??
    (await prisma.site.create({
      data: {
        entrepriseId: entreprise.id,
        nom: "Siège",
        adresse: "Plateau, Abidjan",
        latitude: 5.3197,
        longitude: -4.0168,
        qrToken: `demo-${entreprise.id}-siege`,
        horairesJours,
      },
      select: { id: true },
    }));
  await prisma.site.update({
    where: { id: site.id },
    data: { horairesJours },
  });

  const horaire =
    (await prisma.horaire.findFirst({
      where: { entrepriseId: entreprise.id, nom: "Journée" },
      select: { id: true },
    })) ??
    (await prisma.horaire.create({
      data: {
        entrepriseId: entreprise.id,
        nom: "Journée",
        heureDebut: "08:00",
        heureFin: "17:00",
        joursTravail: [1, 2, 3, 4, 5],
      },
      select: { id: true },
    }));

  const comptes = [
    {
      email: "admin.demo@pointelio.local",
      nom: "Démo",
      prenom: "Admin",
      role: Role.ADMIN_CLIENT,
    },
    {
      email: "rh.demo@pointelio.local",
      nom: "Démo",
      prenom: "RH",
      role: Role.RESPONSABLE_RH,
    },
    {
      email: "manager.demo@pointelio.local",
      nom: "Démo",
      prenom: "Manager",
      role: Role.MANAGER,
    },
  ] as const;

  for (const compte of comptes) {
    await upsertUtilisateur({
      ...compte,
      passwordHash,
      entrepriseId: entreprise.id,
    });
    console.log(`  ✓ ${compte.role} ${compte.email}`);
  }

  await upsertUtilisateur({
    telephone: "+2250700000001",
    nom: "Démo",
    prenom: "Surveillant",
    role: Role.SURVEILLANT,
    passwordHash: await bcrypt.hash(DEMO_SURVEILLANT_PIN, 10),
    entrepriseId: entreprise.id,
    siteId: site.id,
    matricule: "SUR-0001",
  });
  console.log(`  ✓ SURVEILLANT +2250700000001 (PIN ${DEMO_SURVEILLANT_PIN})`);

  await upsertUtilisateur({
    telephone: "+2250700000000",
    nom: "Démo",
    prenom: "Employé",
    role: Role.EMPLOYE,
    passwordHash: await bcrypt.hash(DEMO_EMPLOYE_PIN, 10),
    entrepriseId: entreprise.id,
    siteId: site.id,
    horaireId: horaire.id,
    salaireJournalier: 5000,
    matricule: "EMP-0001",
  });
  console.log(`  ✓ EMPLOYE +2250700000000 (PIN ${DEMO_EMPLOYE_PIN})`);
}

async function main() {
  console.log("🌱 Seed — démarrage");
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  await upsertUtilisateur({
    email: SEED_ADMIN_EMAIL,
    nom: "Pointelio",
    prenom: "Admin",
    role: Role.SUPER_ADMIN,
    passwordHash,
  });
  console.log(`  ✓ SUPER_ADMIN ${SEED_ADMIN_EMAIL}`);

  await upsertUtilisateur({
    email: "support@pointelio.local",
    nom: "Pointelio",
    prenom: "Support",
    role: Role.SUPPORT,
    passwordHash,
  });
  console.log("  ✓ SUPPORT support@pointelio.local");

  await seedPacks();
  await seedDemoEntreprise(passwordHash);

  console.log("🌱 Seed terminé.");
  console.log(`   Mot de passe back-office : ${TEST_PASSWORD}`);
  console.log(`   PIN employé : ${DEMO_EMPLOYE_PIN}`);
  console.log(`   PIN surveillant : ${DEMO_SURVEILLANT_PIN}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
