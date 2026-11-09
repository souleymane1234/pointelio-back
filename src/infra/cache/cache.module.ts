import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { DEFAULT_CACHE_TTL_MINUTES } from "./cache-ttl.constants";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>("REDIS_URL");
        const ttlMinutes =
          configService.get<number>("CACHE_TTL_MINUTES") ??
          DEFAULT_CACHE_TTL_MINUTES;
        const ttlMs = ttlMinutes * 60 * 1000;

        const options: { stores?: Keyv[]; ttl: number } = {
          ttl: ttlMs,
        };

        if (redisUrl) {
          const redisStore = new KeyvRedis(redisUrl);
          options.stores = [new Keyv({ store: redisStore })];
        }

        return options;
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
