import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { DashboardClientController } from "./dashboard-client.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [PrismaModule],
  controllers: [DashboardClientController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
