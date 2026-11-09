"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailingModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_emailing_controller_1 = require("./admin/admin-emailing.controller");
const emailing_service_1 = require("./emailing.service");
const admin_emailing_service_1 = require("./admin/services/admin-emailing.service");
const emailing_send_service_1 = require("./send/services/emailing-send.service");
const emailing_validation_service_1 = require("./send/services/emailing-validation.service");
let EmailingModule = class EmailingModule {
};
exports.EmailingModule = EmailingModule;
exports.EmailingModule = EmailingModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [admin_emailing_controller_1.AdminEmailingController],
        providers: [
            emailing_service_1.EmailingService,
            emailing_send_service_1.EmailingSendService,
            emailing_validation_service_1.EmailingValidationService,
            admin_emailing_service_1.AdminEmailingService,
        ],
        exports: [emailing_service_1.EmailingService],
    })
], EmailingModule);
//# sourceMappingURL=emailing.module.js.map