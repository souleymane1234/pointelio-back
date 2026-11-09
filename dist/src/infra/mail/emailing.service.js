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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailingService = void 0;
const common_1 = require("@nestjs/common");
const emailing_send_service_1 = require("./send/services/emailing-send.service");
let EmailingService = class EmailingService {
    emailingSend;
    constructor(emailingSend) {
        this.emailingSend = emailingSend;
    }
    isEnabled() {
        return this.emailingSend.isEnabled();
    }
    async send(dto) {
        return this.emailingSend.send(dto);
    }
};
exports.EmailingService = EmailingService;
exports.EmailingService = EmailingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [emailing_send_service_1.EmailingSendService])
], EmailingService);
//# sourceMappingURL=emailing.service.js.map