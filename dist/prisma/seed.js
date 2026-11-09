"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const bcrypt = __importStar(require("bcrypt"));
const mariadb_pool_config_1 = require("../src/infra/prisma/mariadb-pool-config");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_mariadb_1.PrismaMariaDb((0, mariadb_pool_config_1.mariadbPoolConfigFromUrl)(connectionString)),
});
const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@pointelio.local";
const TEST_PASSWORD = "TestPointelio1";
const DEMO_EMPLOYE_PIN = "0000";
const DEMO_SURVEILLANT_PIN = "1111";
async function upsertUtilisateur(data) {
    const where = data.email
        ? { email: data.email }
        : { telephone: data.telephone };
    return prisma.utilisateur.upsert({
        where,
        update: {
            nom: data.nom,
            prenom: data.prenom,
            role: data.role,
            statut: client_1.StatutCompte.ACTIF,
            passwordHash: data.passwordHash,
            entrepriseId: data.entrepriseId ?? null,
            siteId: data.siteId ?? null,
            horaireId: data.horaireId ?? null,
            matricule: data.matricule ?? null,
            salaireJournalier: data.salaireJournalier ?? null,
        },
        create: { ...data, statut: client_1.StatutCompte.ACTIF },
        select: { id: true },
    });
}
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
async function seedDemoEntreprise(passwordHash) {
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
                statut: client_1.StatutEntreprise.ACTIF,
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
                statut: client_1.StatutEntreprise.ACTIF,
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
    const site = (await prisma.site.findFirst({
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
    const horaire = (await prisma.horaire.findFirst({
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
            role: client_1.Role.ADMIN_CLIENT,
        },
        {
            email: "rh.demo@pointelio.local",
            nom: "Démo",
            prenom: "RH",
            role: client_1.Role.RESPONSABLE_RH,
        },
        {
            email: "manager.demo@pointelio.local",
            nom: "Démo",
            prenom: "Manager",
            role: client_1.Role.MANAGER,
        },
    ];
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
        role: client_1.Role.SURVEILLANT,
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
        role: client_1.Role.EMPLOYE,
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
        role: client_1.Role.SUPER_ADMIN,
        passwordHash,
    });
    console.log(`  ✓ SUPER_ADMIN ${SEED_ADMIN_EMAIL}`);
    await upsertUtilisateur({
        email: "support@pointelio.local",
        nom: "Pointelio",
        prenom: "Support",
        role: client_1.Role.SUPPORT,
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
//# sourceMappingURL=seed.js.map