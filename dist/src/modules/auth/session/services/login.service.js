"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LoginService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_actions_service_1 = require("../../../audit/recorder/services/audit-actions.service");
const prisma_service_1 = require("../../../../infra/prisma/prisma.service");
const i18n_1 = require("../../../../common/i18n");
const role_groups_1 = require("../../../../common/rbac/role-groups");
const login_select_1 = require("./login.select");
const token_service_1 = require("./token.service");
const auth_phone_service_1 = require("../../phone/services/auth-phone.service");
const auth_user_session_service_1 = require("./auth-user-session.service");
let LoginService = LoginService_1 = class LoginService {
    prisma;
    tokenService;
    auditActions;
    authUserSession;
    authPhone;
    logger = new common_1.Logger(LoginService_1.name);
    constructor(prisma, tokenService, auditActions, authUserSession, authPhone) {
        this.prisma = prisma;
        this.tokenService = tokenService;
        this.auditActions = auditActions;
        this.authUserSession = authUserSession;
        this.authPhone = authPhone;
    }
    async loginWithPhone(phoneNumber, secretCode, locale) {
        const telephone = this.authPhone.normalizeRequiringDialCode(phoneNumber, locale);
        return this.authenticateLocal({ telephone }, secretCode, locale, {
            requireBackoffice: false,
            credentialsKey: "invalidPin",
        });
    }
    async loginWithEmail(email, password, locale) {
        return this.authenticateLocal({ email }, password, locale, {
            requireBackoffice: false,
            credentialsKey: "invalidCredentials",
        });
    }
    async loginAdminWithEmail(email, password, locale) {
        return this.authenticateLocal({ email }, password, locale, {
            requireBackoffice: true,
        });
    }
    async authenticateLocal(params, password, locale, options) {
        const startedAt = Date.now();
        const user = await this.verifyLocalCredentials(params, password, locale, options);
        void this.auditActions.authLogin(user.id);
        this.authUserSession.touchLastLoginAt(user.id);
        const response = this.tokenService.buildAuthResponse(user);
        this.logger.log(`200 - login total=${Date.now() - startedAt}ms`);
        return response;
    }
    async verifyLocalCredentials(params, password, locale, options) {
        const invalidCredentials = () => new common_1.UnauthorizedException((0, i18n_1.translate)(locale, options.credentialsKey ?? "invalidCredentials"));
        const user = await this.findUserForLocalLogin(params);
        if (!user ||
            !user.passwordHash ||
            (options.requireBackoffice && !role_groups_1.BACKOFFICE_ROLES.includes(user.role))) {
            throw invalidCredentials();
        }
        if (!(await bcrypt.compare(password, user.passwordHash))) {
            throw invalidCredentials();
        }
        if (user.statut !== client_1.StatutCompte.ACTIF) {
            throw new common_1.UnauthorizedException((0, i18n_1.translate)(locale, "accountInactive"));
        }
        return user;
    }
    async findUserForLocalLogin(params) {
        const email = params.email?.trim().toLowerCase();
        if (email) {
            return this.prisma.utilisateur.findUnique({
                where: { email },
                select: login_select_1.localLoginUserSelect,
            });
        }
        const telephone = params.telephone?.trim();
        if (!telephone) {
            return null;
        }
        return this.prisma.utilisateur.findUnique({
            where: { telephone },
            select: login_select_1.localLoginUserSelect,
        });
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = LoginService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        token_service_1.TokenService,
        audit_actions_service_1.AuditActionsService,
        auth_user_session_service_1.AuthUserSessionService,
        auth_phone_service_1.AuthPhoneService])
], LoginService);
//# sourceMappingURL=login.service.js.map