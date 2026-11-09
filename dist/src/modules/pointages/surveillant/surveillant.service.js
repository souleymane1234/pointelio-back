"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveillantService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const zoned_time_util_1 = require("../../../common/utils/zoned-time.util");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const pointages_service_1 = require("../pointages.service");
const validation_gps_service_1 = require("../validation-gps.service");
let SurveillantService = class SurveillantService {
    prisma;
    pointages;
    gps;
    constructor(prisma, pointages, gps) {
        this.prisma = prisma;
        this.pointages = pointages;
        this.gps = gps;
    }
    async employesDuSite(user, entrepriseId, locale) {
        const siteId = await this.pointages.actorSiteId(user.id, entrepriseId, locale);
        const tz = await this.pointages.timeZone(entrepriseId);
        const { start, end } = (0, zoned_time_util_1.zonedDayBounds)(new Date(), tz);
        const rows = await this.prisma.tenant.utilisateur.findMany({
            where: {
                entrepriseId,
                siteId,
                role: client_1.Role.EMPLOYE,
                statut: client_1.StatutCompte.ACTIF,
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                matricule: true,
                poste: true,
                photoUrl: true,
                pointages: {
                    where: { heureServeur: { gte: start, lt: end } },
                    orderBy: { heureServeur: "desc" },
                    take: 1,
                    select: {
                        id: true,
                        type: true,
                        heureServeur: true,
                        statutValidation: true,
                    },
                },
            },
            orderBy: [{ nom: "asc" }, { prenom: "asc" }],
        });
        return rows.map(({ pointages, ...employe }) => {
            const last = pointages[0];
            return {
                ...employe,
                dernierPointageJour: last
                    ? {
                        id: String(last.id),
                        type: last.type,
                        heureServeur: last.heureServeur,
                        statutValidation: last.statutValidation,
                    }
                    : null,
            };
        });
    }
    async pointerPour(user, entrepriseId, dto, locale) {
        const existing = await this.pointages.findByRequestId(entrepriseId, dto.requestId);
        if (existing) {
            return {
                replay: true,
                pointage: await this.pointages.findOne(user, entrepriseId, existing.id, locale),
            };
        }
        const siteId = await this.pointages.actorSiteId(user.id, entrepriseId, locale);
        await this.pointages.requireActifEmploye(entrepriseId, dto.employeId, siteId, locale);
        await this.pointages.assertSequence(entrepriseId, dto.employeId, dto.type, locale);
        const hasGps = dto.latitude !== undefined && dto.longitude !== undefined;
        let latitude = null;
        let longitude = null;
        let precisionM = null;
        let distanceM = null;
        let statutValidation = client_1.StatutValidation.VALIDE;
        let motifStatut = "pointage par surveillant";
        const mockDetecte = dto.mockDetecte === true;
        if (hasGps) {
            const site = await this.prisma.tenant.site.findFirst({
                where: { id: siteId, entrepriseId },
                select: {
                    latitude: true,
                    longitude: true,
                    rayonM: true,
                    precisionMaxM: true,
                },
            });
            latitude = dto.latitude ?? null;
            longitude = dto.longitude ?? null;
            precisionM = dto.precisionM ?? 0;
            if (site && latitude !== null && longitude !== null) {
                const gps = this.gps.evaluate({
                    latitude,
                    longitude,
                    precisionM: precisionM ?? 0,
                    mockDetecte,
                }, {
                    latitude: Number(site.latitude),
                    longitude: Number(site.longitude),
                    rayonM: site.rayonM,
                    precisionMaxM: site.precisionMaxM,
                });
                distanceM = gps.distanceM;
                statutValidation = gps.statut;
                motifStatut = `pointage par surveillant, ${gps.motifStatut}`;
            }
        }
        else if (mockDetecte) {
            statutValidation = client_1.StatutValidation.A_VERIFIER;
            motifStatut = "pointage par surveillant, position simulée détectée";
        }
        return this.pointages.createOrReplay({
            entrepriseId,
            acteurId: user.id,
            employeId: dto.employeId,
            siteId,
            pointeParId: user.id,
            type: dto.type,
            methode: client_1.MethodePointage.SURVEILLANT,
            latitude,
            longitude,
            precisionM,
            distanceM,
            statutValidation,
            motifStatut,
            mockDetecte,
            requestId: dto.requestId,
        });
    }
};
exports.SurveillantService = SurveillantService;
exports.SurveillantService = SurveillantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pointages_service_1.PointagesService,
        validation_gps_service_1.ValidationGpsService])
], SurveillantService);
//# sourceMappingURL=surveillant.service.js.map