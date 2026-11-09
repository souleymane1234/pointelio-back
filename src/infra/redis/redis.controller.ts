import { Controller, Delete, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiAudience } from "../../common/decorators/api-audience.decorator";
import { Role } from "@prisma/client";
import { normalizeLocale, translate } from "../../common/i18n";
import { Roles } from "../../common/decorators/roles.decorator";
import { successResponse } from "../../common/utils/response.util";
import { ApiAdminRedisFlushCache } from "./decorators/api-redis.decorator";
import { RedisCleanupService } from "./redis-cleanup.service";
import { type AuthedRequest } from "../../common/types/request-context";

@ApiTags("Admin — Redis")
@ApiAudience("plateforme")
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@Controller("admin/redis")
export class RedisController {
  constructor(private readonly redisCleanupService: RedisCleanupService) {}

  @Delete("cache")
  @ApiAdminRedisFlushCache()
  async flushCache(@Req() req: AuthedRequest) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.redisCleanupService.flushAll(locale);
    return successResponse(
      translate(locale, "redisCacheCleared"),
      data,
      locale,
    );
  }
}
