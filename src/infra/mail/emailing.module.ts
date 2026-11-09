import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdminEmailingController } from "./admin/admin-emailing.controller";
import { EmailingService } from "./emailing.service";
import { AdminEmailingService } from "./admin/services/admin-emailing.service";
import { EmailingSendService } from "./send/services/emailing-send.service";
import { EmailingValidationService } from "./send/services/emailing-validation.service";

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [AdminEmailingController],
  providers: [
    EmailingService,
    EmailingSendService,
    EmailingValidationService,
    AdminEmailingService,
  ],
  exports: [EmailingService],
})
export class EmailingModule {}
