import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { IpBlockMiddleware } from "./ip-block.middleware";
import { IpBlockService } from "./ip-block.service";

@Module({
  imports: [ConfigModule],
  providers: [IpBlockMiddleware, IpBlockService],
  exports: [IpBlockService],
})
export class IpBlockModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpBlockMiddleware)
      .forRoutes({ path: "{*splat}", method: RequestMethod.ALL });
  }
}
