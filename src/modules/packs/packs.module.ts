import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { PacksController } from "./packs.controller";
import { PacksService } from "./packs.service";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [PacksController],
  providers: [PacksService],
  exports: [PacksService],
})
export class PacksModule {}
