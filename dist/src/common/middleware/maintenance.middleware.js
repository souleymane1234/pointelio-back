"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceMiddleware = void 0;
const common_1 = require("@nestjs/common");
const i18n_1 = require("../i18n");
const response_util_1 = require("../utils/response.util");
let MaintenanceMiddleware = class MaintenanceMiddleware {
    MAINTENANCE_ENABLED = process.env.MAINTENANCE_ENABLED === "1";
    use(req, res, next) {
        if (this.MAINTENANCE_ENABLED) {
            const locale = (0, i18n_1.normalizeLocale)(req.headers.language);
            return res.status(600).json((0, response_util_1.maintenanceResponse)(undefined, locale));
        }
        next();
    }
};
exports.MaintenanceMiddleware = MaintenanceMiddleware;
exports.MaintenanceMiddleware = MaintenanceMiddleware = __decorate([
    (0, common_1.Injectable)()
], MaintenanceMiddleware);
//# sourceMappingURL=maintenance.middleware.js.map