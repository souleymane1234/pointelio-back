import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiTags,
} from "@nestjs/swagger";
import { normalizeLocale, translate } from "../../../common/i18n";
import { Roles } from "../../../common/decorators/roles.decorator";
import { ApiAudience } from "../../../common/decorators/api-audience.decorator";
import { PLATFORM_ROLES } from "../../../common/rbac/role-groups";
import { successResponse } from "../../../common/utils/response.util";
import { ApiAdminSendEmail } from "./decorators/api-admin-emailing.decorator";
import { AdminSendEmailDto } from "./dto/admin-send-email.dto";
import { ADMIN_SEND_EMAIL_SWAGGER_EXAMPLES } from "./dto/admin-send-email.swagger-examples";
import { AdminEmailingService } from "./services/admin-emailing.service";
import { type AuthedRequest } from "../../../common/types/request-context";

@ApiTags("Admin — E-mail")
@ApiAudience("plateforme")
@ApiBearerAuth()
@ApiExtraModels(AdminSendEmailDto)
@Roles(...PLATFORM_ROLES)
@Controller("admin/emailing")
export class AdminEmailingController {
  constructor(private readonly adminEmailing: AdminEmailingService) {}

  @Post("send")
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: AdminSendEmailDto,
    examples: ADMIN_SEND_EMAIL_SWAGGER_EXAMPLES,
  })
  @ApiAdminSendEmail()
  async send(@Req() req: AuthedRequest, @Body() dto: AdminSendEmailDto) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.adminEmailing.send(dto, locale);
    return successResponse(translate(locale, "adminEmailSent"), data, locale);
  }
}
