import type { PoolConfig } from "mariadb";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

/**
 * Convertit une URL `mysql://user:pass@host:port/db` en config de pool mariadb.
 * `prepareCacheLength: 0` reproduit le défaut que l'adapter Prisma applique à ses
 * propres pools (non appliqué aux pools externes).
 *
 * MySQL 8 (`caching_sha2_password`) : après un redémarrage du serveur, une
 * connexion sans TLS exige la clé publique RSA, sinon toutes les connexions
 * échouent (pool vide). Autorisé par défaut en local ; ailleurs, utiliser TLS ou
 * `?allowPublicKeyRetrieval=true`.
 */
export function mariadbPoolConfigFromUrl(connectionString: string): PoolConfig {
  const url = new URL(connectionString);
  const connectionLimit = url.searchParams.get("connection_limit");
  const publicKeyParam = url.searchParams.get("allowPublicKeyRetrieval");
  const allowPublicKeyRetrieval =
    publicKeyParam !== null
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
