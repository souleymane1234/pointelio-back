-- AlterTable
ALTER TABLE `Utilisateur` ADD COLUMN `salaireJournalier` INTEGER NULL;

-- AlterTable
ALTER TABLE `Site` ADD COLUMN `toleranceMin` INTEGER NOT NULL DEFAULT 15;
ALTER TABLE `Site` ADD COLUMN `horairesJours` JSON NOT NULL DEFAULT (JSON_ARRAY());
