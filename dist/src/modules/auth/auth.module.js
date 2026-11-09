"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const audit_module_1 = require("../audit/audit.module");
const session_controller_1 = require("./session/session.controller");
const account_controller_1 = require("./account/account.controller");
const email_controller_1 = require("./email/email.controller");
const phone_controller_1 = require("./phone/phone.controller");
const abonnement_actif_guard_1 = require("../../common/guards/abonnement-actif.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const module_guard_1 = require("../../common/guards/module.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const tenant_guard_1 = require("../../common/guards/tenant.guard");
const entitlements_module_1 = require("../entitlements/entitlements.module");
const prisma_module_1 = require("../../infra/prisma/prisma.module");
const jwt_expiry_config_1 = require("./session/config/jwt-expiry.config");
const token_service_1 = require("./session/services/token.service");
const login_service_1 = require("./session/services/login.service");
const logout_service_1 = require("./session/services/logout.service");
const deactivate_account_service_1 = require("./account/services/deactivate-account.service");
const auth_phone_service_1 = require("./phone/services/auth-phone.service");
const auth_token_revocation_store_1 = require("./session/services/auth-token-revocation.store");
const auth_user_session_service_1 = require("./session/services/auth-user-session.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            audit_module_1.AuditModule,
            entitlements_module_1.EntitlementsModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.getOrThrow("JWT_SECRET"),
                    signOptions: {
                        expiresIn: (0, jwt_expiry_config_1.getJwtAccessExpiresInSeconds)(),
                    },
                }),
            }),
        ],
        controllers: [
            session_controller_1.AuthSessionController,
            phone_controller_1.AuthPhoneController,
            email_controller_1.AuthEmailController,
            account_controller_1.AuthAccountController,
        ],
        providers: [
            auth_token_revocation_store_1.AuthTokenRevocationStore,
            auth_user_session_service_1.AuthUserSessionService,
            auth_phone_service_1.AuthPhoneService,
            token_service_1.TokenService,
            login_service_1.LoginService,
            logout_service_1.LogoutService,
            deactivate_account_service_1.DeactivateAccountService,
            jwt_auth_guard_1.JwtAuthGuard,
            { provide: core_1.APP_GUARD, useExisting: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: tenant_guard_1.TenantGuard },
            { provide: core_1.APP_GUARD, useClass: abonnement_actif_guard_1.AbonnementActifGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: module_guard_1.ModuleGuard },
        ],
        exports: [token_service_1.TokenService, jwt_1.JwtModule, jwt_auth_guard_1.JwtAuthGuard, auth_user_session_service_1.AuthUserSessionService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map