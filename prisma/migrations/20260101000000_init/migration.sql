-- CreateTable
CREATE TABLE `Pack` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prixMensuel` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `maxEmployes` INTEGER NULL,
    `maxSites` INTEGER NULL,
    `essaiJours` INTEGER NOT NULL DEFAULT 0,
    `modules` JSON NOT NULL,
    `ordre` INTEGER NOT NULL DEFAULT 0,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pack_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entreprise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raisonSociale` VARCHAR(191) NOT NULL,
    `nomCommercial` VARCHAR(191) NULL,
    `secteur` VARCHAR(191) NULL,
    `pays` VARCHAR(191) NOT NULL DEFAULT 'CI',
    `ville` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `identifiantLegal` VARCHAR(191) NULL,
    `contactNom` VARCHAR(191) NULL,
    `contactFonction` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactTel` VARCHAR(191) NULL,
    `fuseauHoraire` VARCHAR(191) NOT NULL DEFAULT 'Africa/Abidjan',
    `statut` ENUM('ESSAI', 'ACTIF', 'PAIEMENT_EN_ATTENTE', 'EN_RETARD', 'SUSPENDU', 'RESILIE') NOT NULL DEFAULT 'ESSAI',
    `packId` INTEGER NOT NULL,
    `dateDemarrage` DATETIME(3) NULL,
    `dateEcheance` DATETIME(3) NULL,
    `profilComplete` BOOLEAN NOT NULL DEFAULT false,
    `maxSitesOverride` INTEGER NULL,
    `maxEmployesOverride` INTEGER NULL,
    `modulesOverride` JSON NULL,
    `notesInternes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Entreprise_statut_idx`(`statut`),
    INDEX `Entreprise_packId_idx`(`packId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NULL,
    `siteId` INTEGER NULL,
    `horaireId` INTEGER NULL,
    `matricule` VARCHAR(191) NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NULL,
    `role` ENUM('SUPER_ADMIN', 'SUPPORT', 'ADMIN_CLIENT', 'RESPONSABLE_RH', 'MANAGER', 'SURVEILLANT', 'EMPLOYE') NOT NULL,
    `statut` ENUM('INVITE', 'ACTIF', 'SUSPENDU', 'DESACTIVE') NOT NULL DEFAULT 'INVITE',
    `poste` VARCHAR(191) NULL,
    `dateEmbauche` DATETIME(3) NULL,
    `photoUrl` VARCHAR(191) NULL,
    `mfaActif` BOOLEAN NOT NULL DEFAULT false,
    `derniereConnexion` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    UNIQUE INDEX `Utilisateur_telephone_key`(`telephone`),
    INDEX `Utilisateur_entrepriseId_role_idx`(`entrepriseId`, `role`),
    INDEX `Utilisateur_siteId_idx`(`siteId`),
    UNIQUE INDEX `Utilisateur_entrepriseId_matricule_key`(`entrepriseId`, `matricule`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'SUPPORT', 'ADMIN_CLIENT', 'RESPONSABLE_RH', 'MANAGER', 'SURVEILLANT', 'EMPLOYE') NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expireAt` DATETIME(3) NOT NULL,
    `utiliseeAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Invitation_tokenHash_key`(`tokenHash`),
    INDEX `Invitation_entrepriseId_idx`(`entrepriseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `appareil` VARCHAR(191) NULL,
    `expireAt` DATETIME(3) NOT NULL,
    `revoqueAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RefreshToken_tokenHash_key`(`tokenHash`),
    INDEX `RefreshToken_utilisateurId_idx`(`utilisateurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Site` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NULL,
    `latitude` DECIMAL(10, 7) NOT NULL,
    `longitude` DECIMAL(10, 7) NOT NULL,
    `rayonM` INTEGER NOT NULL DEFAULT 30,
    `precisionMaxM` INTEGER NOT NULL DEFAULT 50,
    `qrToken` VARCHAR(191) NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Site_qrToken_key`(`qrToken`),
    INDEX `Site_entrepriseId_idx`(`entrepriseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `heureDebut` VARCHAR(191) NOT NULL,
    `heureFin` VARCHAR(191) NOT NULL,
    `toleranceMin` INTEGER NOT NULL DEFAULT 15,
    `joursTravail` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Horaire_entrepriseId_idx`(`entrepriseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pointage` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NOT NULL,
    `employeId` INTEGER NOT NULL,
    `siteId` INTEGER NOT NULL,
    `pointeParId` INTEGER NULL,
    `type` ENUM('ARRIVEE', 'DEPART') NOT NULL,
    `methode` ENUM('QR_GPS', 'SURVEILLANT') NOT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `precisionM` DOUBLE NULL,
    `distanceM` DOUBLE NULL,
    `statutValidation` ENUM('VALIDE', 'A_VERIFIER', 'HORS_ZONE') NOT NULL,
    `motifStatut` VARCHAR(191) NULL,
    `mockDetecte` BOOLEAN NOT NULL DEFAULT false,
    `requestId` VARCHAR(191) NOT NULL,
    `heureServeur` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Pointage_requestId_key`(`requestId`),
    INDEX `Pointage_entrepriseId_heureServeur_idx`(`entrepriseId`, `heureServeur`),
    INDEX `Pointage_employeId_heureServeur_idx`(`employeId`, `heureServeur`),
    INDEX `Pointage_siteId_heureServeur_idx`(`siteId`, `heureServeur`),
    INDEX `Pointage_statutValidation_idx`(`statutValidation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PointageCorrection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pointageId` BIGINT NOT NULL,
    `auteurId` INTEGER NOT NULL,
    `motif` VARCHAR(191) NOT NULL,
    `avant` JSON NOT NULL,
    `apres` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PointageCorrection_pointageId_idx`(`pointageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Demande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NOT NULL,
    `employeId` INTEGER NOT NULL,
    `type` ENUM('CONGE_ANNUEL', 'MALADIE', 'AUTORISATION', 'RECUPERATION', 'AUTRE') NOT NULL,
    `dateDebut` DATE NOT NULL,
    `dateFin` DATE NOT NULL,
    `nbJours` DOUBLE NULL,
    `commentaire` TEXT NULL,
    `justificatifUrl` VARCHAR(191) NULL,
    `statut` ENUM('EN_ATTENTE', 'APPROUVEE', 'REFUSEE', 'ANNULEE') NOT NULL DEFAULT 'EN_ATTENTE',
    `decideurId` INTEGER NULL,
    `decisionMotif` VARCHAR(191) NULL,
    `decideAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Demande_entrepriseId_statut_idx`(`entrepriseId`, `statut`),
    INDEX `Demande_employeId_idx`(`employeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `periodeDebut` DATE NOT NULL,
    `periodeFin` DATE NOT NULL,
    `lignes` JSON NOT NULL,
    `montantHT` INTEGER NOT NULL,
    `taxes` INTEGER NOT NULL DEFAULT 0,
    `montantTTC` INTEGER NOT NULL,
    `echeance` DATE NOT NULL,
    `statut` ENUM('BROUILLON', 'EMISE', 'PAYEE', 'EN_RETARD', 'ANNULEE') NOT NULL DEFAULT 'EMISE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Facture_numero_key`(`numero`),
    INDEX `Facture_entrepriseId_statut_idx`(`entrepriseId`, `statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paiement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `factureId` INTEGER NOT NULL,
    `montant` INTEGER NOT NULL,
    `moyen` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NULL,
    `recuUrl` VARCHAR(191) NULL,
    `payeAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Paiement_factureId_idx`(`factureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `luAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_utilisateurId_luAt_idx`(`utilisateurId`, `luAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `entrepriseId` INTEGER NULL,
    `acteurId` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `objet` VARCHAR(191) NULL,
    `objetId` VARCHAR(191) NULL,
    `details` JSON NULL,
    `ip` VARCHAR(191) NULL,
    `resultat` VARCHAR(191) NOT NULL DEFAULT 'OK',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_entrepriseId_createdAt_idx`(`entrepriseId`, `createdAt`),
    INDEX `AuditLog_acteurId_idx`(`acteurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Entreprise` ADD CONSTRAINT `Entreprise_packId_fkey` FOREIGN KEY (`packId`) REFERENCES `Pack`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_horaireId_fkey` FOREIGN KEY (`horaireId`) REFERENCES `Horaire`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horaire` ADD CONSTRAINT `Horaire_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pointage` ADD CONSTRAINT `Pointage_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pointage` ADD CONSTRAINT `Pointage_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pointage` ADD CONSTRAINT `Pointage_pointeParId_fkey` FOREIGN KEY (`pointeParId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pointage` ADD CONSTRAINT `Pointage_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointageCorrection` ADD CONSTRAINT `PointageCorrection_pointageId_fkey` FOREIGN KEY (`pointageId`) REFERENCES `Pointage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointageCorrection` ADD CONSTRAINT `PointageCorrection_auteurId_fkey` FOREIGN KEY (`auteurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demande` ADD CONSTRAINT `Demande_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demande` ADD CONSTRAINT `Demande_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demande` ADD CONSTRAINT `Demande_decideurId_fkey` FOREIGN KEY (`decideurId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_factureId_fkey` FOREIGN KEY (`factureId`) REFERENCES `Facture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_acteurId_fkey` FOREIGN KEY (`acteurId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
