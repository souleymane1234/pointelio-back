import { createHash } from "crypto";
import { REDIS_KEY_PREFIX } from "../../common/constants/app.constants";

const generationBumpers = new Set<() => void>();

/** Incrémente les compteurs de génération en mémoire de tous les namespaces (après un vidage Redis). */
export function bumpAllCacheGenerations(): void {
  for (const bump of generationBumpers) bump();
}

export type CacheNamespace<Segment extends string> = {
  prefix: string;
  getGeneration: () => number;
  bumpGeneration: () => void;
  buildKey: (segment: Segment, query: Record<string, unknown>) => string;
};

export type CacheNamespaceOptions = {
  version?: number;
  /** Créneau temporel ajouté à la clé ; `0` = invalidation par TTL / génération uniquement. */
  timeBucketMs?: number;
};

/**
 * Espace de clés cache d'un module. La génération est portée par chaque clé :
 * l'incrémenter après une écriture invalide toutes les lectures du module.
 * La génération vit en mémoire : elle n'est pas partagée entre instances.
 */
export function createCacheNamespace<Segment extends string>(
  name: string,
  options: CacheNamespaceOptions = {},
): CacheNamespace<Segment> {
  const prefix = `${REDIS_KEY_PREFIX}:${name}:v${options.version ?? 1}`;
  const timeBucketMs = options.timeBucketMs ?? 0;
  let generation = 0;

  const bumpGeneration = () => {
    generation += 1;
  };
  generationBumpers.add(bumpGeneration);

  return {
    prefix,
    getGeneration: () => generation,
    bumpGeneration,
    buildKey: (segment, query) => {
      const slot =
        timeBucketMs > 0 ? String(Math.floor(Date.now() / timeBucketMs)) : "0";
      const normalized = JSON.stringify(
        Object.keys(query)
          .sort()
          .filter((k) => query[k] !== undefined)
          .reduce<Record<string, unknown>>((acc, k) => {
            acc[k] = query[k];
            return acc;
          }, {}),
      );
      const hash = createHash("sha256")
        .update(normalized)
        .digest("hex")
        .slice(0, 20);
      return `${prefix}:${segment}:g${generation}:${slot}:${hash}`;
    },
  };
}
