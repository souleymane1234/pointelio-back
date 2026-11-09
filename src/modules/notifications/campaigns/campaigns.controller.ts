import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { ApiAudience } from "../../../common/decorators/api-audience.decorator";
import { Role } from "@prisma/client";
import { normalizeLocale, translate } from "../../../common/i18n";
import { USER_MANAGER_ROLES } from "../../../common/rbac/role-groups";
import { Roles } from "../../../common/decorators/roles.decorator";
import {
  paginatedResponse,
  successResponse,
} from "../../../common/utils/response.util";
import {
  ApiAdminListSentNotifications,
  ApiAdminGetSentNotification,
  ApiAdminSendNotificationToRole,
  ApiAdminSendNotificationToUser,
} from "./decorators/api-campaigns.decorator";
import { AdminSendNotificationDto } from "./dto/admin-send-notification.dto";
import { AdminSentNotificationsQueryDto } from "./dto/admin-sent-notifications-query.dto";
import {
  AdminSentNotificationDetailResponseSchemaDto,
  AdminSentNotificationsPaginatedResponseSchemaDto,
} from "./dto/admin-sent-notifications-response.dto";
import { NotificationsService } from "../notifications.service";
import {
  type AuthedRequest,
  requireUser,
} from "../../../common/types/request-context";

@ApiTags("Admin - Notifications")
@ApiAudience("employeur", "plateforme")
@ApiBearerAuth()
@ApiExtraModels(
  AdminSendNotificationDto,
  AdminSentNotificationsPaginatedResponseSchemaDto,
  AdminSentNotificationDetailResponseSchemaDto,
)
@Roles(...USER_MANAGER_ROLES)
@Controller("admin/notifications")
export class NotificationCampaignsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("sent")
  @ApiAdminListSentNotifications()
  async listSent(
    @Req() req: AuthedRequest,
    @Query() query: AdminSentNotificationsQueryDto,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const { data, pagination } =
      await this.notificationsService.listAdminSentNotifications(
        requireUser(req),
        query,
      );
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "adminSentNotificationsFetched"),
      locale,
    );
  }

  @Get("sent/:campaignId")
  @ApiAdminGetSentNotification()
  async getSent(
    @Req() req: AuthedRequest,
    @Param("campaignId") campaignId: string,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.notificationsService.getAdminSentNotification(
      requireUser(req),
      campaignId,
      locale,
    );
    return successResponse(
      translate(locale, "adminSentNotificationFetched"),
      data,
      locale,
    );
  }

  @Post("send/push-notification/user/:userId")
  @HttpCode(HttpStatus.OK)
  @ApiAdminSendNotificationToUser()
  async sendToUser(
    @Req() req: AuthedRequest,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() dto: AdminSendNotificationDto,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.notificationsService.sendAdminNotificationToUser(
      requireUser(req),
      userId,
      dto.titre,
      dto.message,
      locale,
    );
    return successResponse(
      translate(locale, "adminNotificationSent"),
      data,
      locale,
    );
  }

  @Post("send/push-notification/role/:role")
  @HttpCode(HttpStatus.OK)
  @ApiAdminSendNotificationToRole()
  async sendToRole(
    @Req() req: AuthedRequest,
    @Param("role", new ParseEnumPipe(Role)) role: Role,
    @Body() dto: AdminSendNotificationDto,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const data = await this.notificationsService.sendAdminNotificationToRole(
      requireUser(req),
      role,
      dto.titre,
      dto.message,
      dto.entrepriseId,
    );
    return successResponse(
      translate(locale, "adminNotificationSent"),
      data,
      locale,
    );
  }
}
