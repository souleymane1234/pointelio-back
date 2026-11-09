"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpBlockModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ip_block_middleware_1 = require("./ip-block.middleware");
const ip_block_service_1 = require("./ip-block.service");
let IpBlockModule = class IpBlockModule {
    configure(consumer) {
        consumer
            .apply(ip_block_middleware_1.IpBlockMiddleware)
            .forRoutes({ path: "{*splat}", method: common_1.RequestMethod.ALL });
    }
};
exports.IpBlockModule = IpBlockModule;
exports.IpBlockModule = IpBlockModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [ip_block_middleware_1.IpBlockMiddleware, ip_block_service_1.IpBlockService],
        exports: [ip_block_service_1.IpBlockService],
    })
], IpBlockModule);
//# sourceMappingURL=ip-block.module.js.map