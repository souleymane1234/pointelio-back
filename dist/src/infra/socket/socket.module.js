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
var SocketModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../../modules/auth/auth.module");
const socket_logs_config_1 = require("./config/socket-logs.config");
const socket_gateway_1 = require("./socket.gateway");
const socket_auth_service_1 = require("./services/socket-auth.service");
const socket_notifications_service_1 = require("./services/socket-notifications.service");
let SocketModule = SocketModule_1 = class SocketModule {
    config;
    logger = new common_1.Logger(SocketModule_1.name);
    constructor(config) {
        this.config = config;
    }
    onModuleInit() {
        if ((0, socket_logs_config_1.isSocketLoggingEnabled)(this.config)) {
            this.logger.log("SocketModule initialise");
        }
    }
};
exports.SocketModule = SocketModule;
exports.SocketModule = SocketModule = SocketModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [socket_auth_service_1.SocketAuthService, socket_notifications_service_1.SocketNotificationsService, socket_gateway_1.SocketGateway],
        exports: [socket_gateway_1.SocketGateway],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SocketModule);
//# sourceMappingURL=socket.module.js.map