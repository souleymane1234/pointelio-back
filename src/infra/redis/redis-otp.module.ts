import {
  Global,
  Module,
  OnModuleDestroy,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { REDIS_OTP } from "./redis-otp.constants";

function createRedisClient(url: string): Redis {
  return new Redis(url.trim(), {
    maxRetriesPerRequest: 2,
    connectTimeout: 5_000,
    commandTimeout: 3_000,
    enableReadyCheck: true,
    lazyConnect: false,
    keepAlive: 30_000,
  });
}

@Injectable()
class RedisOtpConnection implements OnModuleDestroy {
  private readonly logger = new Logger(RedisOtpConnection.name);

  constructor(readonly client: Redis | null) {}

  async onModuleDestroy(): Promise<void> {
    if (!this.client) {
      return;
    }
    try {
      await this.client.quit();
    } catch (error) {
      this.logger.warn(`Redis disconnect: ${(error as Error).message}`);
    }
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_OTP,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis | null => {
        const url = config.get<string>("REDIS_URL");
        if (!url?.trim()) {
          return null;
        }
        return createRedisClient(url);
      },
    },
    {
      provide: RedisOtpConnection,
      inject: [REDIS_OTP],
      useFactory: (client: Redis | null) => new RedisOtpConnection(client),
    },
  ],
  exports: [REDIS_OTP],
})
export class RedisOtpModule {}
