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
exports.UtilisateursController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_audience_decorator_1 = require("../../common/decorators/api-audience.decorator");
const client_1 = require("@prisma/client");
const i18n_1 = require("../../common/i18n");
const role_groups_1 = require("../../common/rbac/role-groups");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const response_util_1 = require("../../common/utils/response.util");
const api_user_decorator_1 = require("./decorators/api-user.decorator");
const create_user_dto_1 = require("./dto/create-user.dto");
const rh_actions_dto_1 = require("./dto/rh-actions.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const users_query_dto_1 = require("./dto/users-query.dto");
const utilisateurs_service_1 = require("./services/utilisateurs.service");
const request_context_1 = require("../../common/types/request-context");
let UtilisateursController = class UtilisateursController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(req, query) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const { data, pagination } = await this.usersService.findAll((0, request_context_1.requireUser)(req), query);
        return (0, response_util_1.paginatedResponse)(data, pagination, (0, i18n_1.translate)(locale, "usersFetched"), locale);
    }
    async create(req, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.usersService.create((0, request_context_1.requireUser)(req), dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "userCreated"), data, locale);
    }
    async findOne(req, id) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.usersService.findOne((0, request_context_1.requireUser)(req), id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "userFetched"), data, locale);
    }
    async update(req, id, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.usersService.update((0, request_context_1.requireUser)(req), id, dto, locale);
        const definedKeys = Object.entries(dto)
            .filter(([, value]) => value !== undefined)
            .map(([key]) => key);
        const isStatusToggleOnly = definedKeys.includes("statut") &&
            definedKeys.every((key) => key === "statut" || key === "suspensionReason");
        const messageKey = isStatusToggleOnly && dto.statut === client_1.StatutCompte.SUSPENDU
            ? "userSuspended"
            : isStatusToggleOnly && dto.statut === client_1.StatutCompte.ACTIF
                ? "userRestored"
                : isStatusToggleOnly && dto.statut === client_1.StatutCompte.DESACTIVE
                    ? "userFired"
                    : "userUpdated";
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, messageKey), data, locale);
    }
    async reaffecter(req, id, dto) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.usersService.reaffecter((0, request_context_1.requireUser)(req), id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "userReassigned"), data, locale);
    }
    async suspendre(req, id, dto = {}) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.usersService.suspendre((0, request_context_1.requireUser)(req), id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "userSuspended"), data, locale);
    }
    async reactiver(req, id) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.usersService.reactiver((0, request_context_1.requireUser)(req), id, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "userRestored"), data, locale);
    }
    async renvoyer(req, id, dto = {}) {
        const locale = req.locale ?? (0, i18n_1.normalizeLocale)(req.headers.language);
        const data = await this.usersService.renvoyer((0, request_context_1.requireUser)(req), id, dto, locale);
        return (0, response_util_1.successResponse)((0, i18n_1.translate)(locale, "userFired"), data, locale);
    }
};
exports.UtilisateursController = UtilisateursController;
__decorate([
    (0, common_1.Get)(),
    (0, api_user_decorator_1.ApiListUsers)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_query_dto_1.UsersQueryDto]),
    __metadata("design:returntype", Promise)
], UtilisateursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, api_user_decorator_1.ApiCreateUser)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UtilisateursController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, api_user_decorator_1.ApiGetUser)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UtilisateursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, api_user_decorator_1.ApiUpdateUser)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UtilisateursController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/reaffecter"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_user_decorator_1.ApiReaffecterUser)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, rh_actions_dto_1.ReaffecterEmployeDto]),
    __metadata("design:returntype", Promise)
], UtilisateursController.prototype, "reaffecter", null);
__decorate([
    (0, common_1.Post)(":id/suspendre"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_user_decorator_1.ApiSuspendreUser)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, rh_actions_dto_1.MotifRhDto]),
    __metadata("design:returntype", Promise)
], UtilisateursController.prototype, "suspendre", null);
__decorate([
    (0, common_1.Post)(":id/reactiver"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_user_decorator_1.ApiReactiverUser)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UtilisateursController.prototype, "reactiver", null);
__decorate([
    (0, common_1.Post)(":id/renvoyer"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, api_user_decorator_1.ApiRenvoyerUser)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, rh_actions_dto_1.MotifRhDto]),
    __metadata("design:returntype", Promise)
], UtilisateursController.prototype, "renvoyer", null);
exports.UtilisateursController = UtilisateursController = __decorate([
    (0, swagger_1.ApiTags)("Admin — Utilisateurs"),
    (0, api_audience_decorator_1.ApiAudience)("employeur", "plateforme"),
    (0, swagger_1.ApiExtraModels)(create_user_dto_1.CreateUserDto, update_user_dto_1.UpdateUserDto, rh_actions_dto_1.ReaffecterEmployeDto, rh_actions_dto_1.MotifRhDto),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(...role_groups_1.USER_MANAGER_ROLES),
    (0, common_1.Controller)("admin/users"),
    __metadata("design:paramtypes", [utilisateurs_service_1.UtilisateursService])
], UtilisateursController);
//# sourceMappingURL=utilisateurs.controller.js.map