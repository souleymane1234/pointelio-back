import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DEFAULT_CACHE_TTL_MINUTES } from "./cache-ttl.constants";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ttlMinutes =
          configService.get<number>("CACHE_TTL_MINUTES") ??
          DEFAULT_CACHE_TTL_MINUTES;
        return { ttl: ttlMinutes * 60 * 1000 };
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
