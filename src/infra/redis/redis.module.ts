import { Module } from "@nestjs/common";
import { AppCacheModule } from "../cache/cache.module";
import { RedisController } from "./redis.controller";
import { RedisCleanupService } from "./redis-cleanup.service";
import { RedisOtpModule } from "./redis-otp.module";

@Module({
  imports: [RedisOtpModule, AppCacheModule],
  controllers: [RedisController],
  providers: [RedisCleanupService],
})
export class RedisModule {}
