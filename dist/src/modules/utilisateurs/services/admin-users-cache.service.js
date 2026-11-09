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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersCacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const admin_users_cache_config_1 = require("../config/admin-users-cache.config");
let AdminUsersCacheService = class AdminUsersCacheService {
    cache;
    constructor(cache) {
        this.cache = cache;
    }
    wrap(key, fn, ttlMs) {
        return this.cache.wrap(key, fn, ttlMs ?? admin_users_cache_config_1.ADMIN_USERS_CACHE_TTL_MS);
    }
};
exports.AdminUsersCacheService = AdminUsersCacheService;
exports.AdminUsersCacheService = AdminUsersCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], AdminUsersCacheService);
//# sourceMappingURL=admin-users-cache.service.js.map