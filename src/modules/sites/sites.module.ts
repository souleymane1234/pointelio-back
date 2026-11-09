import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { EntitlementsModule } from "../entitlements/entitlements.module";
import { QrService } from "./qr.service";
import { SitesController } from "./sites.controller";
import { SitesService } from "./sites.service";

@Module({
  imports: [PrismaModule, AuditModule, EntitlementsModule],
  controllers: [SitesController],
  providers: [SitesService, QrService],
  exports: [SitesService],
})
export class SitesModule {}
