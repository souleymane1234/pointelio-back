"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointagesModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infra/prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
const anomalies_service_1 = require("./anomalies.service");
const corrections_service_1 = require("./corrections.service");
const pointages_controller_1 = require("./pointages.controller");
const pointages_service_1 = require("./pointages.service");
const surveillant_controller_1 = require("./surveillant/surveillant.controller");
const surveillant_service_1 = require("./surveillant/surveillant.service");
const validation_gps_service_1 = require("./validation-gps.service");
let PointagesModule = class PointagesModule {
};
exports.PointagesModule = PointagesModule;
exports.PointagesModule = PointagesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule],
        controllers: [surveillant_controller_1.SurveillantController, pointages_controller_1.PointagesController],
        providers: [
            pointages_service_1.PointagesService,
            validation_gps_service_1.ValidationGpsService,
            anomalies_service_1.AnomaliesService,
            corrections_service_1.CorrectionsService,
            surveillant_service_1.SurveillantService,
        ],
        exports: [pointages_service_1.PointagesService],
    })
], PointagesModule);
//# sourceMappingURL=pointages.module.js.map