import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { AnomaliesService } from "./anomalies.service";
import { CorrectionsService } from "./corrections.service";
import { PointagesController } from "./pointages.controller";
import { PointagesService } from "./pointages.service";
import { SurveillantController } from "./surveillant/surveillant.controller";
import { SurveillantService } from "./surveillant/surveillant.service";
import { ValidationGpsService } from "./validation-gps.service";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [SurveillantController, PointagesController],
  providers: [
    PointagesService,
    ValidationGpsService,
    AnomaliesService,
    CorrectionsService,
    SurveillantService,
  ],
  exports: [PointagesService],
})
export class PointagesModule {}
