import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { EntitlementsModule } from "../entitlements/entitlements.module";
import { AbonnementsController } from "./abonnements.controller";
import { AbonnementsService } from "./abonnements.service";

@Module({
  imports: [PrismaModule, AuditModule, EntitlementsModule],
  controllers: [AbonnementsController],
  providers: [AbonnementsService],
})
export class AbonnementsModule {}
