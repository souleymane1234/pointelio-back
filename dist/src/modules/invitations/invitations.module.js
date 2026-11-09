"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsModule = void 0;
const common_1 = require("@nestjs/common");
const emailing_module_1 = require("../../infra/mail/emailing.module");
const prisma_module_1 = require("../../infra/prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
const auth_module_1 = require("../auth/auth.module");
const invitations_controller_1 = require("./invitations.controller");
const invitations_service_1 = require("./invitations.service");
let InvitationsModule = class InvitationsModule {
};
exports.InvitationsModule = InvitationsModule;
exports.InvitationsModule = InvitationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, emailing_module_1.EmailingModule, audit_module_1.AuditModule, auth_module_1.AuthModule],
        controllers: [invitations_controller_1.InvitationsController],
        providers: [invitations_service_1.InvitationsService],
        exports: [invitations_service_1.InvitationsService],
    })
], InvitationsModule);
//# sourceMappingURL=invitations.module.js.map