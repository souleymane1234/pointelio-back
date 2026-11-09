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
var IpBlockService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpBlockService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_ip_util_1 = require("../utils/client-ip.util");
let IpBlockService = IpBlockService_1 = class IpBlockService {
    config;
    logger = new common_1.Logger(IpBlockService_1.name);
    rules;
    constructor(config) {
        this.config = config;
        this.rules = this.parseRules(this.config.get("IP_BLOCKLIST", ""));
        if (this.rules.length > 0) {
            this.logger.log(`Loaded ${this.rules.length} blocked IP rule(s)`);
        }
    }
    isEnabled() {
        return this.config.get("IP_BLOCK_ENABLED", "true") !== "false";
    }
    hasRules() {
        return this.rules.length > 0;
    }
    getClientIp(req) {
        return (0, client_ip_util_1.resolveClientIp)(req);
    }
    isBlocked(ip) {
        if (!ip)
            return false;
        const normalizedIp = this.normalizeIp(ip);
        const ipv4Number = this.ipv4ToNumber(normalizedIp);
        return this.rules.some((rule) => {
            if (rule.kind === "exact") {
                return normalizedIp === rule.value;
            }
            if (ipv4Number === undefined) {
                return false;
            }
            return (ipv4Number & rule.mask) >>> 0 === rule.network;
        });
    }
    parseRules(rawList) {
        return rawList
            .split(",")
            .map((raw) => raw.trim())
            .filter(Boolean)
            .map((raw) => this.parseRule(raw))
            .filter((rule) => Boolean(rule));
    }
    parseRule(raw) {
        const [ipPart, prefixPart] = raw.split("/");
        const normalizedIp = this.normalizeIp(ipPart);
        if (prefixPart === undefined) {
            return {
                kind: "exact",
                value: normalizedIp,
                raw,
            };
        }
        const prefix = Number(prefixPart);
        const ipNumber = this.ipv4ToNumber(normalizedIp);
        if (ipNumber === undefined ||
            !Number.isInteger(prefix) ||
            prefix < 0 ||
            prefix > 32) {
            this.logger.warn(`Ignoring invalid IP block rule: ${raw}`);
            return undefined;
        }
        const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
        return {
            kind: "ipv4-cidr",
            network: (ipNumber & mask) >>> 0,
            mask,
            raw,
        };
    }
    normalizeIp(rawIp) {
        return (0, client_ip_util_1.normalizeIp)(rawIp) ?? rawIp.trim().toLowerCase();
    }
    ipv4ToNumber(ip) {
        const parts = ip.split(".");
        if (parts.length !== 4) {
            return undefined;
        }
        const octets = parts.map((part) => Number(part));
        if (octets.some((octet, index) => !Number.isInteger(octet) ||
            octet < 0 ||
            octet > 255 ||
            String(octet) !== parts[index])) {
            return undefined;
        }
        return (((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>>
            0);
    }
};
exports.IpBlockService = IpBlockService;
exports.IpBlockService = IpBlockService = IpBlockService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IpBlockService);
//# sourceMappingURL=ip-block.service.js.map