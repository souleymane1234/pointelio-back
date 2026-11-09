import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { EntreprisesController } from "./entreprises.controller";
import { EntreprisesService } from "./entreprises.service";
import { ProfilEntrepriseController } from "./profil-entreprise.controller";
import { ProfilEntrepriseService } from "./profil-entreprise.service";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [EntreprisesController, ProfilEntrepriseController],
  providers: [EntreprisesService, ProfilEntrepriseService],
  exports: [EntreprisesService],
})
export class EntreprisesModule {}
