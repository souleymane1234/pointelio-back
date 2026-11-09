import type { ConfigService } from "@nestjs/config";

/**
 * Logs Socket.IO (connexions, emissions, rooms). Desactive par defaut.
 * Activer avec SOCKET_LOGS_ENABLED=true.
 */
export function isSocketLoggingEnabled(config: ConfigService): boolean {
  return config.get<string>("SOCKET_LOGS_ENABLED", "false") === "true";
}
