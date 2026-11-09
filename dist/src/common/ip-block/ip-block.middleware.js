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
var IpBlockMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpBlockMiddleware = void 0;
const common_1 = require("@nestjs/common");
const response_util_1 = require("../utils/response.util");
const ip_block_service_1 = require("./ip-block.service");
let IpBlockMiddleware = IpBlockMiddleware_1 = class IpBlockMiddleware {
    ipBlockService;
    logger = new common_1.Logger(IpBlockMiddleware_1.name);
    constructor(ipBlockService) {
        this.ipBlockService = ipBlockService;
    }
    use(req, res, next) {
        if (!this.ipBlockService.isEnabled() || !this.ipBlockService.hasRules()) {
            return next();
        }
        const ip = this.ipBlockService.getClientIp(req);
        if (!this.ipBlockService.isBlocked(ip)) {
            return next();
        }
        const path = req.path ||
            (req.originalUrl && req.originalUrl.split("?")[0]) ||
            req.url.split("?")[0];
        this.logger.warn(`${req.method} ${path} blocked for IP ${ip}`);
        return res.status(403).json((0, response_util_1.errorResponse)("Your IP address is blocked."));
    }
};
exports.IpBlockMiddleware = IpBlockMiddleware;
exports.IpBlockMiddleware = IpBlockMiddleware = IpBlockMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ip_block_service_1.IpBlockService])
], IpBlockMiddleware);
//# sourceMappingURL=ip-block.middleware.js.map