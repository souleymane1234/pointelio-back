"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCampaignsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../../common/decorators/api-audience.decorator");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../../common/i18n");
const role_groups_1 = require("../../../common/rbac/role-groups");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const response_util_1 = require("../../../common/utils/response.util");
const api_campaigns_decorator_1 = require("./decorators/api-campaigns.decorator");
const admin_send_notification_dto_1 = require("./dto/admin-send-notification.dto");
const admin_sent_notifications_query_dto_1 = require("./dto/admin-sent-notifications-query.dto");
const admin_sent_notifications_response_dto_1 = require("./dto/admin-sent-notifications-response.dto");
const notifications_service_1 = require("../notifications.service");
const request_context_1 = require("../../../common/types/request-context");
let NotificationCampaignsController = class NotificationCampaignsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async listSent(req, query) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const { data, pagination } = await this.notificationsService.listAdminSentNotifications((0, request_context_1.requireUser)(req), query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "adminSentNotificationsFetched"), locale);
    }
    async getSent(req, campaignId) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.notificationsService.getAdminSentNotification((0, request_context_1.requireUser)(req), campaignId, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "adminSentNotificationFetched"), data, locale);
    }
    async sendToUser(req, userId, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.notificationsService.sendAdminNotificationToUser((0, request_context_1.requireUser)(req), userId, dto.titre, dto.message, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "adminNotificationSent"), data, locale);
    }
    async sendToRole(req, role, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.notificationsService.sendAdminNotificationToRole((0, request_context_1.requireUser)(req), role, dto.titre, dto.message, dto.entrepriseId);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "adminNotificationSent"), data, locale);
    }
};
exports.NotificationCampaignsController = NotificationCampaignsController;
__decorate([
    (0, common_1.Get)("sent"),
    (0, api_campaigns_decorator_1.ApiAdminListSentNotifications)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_sent_notifications_query_dto_1.AdminSentNotificationsQueryDto]),
    __metadata("design:returntype", Promise)
], NotificationCampaignsController.prototype, "listSent", null);
__decorate([
    (0, common_1.Get)("sent/:campaignId"),
    (0, api_campaigns_decorator_1.ApiAdminGetSentNotification)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("campaignId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationCampaignsController.prototype, "getSent", null);
__decorate([
    (0, common_1.Post)("send/push-notification/user/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_campaigns_decorator_1.ApiAdminSendNotificationToUser)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, admin_send_notification_dto_1.AdminSendNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationCampaignsController.prototype, "sendToUser", null);
__decorate([
    (0, common_1.Post)("send/push-notification/role/:role"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_campaigns_decorator_1.ApiAdminSendNotificationToRole)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("role", new common_1.ParseEnumPipe(client_1.Role))),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, admin_send_notification_dto_1.AdminSendNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationCampaignsController.prototype, "sendToRole", null);
exports.NotificationCampaignsController = NotificationCampaignsController = __decorate([
    (0, swagger_1.ApiTags)("Admin - Notifications"),
    (0, api_audience_decorator_1.ApiAudience)("employeur", "plateforme"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiExtraModels)(admin_send_notification_dto_1.AdminSendNotificationDto, admin_sent_notifications_response_dto_1.AdminSentNotificationsPaginatedResponseSchemaDto, admin_sent_notifications_response_dto_1.AdminSentNotificationDetailResponseSchemaDto),
    (0, roles_decorator_1.Roles)(...role_groups_1.USER_MANAGER_ROLES),
    (0, common_1.Controller)("admin/notifications"),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationCampaignsController);
//# sourceMappingURL=campaigns.controller.js.map