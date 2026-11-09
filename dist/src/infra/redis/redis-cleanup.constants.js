"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_DIRECT_KEY_PATTERNS = exports.REDIS_KEYV_SCAN_PATTERN = void 0;
const app_constants_1 = require("../../common/constants/app.constants");
exports.REDIS_KEYV_SCAN_PATTERN = "keyv::*";
exports.REDIS_DIRECT_KEY_PATTERNS = [
    `${app_constants_1.REDIS_KEY_PREFIX}:*`,
    "throttler:*",
];
//# sourceMappingURL=redis-cleanup.constants.js.map