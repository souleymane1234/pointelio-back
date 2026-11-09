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
exports.NotificationsInboxController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../../common/decorators/api-audience.decorator");
const i18n_1 = require("../../../common/i18n");
const response_util_1 = require("../../../common/utils/response.util");
const api_inbox_decorator_1 = require("./decorators/api-inbox.decorator");
const notifications_query_dto_1 = require("./dto/notifications-query.dto");
const notifications_service_1 = require("../notifications.service");
const request_context_1 = require("../../../common/types/request-context");
let NotificationsInboxController = class NotificationsInboxController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async findAll(req, query) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const userId = (0, request_context_1.requireUserId)(req);
        const { data, pagination, count } = await this.notificationsService.findAll(userId, query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "notificationsFetched"), locale, count);
    }
    async markAllAsRead(req) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const userId = (0, request_context_1.requireUserId)(req);
        const data = await this.notificationsService.markAllAsRead(userId);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "notificationsMarkedAsRead"), data, locale);
    }
    async findOne(req, id) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const userId = (0, request_context_1.requireUserId)(req);
        const data = await this.notificationsService.findOne(id, userId, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "notificationFetched"), data, locale);
    }
    async markAsRead(req, id) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const userId = (0, request_context_1.requireUserId)(req);
        const data = await this.notificationsService.markAsRead(id, userId, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "notificationMarkedAsRead"), data, locale);
    }
};
exports.NotificationsInboxController = NotificationsInboxController;
__decorate([
    (0, common_1.Get)(),
    (0, api_inbox_decorator_1.ApiListNotifications)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, notifications_query_dto_1.NotificationsQueryDto]),
    __metadata("design:returntype", Promise)
], NotificationsInboxController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)("read-all"),
    (0, api_inbox_decorator_1.ApiMarkAllNotificationsRead)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsInboxController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, api_inbox_decorator_1.ApiGetNotification)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], NotificationsInboxController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id/read"),
    (0, api_inbox_decorator_1.ApiMarkNotificationRead)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], NotificationsInboxController.prototype, "markAsRead", null);
exports.NotificationsInboxController = NotificationsInboxController = __decorate([
    (0, swagger_1.ApiTags)("Notifications"),
    (0, api_audience_decorator_1.ApiAudience)("mobile", "employeur"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("notifications"),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsInboxController);
//# sourceMappingURL=inbox.controller.js.map