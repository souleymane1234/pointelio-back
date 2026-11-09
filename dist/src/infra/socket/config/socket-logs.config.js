"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSocketLoggingEnabled = isSocketLoggingEnabled;
function isSocketLoggingEnabled(config) {
    return config.get("SOCKET_LOGS_ENABLED", "false") === "true";
}
//# sourceMappingURL=socket-logs.config.js.map