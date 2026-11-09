"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mariadbPoolConfigFromUrl = mariadbPoolConfigFromUrl;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
function mariadbPoolConfigFromUrl(connectionString) {
    const url = new URL(connectionString);
    const connectionLimit = url.searchParams.get("connection_limit");
    const publicKeyParam = url.searchParams.get("allowPublicKeyRetrieval");
    const allowPublicKeyRetrieval = publicKeyParam !== null
        ? publicKeyParam === "true"
        : LOCAL_HOSTS.has(url.hostname);
    return {
        host: url.hostname,
        port: url.port ? Number(url.port) : 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: decodeURIComponent(url.pathname.replace(/^\//, "")),
        ...(connectionLimit && { connectionLimit: Number(connectionLimit) }),
        allowPublicKeyRetrieval,
        prepareCacheLength: 0,
    };
}
//# sourceMappingURL=mariadb-pool-config.js.map