import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiAudience } from "../../../common/decorators/api-audience.decorator";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { ApiLogin } from "./decorators/api-phone.decorator";
import { normalizeLocale, translate } from "../../../common/i18n";
import { authThrottleOptions } from "../../../common/throttler/throttler.constants";
import { successResponse } from "../../../common/utils/response.util";
import { Public } from "../../../common/decorators/public.decorator";
import { PhoneLoginDto } from "./dto/phone-login.dto";
import { LoginService } from "../session/services/login.service";
import { authSuccessData } from "../session/utils/auth-response-mobile.util";

/** Parcours téléphone : numéro + PIN. Pas de SMS ni d'OTP. */
@ApiTags("Auth — Téléphone")
@ApiAudience("mobile")
@Controller("auth/phone")
@Throttle(authThrottleOptions())
export class AuthPhoneController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Req() req: Request, @Body() dto: PhoneLoginDto) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const result = await this.loginService.loginWithPhone(
      dto.phone_number,
      dto.secret_code,
      locale,
    );
    return successResponse(
      translate(locale, "loginSuccess"),
      authSuccessData(result),
      locale,
    );
  }
}
