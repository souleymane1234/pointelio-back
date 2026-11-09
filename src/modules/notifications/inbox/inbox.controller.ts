import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiAudience } from "../../../common/decorators/api-audience.decorator";
import { normalizeLocale, translate } from "../../../common/i18n";
import {
  paginatedResponse,
  successResponse,
} from "../../../common/utils/response.util";
import {
  ApiGetNotification,
  ApiListNotifications,
  ApiMarkAllNotificationsRead,
  ApiMarkNotificationRead,
} from "./decorators/api-inbox.decorator";
import { NotificationsQueryDto } from "./dto/notifications-query.dto";
import { NotificationsService } from "../notifications.service";
import {
  type AuthedRequest,
  requireUserId,
} from "../../../common/types/request-context";

@ApiTags("Notifications")
@ApiAudience("mobile", "employeur")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationsInboxController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiListNotifications()
  async findAll(
    @Req() req: AuthedRequest,
    @Query() query: NotificationsQueryDto,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const userId = requireUserId(req);
    const { data, pagination, count } = await this.notificationsService.findAll(
      userId,
      query,
    );
    return paginatedResponse(
      data,
      pagination,
      translate(locale, "notificationsFetched"),
      locale,
      count,
    );
  }

  @Patch("read-all")
  @ApiMarkAllNotificationsRead()
  async markAllAsRead(@Req() req: AuthedRequest) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const userId = requireUserId(req);
    const data = await this.notificationsService.markAllAsRead(userId);
    return successResponse(
      translate(locale, "notificationsMarkedAsRead"),
      data,
      locale,
    );
  }

  @Get(":id")
  @ApiGetNotification()
  async findOne(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const userId = requireUserId(req);
    const data = await this.notificationsService.findOne(id, userId, locale);
    return successResponse(
      translate(locale, "notificationFetched"),
      data,
      locale,
    );
  }

  @Patch(":id/read")
  @ApiMarkNotificationRead()
  async markAsRead(
    @Req() req: AuthedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const locale =
      req.locale ?? normalizeLocale(req.headers.language as string);
    const userId = requireUserId(req);
    const data = await this.notificationsService.markAsRead(id, userId, locale);
    return successResponse(
      translate(locale, "notificationMarkedAsRead"),
      data,
      locale,
    );
  }
}
