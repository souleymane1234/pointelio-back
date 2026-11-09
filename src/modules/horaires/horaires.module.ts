import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { EntitlementsModule } from "../entitlements/entitlements.module";
import { HorairesController } from "./horaires.controller";
import { HorairesService } from "./horaires.service";

@Module({
  imports: [PrismaModule, AuditModule, EntitlementsModule],
  controllers: [HorairesController],
  providers: [HorairesService],
  exports: [HorairesService],
})
export class HorairesModule {}
