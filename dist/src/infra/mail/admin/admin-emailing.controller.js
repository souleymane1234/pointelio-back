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
exports.AdminEmailingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const i18n_1 = require("../../../common/i18n");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const api_audience_decorator_1 = require("../../../common/decorators/api-audience.decorator");
const role_groups_1 = require("../../../common/rbac/role-groups");
const response_util_1 = require("../../../common/utils/response.util");
const api_admin_emailing_decorator_1 = require("./decorators/api-admin-emailing.decorator");
const admin_send_email_dto_1 = require("./dto/admin-send-email.dto");
const admin_send_email_swagger_examples_1 = require("./dto/admin-send-email.swagger-examples");
const admin_emailing_service_1 = require("./services/admin-emailing.service");
let AdminEmailingController = class AdminEmailingController {
    adminEmailing;
    constructor(adminEmailing) {
        this.adminEmailing = adminEmailing;
    }
    async send(req, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.adminEmailing.send(dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "adminEmailSent"), data, locale);
    }
};
exports.AdminEmailingController = AdminEmailingController;
__decorate([
    (0, common_1.Post)("send"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({
        type: admin_send_email_dto_1.AdminSendEmailDto,
        examples: admin_send_email_swagger_examples_1.ADMIN_SEND_EMAIL_SWAGGER_EXAMPLES,
    }),
    (0, api_admin_emailing_decorator_1.ApiAdminSendEmail)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_send_email_dto_1.AdminSendEmailDto]),
    __metadata("design:returntype", Promise)
], AdminEmailingController.prototype, "send", null);
exports.AdminEmailingController = AdminEmailingController = __decorate([
    (0, swagger_1.ApiTags)("Admin — E-mail"),
    (0, api_audience_decorator_1.ApiAudience)("plateforme"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiExtraModels)(admin_send_email_dto_1.AdminSendEmailDto),
    (0, roles_decorator_1.Roles)(...role_groups_1.PLATFORM_ROLES),
    (0, common_1.Controller)("admin/emailing"),
    __metadata("design:paramtypes", [admin_emailing_service_1.AdminEmailingService])
], AdminEmailingController);
//# sourceMappingURL=admin-emailing.controller.js.map