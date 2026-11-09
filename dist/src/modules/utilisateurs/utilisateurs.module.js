"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilisateursModule = void 0;
const common_1 = require("@nestjs/common");
const audit_module_1 = require("../audit/audit.module");
const cache_module_1 = require("../../infra/cache/cache.module");
const prisma_module_1 = require("../../infra/prisma/prisma.module");
const entitlements_module_1 = require("../entitlements/entitlements.module");
const utilisateurs_controller_1 = require("./utilisateurs.controller");
const admin_users_cache_service_1 = require("./services/admin-users-cache.service");
const user_identifiers_service_1 = require("./services/user-identifiers.service");
const user_scope_service_1 = require("./services/user-scope.service");
const users_create_service_1 = require("./services/users-create.service");
const users_list_service_1 = require("./services/users-list.service");
const utilisateurs_service_1 = require("./services/utilisateurs.service");
const users_update_service_1 = require("./services/users-update.service");
let UtilisateursModule = class UtilisateursModule {
};
exports.UtilisateursModule = UtilisateursModule;
exports.UtilisateursModule = UtilisateursModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            cache_module_1.AppCacheModule,
            audit_module_1.AuditModule,
            entitlements_module_1.EntitlementsModule,
        ],
        controllers: [utilisateurs_controller_1.UtilisateursController],
        providers: [
            admin_users_cache_service_1.AdminUsersCacheService,
            user_scope_service_1.UserScopeService,
            user_identifiers_service_1.UserIdentifiersService,
            users_list_service_1.UsersListService,
            users_create_service_1.UsersCreateService,
            users_update_service_1.UsersUpdateService,
            utilisateurs_service_1.UtilisateursService,
        ],
    })
], UtilisateursModule);
//# sourceMappingURL=utilisateurs.module.js.map