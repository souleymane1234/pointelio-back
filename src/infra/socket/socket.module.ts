import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthModule } from "../../modules/auth/auth.module";
import { isSocketLoggingEnabled } from "./config/socket-logs.config";
import { SocketGateway } from "./socket.gateway";
import { SocketAuthService } from "./services/socket-auth.service";
import { SocketNotificationsService } from "./services/socket-notifications.service";

@Module({
  imports: [AuthModule],
  providers: [SocketAuthService, SocketNotificationsService, SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule implements OnModuleInit {
  private readonly logger = new Logger(SocketModule.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    if (isSocketLoggingEnabled(this.config)) {
      this.logger.log("SocketModule initialise");
    }
  }
}
