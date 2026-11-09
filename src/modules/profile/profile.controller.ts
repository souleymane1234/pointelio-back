import { AutoriseAbonnementInactif } from "../../common/decorators/abonnement-inactif.decorator";
import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Patch,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { authThrottleOptions } from "../../common/throttler/throttler.constants";
import { ApiAudience } from "../../common/decorators/api-audience.decorator";
import { normalizeLocale, translate, type Locale } from "../../common/i18n";
import {
  ApiChangePassword,
  ApiProfileMe,
  ApiUpdateProfile,
} from "./decorators/api-profile.decorator";
import { successResponse } from "../../common/utils/response.util";
import { ProfileService } from "./profile.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import {
  type AuthedRequest,
  requireUserId,
} from "../../common/types/request-context";

@ApiTags("Profile")
@ApiAudience("mobile", "employeur")
@ApiBearerAuth()
@AutoriseAbonnementInactif()
@Controller("profile")
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  @Get("me")
  @ApiProfileMe()
  async me(@Req() req: AuthedRequest) {
    const startedAt = Date.now();
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const userId = requireUserId(req);
    let statusCode = 200;

    try {
      const user = await this.profileService.me(userId);
      return successResponse(translate(locale, "profileFetched"), user, locale);
    } catch (error) {
      statusCode = error instanceof HttpException ? error.getStatus() : 500;
      throw error;
    } finally {
      const durationMs = Date.now() - startedAt;
      this.logger.log(
        `GET /profile/me - userId=${userId} - ${statusCode} - ${durationMs}ms`,
      );
    }
  }

  @Patch("me")
  @ApiUpdateProfile()
  async updateMe(@Req() req: AuthedRequest, @Body() dto: UpdateProfileDto) {
    const locale: Locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const userId = requireUserId(req);
    const updated = await this.profileService.update(userId, dto, locale);
    return successResponse(
      translate(locale, "profileUpdated"),
      updated,
      locale,
    );
  }

  @Patch("me/password")
  @Throttle(authThrottleOptions())
  @ApiChangePassword()
  async changePassword(
    @Req() req: AuthedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    const locale: Locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    await this.profileService.changePassword(requireUserId(req), dto, locale);
    return successResponse(translate(locale, "passwordChanged"), null, locale);
  }
}
