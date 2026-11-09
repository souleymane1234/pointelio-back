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
import { normalizeLocale, translate } from "../../../common/i18n";
import { authThrottleOptions } from "../../../common/throttler/throttler.constants";
import { successResponse } from "../../../common/utils/response.util";
import { ApiEmailLogin } from "./decorators/api-email.decorator";
import { Public } from "../../../common/decorators/public.decorator";
import { EmailLoginDto } from "./dto/email-login.dto";
import { LoginService } from "../session/services/login.service";
import { authSuccessData } from "../session/utils/auth-response-mobile.util";

/** Parcours e-mail : e-mail + mot de passe. Pas d'OTP. */
@ApiTags("Auth — E-mail")
@ApiAudience("employeur")
@Controller("auth/email")
@Throttle(authThrottleOptions())
export class AuthEmailController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiEmailLogin()
  async login(@Req() req: Request, @Body() dto: EmailLoginDto) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const result = await this.loginService.loginWithEmail(
      dto.email,
      dto.password,
      locale,
    );
    return successResponse(
      translate(locale, "loginSuccess"),
      authSuccessData(result),
      locale,
    );
  }
}
